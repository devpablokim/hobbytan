'use client';

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc,
  collection, query, where, getDocs, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  Role, UserStatus, ParticipationStatus, OnboardingData,
  Cohort, Curriculum, Team, Submission, Post, Goal,
} from './types';

// ─── Firestore User Document Schema ───
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  // Onboarding
  nickname: string;
  realName: string;
  organization: string;
  jobRole: string;
  participationStatus: ParticipationStatus;
  // Role & Status
  role: Role;
  status: UserStatus; // 'pending' | 'active' | 'suspended'
  onboarded: boolean;
  // Team
  teamId: string | null;
  cohortId: string;
  // Timestamps
  createdAt: unknown;
  updatedAt: unknown;
  onboardedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
}

const USERS_COL = 'swks_users';
const DEFAULT_COHORT = 'cohort-1';

// ─── User Operations ───

export async function getUserDoc(uid: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, USERS_COL, uid));
  if (!snap.exists()) return null;
  return snap.data() as FirestoreUser;
}

export async function createUserFromOnboarding(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null,
  data: OnboardingData
): Promise<void> {
  const userDoc: FirestoreUser = {
    uid,
    email,
    displayName,
    photoURL,
    nickname: data.nickname,
    realName: data.realName,
    organization: data.organization,
    jobRole: data.jobRole,
    participationStatus: data.participationStatus,
    role: 'student',
    status: 'pending',
    onboarded: true,
    teamId: null,
    cohortId: DEFAULT_COHORT,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    onboardedAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
  };
  await setDoc(doc(db, USERS_COL, uid), userDoc);
}

export async function getAllUsers(): Promise<FirestoreUser[]> {
  const snap = await getDocs(collection(db, USERS_COL));
  return snap.docs.map(d => d.data() as FirestoreUser);
}

export async function getPendingUsers(): Promise<FirestoreUser[]> {
  const q = query(collection(db, USERS_COL), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as FirestoreUser);
}

export async function getActiveUsers(): Promise<FirestoreUser[]> {
  const q = query(collection(db, USERS_COL), where('status', '==', 'active'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as FirestoreUser);
}

export async function approveUser(uid: string, adminUid: string, teamId: string): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    status: 'active',
    teamId,
    approvedAt: new Date().toISOString(),
    approvedBy: adminUid,
    updatedAt: serverTimestamp(),
  });
}

export async function rejectUser(uid: string): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    status: 'suspended',
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserTeam(uid: string, teamId: string): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    teamId,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserRole(uid: string, role: Role): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, USERS_COL, uid));
}

// ─── Admin Check ───
const ADMIN_EMAILS = ['tanhyu.kim@gmail.com'];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}

// ─── Collection Names ───
const COHORTS_COL = 'swks_cohorts';
const TEAMS_COL = 'swks_teams';
const CURRICULUM_COL = 'swks_curriculum';
const SUBMISSIONS_COL = 'swks_submissions';
const POSTS_COL = 'swks_posts';
const GOALS_COL = 'swks_goals';

// ─── Cohort Operations ───

export async function getCohort(cohortId: string): Promise<Cohort | null> {
  const snap = await getDoc(doc(db, COHORTS_COL, cohortId));
  if (!snap.exists()) return null;
  return { cohortId: snap.id, ...snap.data() } as Cohort;
}

export async function getActiveCohort(): Promise<Cohort | null> {
  const q = query(collection(db, COHORTS_COL), where('status', '==', 'active'));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { cohortId: d.id, ...d.data() } as Cohort;
}

export async function setCohort(cohort: Cohort): Promise<void> {
  await setDoc(doc(db, COHORTS_COL, cohort.cohortId), cohort);
}

// ─── Team Operations ───

export async function getTeams(cohortId?: string): Promise<Team[]> {
  let q;
  if (cohortId) {
    q = query(collection(db, TEAMS_COL), where('cohortId', '==', cohortId));
  } else {
    q = query(collection(db, TEAMS_COL));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ teamId: d.id, ...d.data() }) as Team);
}

export async function getTeam(teamId: string): Promise<Team | null> {
  const snap = await getDoc(doc(db, TEAMS_COL, teamId));
  if (!snap.exists()) return null;
  return { teamId: snap.id, ...snap.data() } as Team;
}

export async function setTeam(team: Team): Promise<void> {
  await setDoc(doc(db, TEAMS_COL, team.teamId), team);
}

