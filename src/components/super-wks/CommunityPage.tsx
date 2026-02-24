'use client';

import { useState } from 'react';
import type { Role, User } from '@/lib/super-wks/types';
import { posts } from '@/lib/super-wks/mockData';

export function CommunityPage({ user: _user, role: _role }: { user: User; role: Role }) {
  const [showCompose, setShowCompose] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setNewTitle('');
    setNewContent('');
    setShowCompose(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">커뮤니티</h1>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          ✏️ 글 작성
        </button>
      </div>

      {/* Compose */}
      {showCompose && (
        <div className="bg-[#111111] border border-emerald-500/20 p-5 mb-6">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="제목"
            className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm placeholder-neutral-600 mb-3"
          />
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            rows={4}
            className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm placeholder-neutral-600 resize-none mb-3"
          />
          <div className="flex gap-2">
            <button onClick={handlePost} className="px-4 py-1.5 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">게시</button>
            <button onClick={() => setShowCompose(false)} className="px-4 py-1.5 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">취소</button>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.postId} className={`bg-[#111111] border ${post.pinned ? 'border-emerald-500/30' : 'border-[#262626]'} p-5 hover:border-[#404040] transition-colors`}>
            {post.pinned && (
              <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-3 inline-block">📌 고정</span>
            )}
            <h3 className="text-sm font-medium text-white mb-1">{post.title}</h3>
            <p className="text-sm text-neutral-400 mb-3">{post.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[10px] text-neutral-500">
                  {post.authorName[0]}
                </div>
                <span className="text-xs text-neutral-500">{post.authorName}</span>
                <span className="text-xs text-neutral-600">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>❤️ {post.likesCount}</span>
                <span>💬 {post.commentsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
