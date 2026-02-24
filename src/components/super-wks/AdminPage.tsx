'use client';

import { useState } from 'react';
import { teams, users, cohort, pendingUsers, goals, submissions, posts } from '@/lib/super-wks/mockData';
import type { User } from '@/lib/super-wks/types';
import { Modal } from './Modal';
import { ProgressBar } from './ProgressBar';

// ─── Participation / Contribution Calculator ───
function calculateParticipation(allUsers: User[]) {
  return allUsers.filter(u => u.role !== 'admin').map(u => {
    const userSubmissions = submissions.filter(s => s.userId === u.userId);
    const userPosts = posts.filter(p => p.authorId === u.userId);
    const submissionScore = userSubmissions.length * 30;
    const feedbackScore = userSubmissions.filter(s => s.feedback).reduce((sum, s) => sum + (s.feedback?.score || 0), 0);
    const postScore = userPosts.length * 10;
    const commentScore = userPosts.reduce((sum, p) => sum + p.commentsCount, 0) * 5;
    const totalScore = submissionScore + feedbackScore + postScore + commentScore;
    return {
      userId: u.userId,
      displayName: u.displayName,
      teamId: u.teamId,
      submissionCount: userSubmissions.length,
      postCount: userPosts.length,
      totalScore,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}

function ParticipationChart({ data }: { data: ReturnType<typeof calculateParticipation> }) {
  const maxScore = Math.max(...data.map(d => d.totalScore), 1);
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.userId} className="flex items-center gap-3">
          <span className="w-20 text-xs text-neutral-400 truncate">{d.displayName}</span>
          <div className="flex-1 h-5 bg-[#1a1a1a] relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-emerald-500/60 transition-all"
              style={{ width: `${(d.totalScore / maxScore) * 100}%` }}
            />
            <span className="absolute inset-y-0 right-2 text-[10px] text-neutral-300 flex items-center">{d.totalScore}점</span>
          </div>
          <div className="flex gap-2 text-[10px] text-neutral-500 w-24 justify-end shrink-0">
            <span>📝{d.submissionCount}</span>
            <span>💬{d.postCount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminPage() {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [pending, setPending] = useState(pendingUsers);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const participation = calculateParticipation(users);

  const handleApprove = (userId: string) => {
    setPending(prev => prev.filter(u => u.userId !== userId));
  };
  const handleReject = (userId: string) => {
    setPending(prev => prev.filter(u => u.userId !== userId));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">관리자 패널</h1>

      {/* ─── AUTH-2: Pending Users ─── */}
      {pending.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-amber-400">⏳ 승인 대기 ({pending.length}명)</h2>
          </div>
          <div className="space-y-3">
            {pending.map(u => (
              <div key={u.userId} className="flex items-center justify-between bg-[#111111] border border-[#262626] px-4 py-3">
                <div>
                  <span className="text-sm text-white">{u.displayName}</span>
                  <span className="text-xs text-neutral-500 ml-2">{u.email}</span>
                  <span className="text-[10px] px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400 ml-2">pending</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(u.userId)} className="px-3 py-1 bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition-colors">✅ 승인</button>
                  <button onClick={() => handleReject(u.userId)} className="px-3 py-1 bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 border border-red-500/20 transition-colors">❌ 거절</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cohort Info */}
      <div className="bg-[#111111] border border-[#262626] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">기수 정보</h2>
          <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/20 px-2 py-1">✏️ 수정</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-neutral-500">기수:</span> <span className="text-white ml-1">{cohort.name}</span></div>
          <div><span className="text-neutral-500">상태:</span> <span className="text-emerald-400 ml-1">{cohort.status}</span></div>
          <div><span className="text-neutral-500">시작일:</span> <span className="text-white ml-1">{cohort.startDate}</span></div>
          <div><span className="text-neutral-500">종료일:</span> <span className="text-white ml-1">{cohort.endDate}</span></div>
        </div>
      </div>

      {/* ─── GOAL: Team Goals ─── */}
      <div className="bg-[#111111] border border-[#262626] p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">🎯 공동 목표</h2>
          <button onClick={() => setShowGoalModal(true)} className="px-3 py-1.5 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">+ 목표 추가</button>
        </div>
        {teams.map(team => {
          const teamGoals = goals.filter(g => g.teamId === team.teamId);
          if (teamGoals.length === 0) return null;
          return (
            <div key={team.teamId} className="mb-4 last:mb-0">
              <div className="text-xs text-neutral-500 uppercase mb-2">{team.name}</div>
              <div className="space-y-2">
                {teamGoals.map(g => (
                  <div key={g.goalId} className="bg-[#0a0a0a] border border-[#1a1a1a] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{g.title}</span>
                      <span className="text-xs text-emerald-400">{g.currentValue}/{g.targetValue} {g.unit}</span>
                    </div>
                    <ProgressBar value={Math.round((g.currentValue / g.targetValue) * 100)} size="sm" />
                    <p className="text-xs text-neutral-500 mt-1">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Participation & Contribution Chart ─── */}
      <div className="bg-[#111111] border border-[#262626] p-5 mb-6">
        <h2 className="font-semibold text-white mb-4">📊 참여도 / 기여도</h2>
        <ParticipationChart data={participation} />
      </div>

      {/* Teams Management */}
      <div className="bg-[#111111] border border-[#262626] mb-6">
        <div className="flex items-center justify-between p-5 border-b border-[#262626]">
          <h2 className="font-semibold text-white">팀 관리 ({teams.length}팀)</h2>
          <button onClick={() => { setEditingTeam(null); setShowTeamModal(true); }} className="px-3 py-1.5 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">
            + 팀 추가
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase">팀명</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">팀 리더</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">인원</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">현재 주차</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">상태</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">작업</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => {
                const lead = users.find(u => u.userId === team.teamLeadId);
                return (
                  <tr key={team.teamId} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]">
                    <td className="px-5 py-3 text-sm text-white">{team.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400">{lead?.displayName || '-'}</td>
                    <td className="text-center px-4 py-3 text-sm text-neutral-400">{team.members.length}명</td>
                    <td className="text-center px-4 py-3 text-sm text-neutral-400">Week {team.currentWeek}</td>
                    <td className="text-center px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">{team.status}</span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <button onClick={() => { setEditingTeam(team.teamId); setShowTeamModal(true); }} className="text-xs text-emerald-400 hover:text-emerald-300 mr-2">수정</button>
                      <button className="text-xs text-red-400 hover:text-red-300">삭제</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students Management */}
      <div className="bg-[#111111] border border-[#262626]">
        <div className="flex items-center justify-between p-5 border-b border-[#262626]">
          <h2 className="font-semibold text-white">수강생 관리 ({users.filter(u => u.role !== 'admin').length}명)</h2>
          <button onClick={() => { setEditingStudent(null); setShowStudentModal(true); }} className="px-3 py-1.5 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">
            + 수강생 추가
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase">이름</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">이메일</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">팀</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">상태</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">역할</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">작업</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role !== 'admin').map(u => {
                return (
                  <tr key={u.userId} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]">
                    <td className="px-5 py-3 text-sm text-white">{u.displayName}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <select className="text-xs border border-[#404040] bg-[#171717] text-neutral-400 px-2 py-1" defaultValue={u.teamId || ''}>
                        <option value="">미배치</option>
                        {teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}
                      </select>
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 border ${u.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : u.status === 'pending' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 border ${u.role === 'team_lead' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20'}`}>
                        {u.role === 'team_lead' ? '팀 리더' : '수강생'}
                      </span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <button onClick={() => { setEditingStudent(u.userId); setShowStudentModal(true); }} className="text-xs text-emerald-400 hover:text-emerald-300 mr-2">수정</button>
                      <button className="text-xs text-red-400 hover:text-red-300">삭제</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Modal */}
      <Modal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} title={editingTeam ? '팀 수정' : '팀 추가'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">팀명</label>
            <input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="Team Delta" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">팀 리더</label>
            <select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm">
              <option value="">선택</option>
              {users.filter(u => u.role !== 'admin').map(u => (
                <option key={u.userId} value={u.userId}>{u.displayName}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">저장</button>
            <button onClick={() => setShowTeamModal(false)} className="px-4 py-2 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">취소</button>
          </div>
        </div>
      </Modal>

      {/* Student Modal */}
      <Modal isOpen={showStudentModal} onClose={() => setShowStudentModal(false)} title={editingStudent ? '수강생 수정' : '수강생 추가'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">이름</label>
            <input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="홍길동" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">이메일</label>
            <input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="email@example.com" type="email" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">팀 배치</label>
            <select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm">
              <option value="">미배치</option>
              {teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">역할</label>
            <select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm">
              <option value="student">수강생</option>
              <option value="team_lead">팀 리더</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">저장</button>
            <button onClick={() => setShowStudentModal(false)} className="px-4 py-2 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">취소</button>
          </div>
        </div>
      </Modal>

      {/* Goal Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="목표 추가">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">팀</label>
            <select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm">
              {teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">목표 제목</label>
            <input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="전원 Week 3 완료" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">설명</label>
            <textarea className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm resize-none" rows={2} placeholder="목표 설명..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">목표치</label>
              <input type="number" className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="3" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">현재값</label>
              <input type="number" className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">단위</label>
              <input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="건" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">저장</button>
            <button onClick={() => setShowGoalModal(false)} className="px-4 py-2 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">취소</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
