'use client';

import Link from 'next/link';
import type { Role, User } from '@/lib/super-wks/types';
import { useTeams, useAllUsers, useSubmissions } from '@/lib/super-wks/useFirestoreData';
import { ProgressBar } from './ProgressBar';

export function TeamDetailPage({ teamId, user: _user, role: _role }: { teamId: string; user: User; role: Role }) {
  const { data: teamsData, loading: teamsLoading } = useTeams();
  const { data: usersData } = useAllUsers();
  const { data: subsData } = useSubmissions({ teamId });

  const team = (teamsData || []).find(t => t.teamId === teamId);
  const teamMembers = (usersData || []).filter(u => u.teamId === teamId);
  const teamSubmissions = (subsData || []);

  if (teamsLoading) {
    return <div className="text-neutral-500 text-sm py-8 text-center">로딩 중...</div>;
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">팀을 찾을 수 없습니다.</p>
        <Link href="/super-wks/dashboard" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">← 대시보드로 돌아가기</Link>
      </div>
    );
  }

  const lead = (usersData || []).find(u => u.uid === team.teamLeadId);

  return (
    <div>
      <Link href="/super-wks/dashboard" className="text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-4 inline-block">← 대시보드</Link>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">{team.name}</h1>
          <p className="text-neutral-500 text-sm mt-1">리더: {lead?.nickname || lead?.displayName || '-'} · {teamMembers.length}명 · Week {team.currentWeek}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 border ${team.status === 'active' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-neutral-500/20 bg-neutral-500/10 text-neutral-400'}`}>
          {team.status === 'active' ? '진행 중' : '수료 완료'}
        </span>
      </div>

      {/* Team Progress */}
      <div className="bg-[#111111] border border-[#262626] p-6 mb-6">
        <h2 className="text-sm font-medium text-white mb-4">팀 전체 진행률</h2>
        <div className="space-y-2">
          {([0,1,2,3,4,5] as const).map(w => (
            <ProgressBar key={w} value={team.progress[`week${w}`]} label={`${w}주차`} />
          ))}
        </div>
      </div>

      {/* Members */}
      <h2 className="text-lg font-semibold text-white mb-4">팀원 상세</h2>
      <div className="bg-[#111111] border border-[#262626] overflow-x-auto mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">이름</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">역할</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">직무</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">상태</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.uid} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs shrink-0">
                      {(member.nickname || member.displayName || '?')[0]}
                    </div>
                    <span className="text-sm text-white">{member.nickname || member.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-1.5 py-0.5 border ${member.role === 'team_lead' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20'}`}>
                    {member.role === 'team_lead' ? '리더' : '수강생'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-400">{member.jobRole || '-'}</td>
                <td className="text-center px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 border ${member.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submissions */}
      <h2 className="text-lg font-semibold text-white mb-4">팀 제출물 ({teamSubmissions.length}건)</h2>
      <div className="bg-[#111111] border border-[#262626]">
        {teamSubmissions.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">제출물이 없습니다.</div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {teamSubmissions.map(s => {
              const submitter = (usersData || []).find(u => u.uid === s.userId);
              return (
                <div key={s.submissionId} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{submitter?.nickname || submitter?.displayName || '알 수 없음'}</span>
                      <span className="text-xs text-neutral-500">{s.weekNumber}주차</span>
                    </div>
                    {s.feedback ? (
                      <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">피드백 완료</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400">리뷰 대기</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400">{s.content}</p>
                  {s.feedback && (
                    <div className="mt-2 bg-emerald-500/5 border border-emerald-500/10 p-3 text-sm text-emerald-300">
                      💬 {s.feedback.comment} {s.feedback.score && `(${s.feedback.score}점)`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
