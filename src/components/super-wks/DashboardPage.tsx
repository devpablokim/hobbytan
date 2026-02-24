'use client';

import Link from 'next/link';
import type { Role, User } from '@/lib/super-wks/types';
import { teams, users, cohort, curriculum, submissions } from '@/lib/super-wks/mockData';
import { ProgressBar } from './ProgressBar';
import { WeekBadge } from './WeekBadge';

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-[#111111] border border-[#262626] p-5">
      <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function AdminDashboard() {
  const studentCount = users.filter(u => u.role !== 'admin').length;
  const totalSubmissions = submissions.length;
  const avgProgress = Math.round(
    teams.reduce((sum, t) => {
      const weekValues = [t.progress.week0, t.progress.week1, t.progress.week2, t.progress.week3, t.progress.week4, t.progress.week5];
      return sum + weekValues.reduce((a, b) => a + b, 0) / 6;
    }, 0) / teams.length
  );

  return (
    <div>
      {/* Cohort Header */}
      <div className="flex items-center gap-3 mb-6">
        <select className="border border-[#404040] bg-[#171717] text-white px-3 py-1.5 text-sm" defaultValue="cohort-3">
          <option value="cohort-3">3기 (진행 중)</option>
          <option value="cohort-2" disabled>2기 (수료 완료)</option>
          <option value="cohort-1" disabled>1기 (수료 완료)</option>
        </select>
        <span className="text-xs text-neutral-500">{cohort.startDate} ~ {cohort.endDate}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#262626] border border-[#262626] mb-8">
        <StatCard label="기수" value={cohort.name} />
        <StatCard label="팀 수" value={`${teams.length}팀`} />
        <StatCard label="수강생" value={`${studentCount}명`} />
        <StatCard label="평균 진행률" value={`${avgProgress}%`} accent />
      </div>

      {/* Teams Overview */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">팀별 진행 현황</h2>
        <span className="text-xs text-neutral-500">총 제출물: {totalSubmissions}건</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {teams.map(team => {
          const teamMembers = users.filter(u => u.teamId === team.teamId);
          const lead = users.find(u => u.userId === team.teamLeadId);
          return (
            <Link href={`/super-wks/team/${team.teamId}`} key={team.teamId} className="bg-[#111111] border border-[#262626] p-6 hover:border-[#404040] transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{team.name}</h3>
                <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">Week {team.currentWeek}</span>
              </div>
              <div className="text-xs text-neutral-500 mb-3">리더: {lead?.displayName} · {teamMembers.length}명</div>
              <div className="space-y-1.5">
                {([0,1,2,3,4,5] as const).map(w => (
                  <ProgressBar key={w} value={team.progress[`week${w}`]} label={`${w}주`} size="sm" />
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* All Students Table */}
      <h2 className="text-lg font-semibold text-white mb-4">전체 수강생 현황</h2>
      <div className="bg-[#111111] border border-[#262626] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">이름</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">팀</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">역할</th>
              {[0,1,2,3,4,5].map(w => (
                <th key={w} className="text-center px-2 py-3 text-xs font-medium text-neutral-500">{w}주</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.role !== 'admin').map(u => {
              const team = teams.find(t => t.teamId === u.teamId);
              const weekKeys = ['week0','week1','week2','week3','week4','week5'] as const;
              return (
                <tr key={u.userId} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]">
                  <td className="px-4 py-3 text-sm text-white">{u.displayName}</td>
                  <td className="px-4 py-3 text-sm text-neutral-400">{team?.name || '-'}</td>
                  <td className="text-center px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 border ${u.role === 'team_lead' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20'}`}>
                      {u.role === 'team_lead' ? '리더' : '수강생'}
                    </span>
                  </td>
                  {weekKeys.map(w => (
                    <td key={w} className="text-center px-2 py-3"><WeekBadge status={u.progress[w].status} /></td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Activity */}
      <h2 className="text-lg font-semibold text-white mt-8 mb-4">최근 활동</h2>
      <div className="bg-[#111111] border border-[#262626] divide-y divide-[#1a1a1a]">
        {submissions.slice(0, 5).map(s => {
          const submitter = users.find(u => u.userId === s.userId);
          return (
            <div key={s.submissionId} className="px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-sm text-white">{submitter?.displayName}</span>
                <span className="text-sm text-neutral-500 ml-2">{s.weekNumber}주차 과제 제출</span>
              </div>
              <div className="flex items-center gap-2">
                {s.feedback ? (
                  <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">피드백 완료</span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400">리뷰 대기</span>
                )}
                <span className="text-xs text-neutral-600">{new Date(s.submittedAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentDashboard({ user }: { user: User }) {
  const myTeam = teams.find(t => t.teamId === user.teamId);
  const weekKeys = ['week0','week1','week2','week3','week4','week5'] as const;
  const completedWeeks = weekKeys.filter(w => user.progress[w].status === 'completed').length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#262626] border border-[#262626] mb-8">
        <StatCard label="내 팀" value={myTeam?.name || '-'} />
        <StatCard label="완료 주차" value={`${completedWeeks} / 6`} accent />
        <StatCard label="현재 상태" value={weekKeys.find(w => user.progress[w].status === 'in-progress') ? '진행 중' : '대기'} />
      </div>

      {/* My Progress */}
      <h2 className="text-lg font-semibold text-white mb-4">내 진행 현황</h2>
      <div className="bg-[#111111] border border-[#262626] p-6 mb-6">
        <div className="space-y-3">
          {weekKeys.map((w, i) => (
            <div key={w} className="flex items-center gap-4">
              <span className="w-12 text-sm text-neutral-500">{i}주차</span>
              <div className="flex-1">
                <ProgressBar value={user.progress[w].status === 'completed' ? 100 : user.progress[w].status === 'in-progress' ? 50 : 0} size="sm" />
              </div>
              <WeekBadge status={user.progress[w].status} />
            </div>
          ))}
        </div>
      </div>

      {/* My Submissions */}
      <h2 className="text-lg font-semibold text-white mb-4">내 제출물 & 피드백</h2>
      <div className="bg-[#111111] border border-[#262626] divide-y divide-[#1a1a1a]">
        {submissions.filter(s => s.userId === user.userId).length === 0 ? (
          <div className="p-6 text-center text-neutral-500 text-sm">아직 제출한 과제가 없습니다.</div>
        ) : (
          submissions.filter(s => s.userId === user.userId).map(s => (
            <div key={s.submissionId} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{s.weekNumber}주차 과제</span>
                {s.feedback ? (
                  <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">피드백 완료</span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400">리뷰 대기</span>
                )}
              </div>
              <p className="text-sm text-neutral-500 mt-1 line-clamp-1">{s.content}</p>
              {s.feedback && (
                <div className="mt-2 bg-emerald-500/5 border border-emerald-500/10 p-3 text-sm text-emerald-300">
                  💬 {s.feedback.comment} {s.feedback.score && <span className="text-emerald-400">({s.feedback.score}점)</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Upcoming */}
      <h2 className="text-lg font-semibold text-white mt-6 mb-4">다가오는 과제</h2>
      <div className="bg-[#111111] border border-[#262626] divide-y divide-[#1a1a1a]">
        {curriculum.filter(c => {
          const wk = `week${c.weekNumber}` as keyof typeof user.progress;
          return user.progress[wk].status !== 'completed';
        }).slice(0, 2).map(c => (
          <div key={c.curriculumId} className="p-4">
            <div className="text-sm font-medium text-white">{c.title}</div>
            {c.assignments.map(a => (
              <div key={a.assignmentId} className="text-sm text-neutral-500 mt-1">📝 {a.title}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Team Progress */}
      {myTeam && (
        <>
          <h2 className="text-lg font-semibold text-white mt-6 mb-4">팀 진행 현황</h2>
          <div className="bg-[#111111] border border-[#262626] p-6">
            <div className="space-y-2">
              {([0,1,2,3,4,5] as const).map(w => (
                <ProgressBar key={w} value={myTeam.progress[`week${w}`]} label={`${w}주차`} size="sm" />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TeamLeadDashboard({ user }: { user: User }) {
  const myTeam = teams.find(t => t.teamId === user.teamId);
  const teamMembers = users.filter(u => u.teamId === user.teamId);
  const weekKeys = ['week0','week1','week2','week3','week4','week5'] as const;

  if (!myTeam) return <div className="text-neutral-400">팀 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#262626] border border-[#262626] mb-8">
        <StatCard label="내 팀" value={myTeam.name} />
        <StatCard label="팀원 수" value={`${teamMembers.length}명`} />
        <StatCard label="현재 주차" value={`Week ${myTeam.currentWeek}`} accent />
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">팀원별 진행 현황</h2>
      <div className="bg-[#111111] border border-[#262626] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">이름</th>
              {weekKeys.map((_, i) => (
                <th key={i} className="text-center px-2 py-3 text-xs font-medium text-neutral-500">{i}주</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.userId} className="border-b border-[#1a1a1a]">
                <td className="px-4 py-3 text-sm text-white">{member.displayName}</td>
                {weekKeys.map(w => (
                  <td key={w} className="text-center px-2 py-3"><WeekBadge status={member.progress[w].status} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Team Submissions */}
      <h2 className="text-lg font-semibold text-white mt-6 mb-4">팀 제출물</h2>
      <div className="bg-[#111111] border border-[#262626] divide-y divide-[#1a1a1a]">
        {submissions.filter(s => s.teamId === myTeam.teamId).length === 0 ? (
          <div className="p-6 text-center text-neutral-500 text-sm">팀 제출물이 없습니다.</div>
        ) : (
          submissions.filter(s => s.teamId === myTeam.teamId).map(s => {
            const submitter = users.find(u => u.userId === s.userId);
            return (
              <div key={s.submissionId} className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-sm text-white">{submitter?.displayName}</span>
                  <span className="text-sm text-neutral-500 ml-2">· {s.weekNumber}주차</span>
                </div>
                {s.feedback ? (
                  <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">피드백 완료</span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400">리뷰 대기</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function DashboardPage({ user, role }: { user: User; role: Role }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">대시보드</h1>
      {role === 'admin' && <AdminDashboard />}
      {role === 'student' && <StudentDashboard user={user} />}
      {role === 'team_lead' && <TeamLeadDashboard user={user} />}
    </div>
  );
}
