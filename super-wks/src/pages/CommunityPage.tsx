import { useState } from 'react';
import { posts } from '../data/mockData';
import type { User } from '../types';
import { EmptyState } from '../components/EmptyState';

interface CommentData {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

const mockComments: Record<string, CommentData[]> = {
  'p1': [
    { id: 'c1', authorName: '박민수', content: '저도 비슷하게 해봤는데 정말 효율적이에요! 프롬프트 공유해주실 수 있나요?', createdAt: '2026-03-10T11:30:00' },
    { id: 'c2', authorName: '김서연', content: '마케팅 카피 자동화 너무 좋네요. 우리 팀도 적용해봐야겠어요.', createdAt: '2026-03-10T14:00:00' },
  ],
  'p2': [
    { id: 'c3', authorName: '이수진', content: 'n8n 설정 방법 자세히 알려주세요! Slack 연동 부분이 궁금해요.', createdAt: '2026-03-15T16:00:00' },
    { id: 'c4', authorName: '한동현', content: '이거 대박이네요. 발주 업무에도 적용 가능할까요?', createdAt: '2026-03-16T09:00:00' },
    { id: 'c5', authorName: '윤재호', content: '와 이런 자동화가 가능하다니 놀랍습니다!', createdAt: '2026-03-16T10:30:00' },
  ],
  'p3': [
    { id: 'c6', authorName: '송미래', content: '파이팅!! 다음 주부터 열심히 해봐요 🔥', createdAt: '2026-03-07T19:00:00' },
  ],
};

export function CommunityPage({ user }: { user?: User }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [allComments, setAllComments] = useState(mockComments);
  const [allPosts, setAllPosts] = useState(posts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleCreatePost = () => {
    if (!title.trim() || !content.trim()) return;
    const newPost = {
      postId: `p${Date.now()}`,
      authorId: user?.userId || 'unknown',
      authorName: user?.displayName || '익명',
      authorPhotoURL: null,
      cohortId: 'cohort-3',
      teamId: null,
      title,
      content,
      attachments: [],
      likesCount: 0,
      commentsCount: 0,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    setAllPosts([newPost, ...allPosts]);
    setTitle('');
    setContent('');
    setShowForm(false);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const newComment: CommentData = {
      id: `c${Date.now()}`,
      authorName: user?.displayName || '익명',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setAllComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setAllPosts(prev => prev.map(p => p.postId === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
  };

  const handleLike = (postId: string) => {
    if (likedPosts.has(postId)) return;
    setLikedPosts(prev => new Set([...prev, postId]));
    setAllPosts(prev => prev.map(p => p.postId === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          {showForm ? '취소' : '✏️ 글 작성'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">새 글 작성</h2>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mb-3" placeholder="제목을 입력하세요" />
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm mb-3" placeholder="내용을 작성하세요..." />
          <button onClick={handleCreatePost} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">게시하기</button>
        </div>
      )}

      {allPosts.length === 0 ? (
        <EmptyState icon="💬" title="아직 게시글이 없습니다" description="첫 번째 글을 작성해 보세요!" action={{ label: '글 작성', onClick: () => setShowForm(true) }} />
      ) : (
        <div className="space-y-4">
          {allPosts.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(post => {
            const comments = allComments[post.postId] || [];
            const isExpanded = expandedPost === post.postId;
            return (
              <div key={post.postId} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div>
                    {post.pinned && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mr-2">📌 고정</span>}
                    {post.teamId && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full mr-2">팀 전용</span>}
                    <h3 className="font-bold text-gray-900 mt-1">{post.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                  <span>👤 {post.authorName}</span>
                  <button onClick={() => handleLike(post.postId)} className={`hover:text-red-500 transition-colors ${likedPosts.has(post.postId) ? 'text-red-500' : ''}`}>
                    ❤️ {post.likesCount}
                  </button>
                  <button onClick={() => setExpandedPost(isExpanded ? null : post.postId)} className="hover:text-indigo-600 transition-colors">
                    💬 {post.commentsCount}
                  </button>
                  <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>

                {/* Comments Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t">
                    {comments.length === 0 ? (
                      <p className="text-sm text-gray-400 mb-3">아직 댓글이 없습니다.</p>
                    ) : (
                      <div className="space-y-3 mb-4">
                        {comments.map(c => (
                          <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{c.authorName}</span>
                              <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <p className="text-sm text-gray-600">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        value={commentInputs[post.postId] || ''}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.postId]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(post.postId)}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        placeholder="댓글을 입력하세요..."
                      />
                      <button onClick={() => handleAddComment(post.postId)} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">전송</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
