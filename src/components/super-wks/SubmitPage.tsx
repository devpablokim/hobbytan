'use client';

import { useState } from 'react';
import type { Role, User } from '@/lib/super-wks/types';
import { curriculum, submissions } from '@/lib/super-wks/mockData';

export function SubmitPage({ user, role: _role }: { user: User; role: Role }) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const weekCurriculum = curriculum.find(c => c.weekNumber === selectedWeek);
  const mySubmissions = submissions.filter(s => s.userId === user.userId);

  const handleSubmit = () => {
    if (!selectedAssignment || !content.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setContent('');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">과제 제출</h1>

      {/* Submit Form */}
      <div className="bg-[#111111] border border-[#262626] p-6 mb-8">
        <h2 className="text-sm font-medium text-white mb-4">새 과제 제출</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">주차 선택</label>
            <select
              value={selectedWeek}
              onChange={e => { setSelectedWeek(Number(e.target.value)); setSelectedAssignment(''); }}
              className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm"
            >
              {curriculum.map(c => (
                <option key={c.weekNumber} value={c.weekNumber}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">과제 선택</label>
            <select
              value={selectedAssignment}
              onChange={e => setSelectedAssignment(e.target.value)}
              className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm"
            >
              <option value="">과제를 선택하세요</option>
              {weekCurriculum?.assignments.map(a => (
                <option key={a.assignmentId} value={a.assignmentId}>{a.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-neutral-500 mb-1.5">내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="과제 내용을 입력하세요..."
            rows={5}
            className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm placeholder-neutral-600 resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!selectedAssignment || !content.trim()}
            className="px-6 py-2 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            제출하기
          </button>
          <button className="px-6 py-2 border border-[#404040] text-neutral-400 text-sm hover:text-white hover:border-[#525252] transition-all">
            📎 파일 첨부
          </button>
          {submitted && <span className="text-sm text-emerald-400">✅ 제출 완료!</span>}
        </div>
      </div>

      {/* My Submissions */}
      <h2 className="text-lg font-semibold text-white mb-4">제출 내역</h2>
      <div className="bg-[#111111] border border-[#262626]">
        {mySubmissions.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">아직 제출한 과제가 없습니다.</div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {mySubmissions.map(s => (
              <div key={s.submissionId} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{s.weekNumber}주차 과제</span>
                  <div className="flex items-center gap-2">
                    {s.feedback ? (
                      <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">피드백 완료</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400">리뷰 대기</span>
                    )}
                    <span className="text-xs text-neutral-600">{new Date(s.submittedAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-400">{s.content}</p>
                {s.feedback && (
                  <div className="mt-3 bg-emerald-500/5 border border-emerald-500/10 p-3">
                    <div className="text-xs text-neutral-500 mb-1">피드백</div>
                    <p className="text-sm text-emerald-300">{s.feedback.comment}</p>
                    {s.feedback.score && <span className="text-xs text-emerald-400 mt-1 block">점수: {s.feedback.score}점</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
