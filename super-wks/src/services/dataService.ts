import type { Cohort, Curriculum, Team, User, Submission, Post, Comment } from '../types';
import { cohort, curriculum, teams, users, submissions, posts } from '../data/mockData';
import { isFirebaseConfigured } from '../lib/firebase';

// Data service abstraction - switches between mock and Firestore

export interface DataService {
  // Cohorts
  getCohorts(): Promise<Cohort[]>;
  getCohort(id: string): Promise<Cohort | null>;

  // Curriculum
  getCurriculum(cohortId: string): Promise<Curriculum[]>;
  updateCurriculum(id: string, data: Partial<Curriculum>): Promise<void>;
  addAssignment(curriculumId: string, assignment: Curriculum['assignments'][0]): Promise<void>;
  deleteAssignment(curriculumId: string, assignmentId: string): Promise<void>;

  // Teams
  getTeams(cohortId: string): Promise<Team[]>;
  getTeam(id: string): Promise<Team | null>;

  // Users
  getUsers(cohortId: string): Promise<User[]>;
  getUsersByTeam(teamId: string): Promise<User[]>;
  updateUserProgress(userId: string, weekNumber: number, status: 'not-started' | 'in-progress' | 'completed'): Promise<void>;

  // Submissions
  getSubmissions(filters: { cohortId?: string; teamId?: string; userId?: string; weekNumber?: number }): Promise<Submission[]>;
  createSubmission(submission: Omit<Submission, 'submissionId' | 'submittedAt' | 'feedback'>): Promise<Submission>;
  addFeedback(submissionId: string, feedback: NonNullable<Submission['feedback']>): Promise<void>;

  // Community
  getPosts(cohortId: string, teamId?: string): Promise<Post[]>;
  createPost(post: Omit<Post, 'postId' | 'createdAt' | 'likesCount' | 'commentsCount'>): Promise<Post>;
  getComments(postId: string): Promise<Comment[]>;
  createComment(postId: string, comment: Omit<Comment, 'commentId' | 'createdAt'>): Promise<Comment>;
  likePost(postId: string): Promise<void>;
}

// Mock implementation with in-memory state
class MockDataService implements DataService {
  private _curriculum = [...curriculum];
  private _teams = [...teams];
  private _users = [...users];
  private _submissions = [...submissions];
  private _posts = [...posts];
  private _comments: (Comment & { postId: string })[] = [];

  async getCohorts() { return [cohort]; }
  async getCohort(id: string) { return id === cohort.cohortId ? cohort : null; }

  async getCurriculum(_cohortId: string) { return this._curriculum.sort((a, b) => a.order - b.order); }

  async updateCurriculum(id: string, data: Partial<Curriculum>) {
    const idx = this._curriculum.findIndex(c => c.curriculumId === id);
    if (idx >= 0) this._curriculum[idx] = { ...this._curriculum[idx], ...data };
  }

  async addAssignment(curriculumId: string, assignment: Curriculum['assignments'][0]) {
    const cur = this._curriculum.find(c => c.curriculumId === curriculumId);
    if (cur) cur.assignments.push(assignment);
  }

  async deleteAssignment(curriculumId: string, assignmentId: string) {
    const cur = this._curriculum.find(c => c.curriculumId === curriculumId);
    if (cur) cur.assignments = cur.assignments.filter(a => a.assignmentId !== assignmentId);
  }

  async getTeams(_cohortId: string) { return this._teams; }
  async getTeam(id: string) { return this._teams.find(t => t.teamId === id) || null; }

  async getUsers(_cohortId: string) { return this._users.filter(u => u.role !== 'admin'); }
  async getUsersByTeam(teamId: string) { return this._users.filter(u => u.teamId === teamId); }

  async updateUserProgress(userId: string, weekNumber: number, status: 'not-started' | 'in-progress' | 'completed') {
    const user = this._users.find(u => u.userId === userId);
    if (user) {
      const weekKey = `week${weekNumber}` as keyof typeof user.progress;
      user.progress[weekKey] = { status, completedAt: status === 'completed' ? new Date().toISOString() : null };

      // Auto-update team progress cache (C-4)
      if (user.teamId) {
        const team = this._teams.find(t => t.teamId === user.teamId);
        if (team) {
          const teamMembers = this._users.filter(u => u.teamId === team.teamId);
          const completed = teamMembers.filter(u => u.progress[weekKey].status === 'completed').length;
          const progKey = `week${weekNumber}` as keyof typeof team.progress;
          (team.progress as unknown as Record<string, number>)[progKey] = Math.round((completed / teamMembers.length) * 100);
        }
      }
    }
  }

