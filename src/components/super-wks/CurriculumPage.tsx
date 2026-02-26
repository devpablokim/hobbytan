'use client';

import { useState } from 'react';
import type { Role, User, Curriculum } from '@/lib/super-wks/types';
import { useCurriculum, useSubmissions } from '@/lib/super-wks/useFirestoreData';
import { WeekBadge } from './WeekBadge';

function CurriculumCard({ week, user, role: _role, allSubmissions }: { week: Curriculum; user: User; role: Role; allSubmissions: import('@/lib/super-wks/types').Submission[] }) {
  const [expanded, setExpanded] = useState(false);
  const weekKey = `week${week.weekNumber}` as keyof typeof user.progress;
  const status = user.progress[weekKey]?.status || 'not-started';
  const mySubmissions = allSubmissions.filter(s => s.userId === user.userId && s.weekNumber === week.weekNumber);

  return (
    <div className="bg-[#111111] border border-[#262626] hover:border-[#404040] transition-colors">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 text-left flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold text-sm shrink-0">
            {week.weekNumber}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{week.title}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">{week.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <WeekBadge status={status} />
          <span className="text-neutral-500 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#262626] p-5 space-y-4">
          {/* Objectives */}
          <div>
            <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">학습 목표</h4>
            <ul className="space-y-1">
              {week.objectives.map((obj, i) => (
                <li key={i} className="text-sm text-neutral-400 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span> {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          {week.materials.length > 0 && (
            <div>
              <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">학습 자료</h4>
              <div className="space-y-1">
                {week.materials.map((mat, i) => (
                  <a key={i} href={mat.url} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    {mat.type === 'video' ? '🎥' : mat.type === 'doc' ? '📄' : '🔗'} {mat.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          <div>
            <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">과제 ({week.assignments.length}건)</h4>
            <div className="space-y-2">
              {week.assignments.map(a => {
                const submitted = mySubmissions.find(s => s.assignmentId === a.assignmentId);
                return (
                  <div key={a.assignmentId} className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white">{a.title}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{a.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-neutral-600">마감: {a.dueOffsetDays}일 후</span>
                        <span className="text-[10px] text-neutral-600">·</span>
                        <span className="text-[10px] text-neutral-600">{a.type === 'file' ? '📁 파일' : a.type === 'text' ? '✏️ 텍스트' : '🔗 링크'}</span>
                        {a.required && <span className="text-[10px] text-red-400">필수</span>}
                      </div>
                    </div>
                    {submitted ? (
                      <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shrink-0">제출 완료</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 border border-neutral-500/20 bg-neutral-500/10 text-neutral-400 shrink-0">미제출</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CurriculumPage({ user, role }: { user: User; role: Role }) {
  const { data: curriculum, loading: curLoading } = useCurriculum();
  const { data: submissions } = useSubmissions({ userId: user.userId });

  if (curLoading) {
    return <div className="text-neutral-500 text-sm py-8 text-center">로딩 중...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">커리큘럼</h1>
      <p className="text-neutral-500 text-sm mb-6">5주 파워워크샵 커리큘럼 — 각 주차를 클릭하여 상세 내용을 확인하세요</p>
      <div className="space-y-3">
        {(curriculum || []).map(week => (
          <CurriculumCard key={week.curriculumId} week={week} user={user} role={role} allSubmissions={submissions || []} />
        ))}
      </div>
    </div>
  );
}