export async function updateTeamProgress(teamId: string, progress: Partial<Team['progress']>): Promise<void> {
  const updates: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(progress)) {
    updates[`progress.${k}`] = v;
  }
  await updateDoc(doc(db, TEAMS_COL, teamId), updates);
}

// ─── Curriculum Operations ───

export async function getCurriculum(cohortId?: string): Promise<Curriculum[]> {
  let q;
  if (cohortId) {
    q = query(collection(db, CURRICULUM_COL), where('cohortId', '==', cohortId), orderBy('order'));
  } else {
    q = query(collection(db, CURRICULUM_COL), orderBy('order'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ curriculumId: d.id, ...d.data() }) as Curriculum);
}

export async function setCurriculum(cur: Curriculum): Promise<void> {
  await setDoc(doc(db, CURRICULUM_COL, cur.curriculumId), cur);
}

// ─── Submission Operations ───

export async function getSubmissions(filters?: { userId?: string; teamId?: string; cohortId?: string; weekNumber?: number }): Promise<Submission[]> {
  let q = query(collection(db, SUBMISSIONS_COL));
  const constraints = [];
  if (filters?.userId) constraints.push(where('userId', '==', filters.userId));
  if (filters?.teamId) constraints.push(where('teamId', '==', filters.teamId));
  if (filters?.cohortId) constraints.push(where('cohortId', '==', filters.cohortId));
  if (filters?.weekNumber !== undefined) constraints.push(where('weekNumber', '==', filters.weekNumber));
  if (constraints.length > 0) {
    q = query(collection(db, SUBMISSIONS_COL), ...constraints);
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ submissionId: d.id, ...d.data() }) as Submission);
}

export async function createSubmission(sub: Omit<Submission, 'submissionId'>): Promise<string> {
  const ref = await addDoc(collection(db, SUBMISSIONS_COL), {
    ...sub,
    submittedAt: sub.submittedAt || new Date().toISOString(),
  });
  return ref.id;
}

export async function updateSubmission(submissionId: string, data: Partial<Submission>): Promise<void> {
  await updateDoc(doc(db, SUBMISSIONS_COL, submissionId), data as Record<string, unknown>);
}

// ─── Post Operations ───

export async function getPosts(filters?: { cohortId?: string; teamId?: string }): Promise<Post[]> {
  let q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'));
  const constraints = [];
  if (filters?.cohortId) constraints.push(where('cohortId', '==', filters.cohortId));
  if (filters?.teamId) constraints.push(where('teamId', '==', filters.teamId));
  if (constraints.length > 0) {
    q = query(collection(db, POSTS_COL), ...constraints, orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ postId: d.id, ...d.data() }) as Post);
}

export async function createPost(post: Omit<Post, 'postId'>): Promise<string> {
  const ref = await addDoc(collection(db, POSTS_COL), {
    ...post,
    createdAt: post.createdAt || new Date().toISOString(),
  });
  return ref.id;
}

// ─── Goal Operations ───

export async function getGoals(filters?: { teamId?: string; cohortId?: string }): Promise<Goal[]> {
  const constraints = [];
  if (filters?.teamId) constraints.push(where('teamId', '==', filters.teamId));
  if (filters?.cohortId) constraints.push(where('cohortId', '==', filters.cohortId));
  let q;
  if (constraints.length > 0) {
    q = query(collection(db, GOALS_COL), ...constraints);
  } else {
    q = query(collection(db, GOALS_COL));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ goalId: d.id, ...d.data() }) as Goal);
}

export async function createGoal(goal: Omit<Goal, 'goalId'>): Promise<string> {
  const ref = await addDoc(collection(db, GOALS_COL), goal);
  return ref.id;
}

export async function updateGoal(goalId: string, data: Partial<Goal>): Promise<void> {
  await updateDoc(doc(db, GOALS_COL, goalId), data as Record<string, unknown>);
}

// ─── Seed Data (초기 데이터 투입용) ───

export async function seedCollectionIfEmpty(colName: string, items: Array<{ id: string; data: Record<string, unknown> }>): Promise<boolean> {
  const snap = await getDocs(collection(db, colName));
  if (!snap.empty) return false; // already has data
  for (const item of items) {
    await setDoc(doc(db, colName, item.id), item.data);
  }
  return true;
}