  async getSubmissions(filters: { cohortId?: string; teamId?: string; userId?: string; weekNumber?: number }) {
    return this._submissions.filter(s =>
      (!filters.cohortId || s.cohortId === filters.cohortId) &&
      (!filters.teamId || s.teamId === filters.teamId) &&
      (!filters.userId || s.userId === filters.userId) &&
      (filters.weekNumber === undefined || s.weekNumber === filters.weekNumber)
    );
  }

  async createSubmission(data: Omit<Submission, 'submissionId' | 'submittedAt' | 'feedback'>): Promise<Submission> {
    const submission: Submission = {
      ...data,
      submissionId: `s${Date.now()}`,
      submittedAt: new Date().toISOString(),
      feedback: null,
    };
    this._submissions.push(submission);

    // Auto-update user progress to in-progress
    await this.updateUserProgress(data.userId, data.weekNumber, 'in-progress');

    return submission;
  }

  async addFeedback(submissionId: string, feedback: NonNullable<Submission['feedback']>) {
    const sub = this._submissions.find(s => s.submissionId === submissionId);
    if (sub) sub.feedback = feedback;
  }

  async getPosts(_cohortId: string, teamId?: string) {
    return this._posts
      .filter(p => !teamId || p.teamId === teamId || p.teamId === null)
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPost(data: Omit<Post, 'postId' | 'createdAt' | 'likesCount' | 'commentsCount'>): Promise<Post> {
    const post: Post = { ...data, postId: `p${Date.now()}`, createdAt: new Date().toISOString(), likesCount: 0, commentsCount: 0 };
    this._posts.push(post);
    return post;
  }

  async getComments(postId: string) {
    return this._comments.filter(c => c.postId === postId);
  }

  async createComment(postId: string, data: Omit<Comment, 'commentId' | 'createdAt'>): Promise<Comment> {
    const comment: Comment & { postId: string } = {
      ...data, commentId: `c${Date.now()}`, createdAt: new Date().toISOString(), postId,
    };
    this._comments.push(comment);
    const post = this._posts.find(p => p.postId === postId);
    if (post) post.commentsCount++;
    return comment;
  }

  async likePost(postId: string) {
    const post = this._posts.find(p => p.postId === postId);
    if (post) post.likesCount++;
  }
}

// Firestore implementation placeholder
class FirestoreDataService implements DataService {
  async getCohorts(): Promise<Cohort[]> { throw new Error('Not implemented'); }
  async getCohort(_id: string): Promise<Cohort | null> { throw new Error('Not implemented'); }
  async getCurriculum(_cohortId: string): Promise<Curriculum[]> { throw new Error('Not implemented'); }
  async updateCurriculum(_id: string, _data: Partial<Curriculum>): Promise<void> { throw new Error('Not implemented'); }
  async addAssignment(_curriculumId: string, _assignment: Curriculum['assignments'][0]): Promise<void> { throw new Error('Not implemented'); }
  async deleteAssignment(_curriculumId: string, _assignmentId: string): Promise<void> { throw new Error('Not implemented'); }
  async getTeams(_cohortId: string): Promise<Team[]> { throw new Error('Not implemented'); }
  async getTeam(_id: string): Promise<Team | null> { throw new Error('Not implemented'); }
  async getUsers(_cohortId: string): Promise<User[]> { throw new Error('Not implemented'); }
  async getUsersByTeam(_teamId: string): Promise<User[]> { throw new Error('Not implemented'); }
  async updateUserProgress(_userId: string, _weekNumber: number, _status: 'not-started' | 'in-progress' | 'completed'): Promise<void> { throw new Error('Not implemented'); }
  async getSubmissions(_filters: { cohortId?: string; teamId?: string; userId?: string; weekNumber?: number }): Promise<Submission[]> { throw new Error('Not implemented'); }
  async createSubmission(_submission: Omit<Submission, 'submissionId' | 'submittedAt' | 'feedback'>): Promise<Submission> { throw new Error('Not implemented'); }
  async addFeedback(_submissionId: string, _feedback: NonNullable<Submission['feedback']>): Promise<void> { throw new Error('Not implemented'); }
  async getPosts(_cohortId: string, _teamId?: string): Promise<Post[]> { throw new Error('Not implemented'); }
  async createPost(_post: Omit<Post, 'postId' | 'createdAt' | 'likesCount' | 'commentsCount'>): Promise<Post> { throw new Error('Not implemented'); }
  async getComments(_postId: string): Promise<Comment[]> { throw new Error('Not implemented'); }
  async createComment(_postId: string, _comment: Omit<Comment, 'commentId' | 'createdAt'>): Promise<Comment> { throw new Error('Not implemented'); }
  async likePost(_postId: string): Promise<void> { throw new Error('Not implemented'); }
}

export function createDataService(): DataService {
  if (isFirebaseConfigured()) return new FirestoreDataService();
  return new MockDataService();
}

export const dataService = createDataService();
