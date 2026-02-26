'use client';

import { useState, useEffect } from 'react';
import { teams, users, cohort, pendingUsers, goals, submissions, posts, curriculum } from '@/lib/super-wks/mockData';
import type { User, Curriculum } from '@/lib/super-wks/types';
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
    return { userId: u.userId, displayName: u.displayName, teamId: u.teamId, submissionCount: userSubmissions.length, postCount: userPosts.length, totalScore };
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
            <div className="absolute inset-y-0 left-0 bg-emerald-500/60 transition-all" style={{ width: `${(d.totalScore / maxScore) * 100}%` }} />
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

// ─── Onboarding Approval Queue (Firestore) ───
import { getPendingUsers, approveUser, rejectUser, type FirestoreUser } from '@/lib/super-wks/firestoreService';
import { useAuth } from '@/lib/super-wks/useAuth';

function OnboardingApprovalQueue() {
  const [requests, setRequests] = useState<FirestoreUser[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const { firebaseUser } = useAuth();

  useEffect(() => {
    getPendingUsers().then(setRequests).catch(console.error);
  }, []);

  const handleApprove = async (uid: string) => {
    if (!firebaseUser) return;
    setProcessing(uid);
    try {
      // 승인 시 기본 팀 미배치 (관리자가 나중에 팀 배정)
      await approveUser(uid, firebaseUser.uid, '');
      setRequests(prev => prev.filter(r => r.uid !== uid));
    } catch (err) {
      console.error('Approve failed:', err);
    }
    setProcessing(null);
  };

  const handleReject = async (uid: string) => {
    setProcessing(uid);
    try {
      await rejectUser(uid);
      setRequests(prev => prev.filter(r => r.uid !== uid));
    } catch (err) {
      console.error('Reject failed:', err);
    }
    setProcessing(null);
  };

  if (requests.length === 0) return null;

  return (
    <div className="bg-amber-500/5 border border-amber-500/20 p-5 mb-6">
      <h2 className="font-semibold text-amber-400 mb-4">🔔 온보딩 승인 요청 ({requests.length}건)</h2>
      <div className="space-y-3">
        {requests.map(r => (
          <div key={r.uid} className="bg-[#111111] border border-[#262626] p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">{r.nickname}</span>
                  <span className="text-xs text-neutral-500">({r.realName})</span>
                  <span className={`text-[10px] px-2 py-0.5 border ${r.participationStatus === 'participating' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>
                    {r.participationStatus === 'participating' ? '참여 중' : '수료'}
                  </span>
                </div>
                <div className="text-xs text-neutral-500">
                  {r.email} · {r.organization || '소속 없음'} · {r.jobRole}
                </div>
                <div className="text-[10px] text-neutral-600">
                  {r.onboardedAt ? new Date(r.onboardedAt).toLocaleString('ko-KR') : '-'}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleApprove(r.uid)} disabled={processing === r.uid} className="px-4 py-2 bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition-colors disabled:opacity-50">✅ 승인</button>
                <button onClick={() => handleReject(r.uid)} disabled={processing === r.uid} className="px-4 py-2 bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 border border-red-500/20 transition-colors disabled:opacity-50">❌ 거절</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Curriculum Editor (Team-specific) ───
function CurriculumEditor() {
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredCurriculum = curriculum;

  const startEdit = (week: Curriculum) => {
    setEditingWeek(week.weekNumber);
    setEditTitle(week.title);
    setEditDesc(week.description);
    setShowModal(true);
  };

  return (
    <div className="bg-[#111111] border border-[#262626] p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold text-white">📚 커리큘럼 관리</h2>
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">팀별 필터:</label>
          <select
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            className="text-xs border border-[#404040] bg-[#171717] text-neutral-400 px-3 py-1.5"
          >
            <option value="all">전체 (공통)</option>
            {teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {selectedTeam !== 'all' && (
        <div className="mb-3 px-3 py-2 border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400">
          💡 {teams.find(t => t.teamId === selectedTeam)?.name} 전용 커리큘럼을 설정합니다. 팀별로 다른 과제/일정을 지정할 수 있습니다.
        </div>
      )}

      <div className="space-y-2">
        {filteredCurriculum.map(week => (
          <div key={week.weekNumber} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Week {week.weekNumber}</span>
                <span className="text-sm font-medium text-white truncate">{week.title}</span>
              </div>
              <p className="text-xs text-neutral-500 truncate">{week.description}</p>
              <div className="text-[10px] text-neutral-600 mt-1">
                과제 {week.assignments.length}건 · 자료 {week.materials.length}건
              </div>
            </div>
            <button onClick={() => startEdit(week)} className="px-3 py-1.5 text-xs text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors shrink-0">
              ✏️ 수정
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Week ${editingWeek} 커리큘럼 수정`}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">제목</label>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">설명</label>
            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm resize-none" />
          </div>
          {selectedTeam !== 'all' && (
            <div className="p-3 border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400">
              이 변경은 <strong>{teams.find(t => t.teamId === selectedTeam)?.name}</strong>에만 적용됩니다.
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">저장</button>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">취소</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Progress % Control (Admin only) ───
function ProgressController() {
  const weekKeys = ['week0','week1','week2','week3','week4','week5'] as const;
  const [progValues, setProgValues] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    teams.forEach(t => {
      init[t.teamId] = {};
      weekKeys.forEach(w => { init[t.teamId][w] = t.progress[w]; });
    });
    return init;
  });

  const handleChange = (teamId: string, week: string, value: number) => {
    setProgValues(prev => ({ ...prev, [teamId]: { ...prev[teamId], [week]: Math.min(100, Math.max(0, value)) } }));
  };

  return (
    <div className="bg-[#111111] border border-[#262626] p-5 mb-6">
      <h2 className="font-semibold text-white mb-4">📊 진척도 관리 (% 직접 조정)</h2>
      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.teamId} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
            <div className="text-sm font-medium text-white mb-3">{team.name}</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {weekKeys.map((w, i) => (
                <div key={w}>
                  <label className="block text-[10px] text-neutral-500 mb-1">Week {i}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progValues[team.teamId]?.[w] || 0}
                      onChange={e => handleChange(team.teamId, w, Number(e.target.value))}
                      className="flex-1 h-1 accent-emerald-500 bg-[#262626]"
                    />
                    <span className="text-xs text-emerald-400 w-10 text-right">{progValues[team.teamId]?.[w] || 0}%</span>
                  </div>
                  <ProgressBar value={progValues[team.teamId]?.[w] || 0} size="sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">💾 변경사항 저장</button>
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
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'progress'>('overview');

  const participation = calculateParticipation(users);

  const handleApprove = (userId: string) => setPending(prev => prev.filter(u => u.userId !== userId));
  const handleReject = (userId: string) => setPending(prev => prev.filter(u => u.userId !== userId));

  const tabs = [
    { key: 'overview' as const, label: '개요' },
    { key: 'curriculum' as const, label: '커리큘럼' },
    { key: 'progress' as const, label: '진척도' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">관리자 패널</h1>
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm transition-colors ${activeTab === tab.key ? 'bg-emerald-500 text-white' : 'border border-[#404040] text-neutral-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Onboarding Approval Queue (always visible) */}
      <OnboardingApprovalQueue />

      {/* Mock Pending Users */}
      {pending.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 p-5 mb-6">
          <h2 className="font-semibold text-amber-400 mb-4">⏳ 기존 승인 대기 ({pending.length}명)</h2>
          <div className="space-y-3">
            {pending.map(u => (
              <div key={u.userId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#111111] border border-[#262626] px-4 py-3">
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

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <>
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

          {/* Team Goals */}
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
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Participation Chart */}
          <div className="bg-[#111111] border border-[#262626] p-5 mb-6">
            <h2 className="font-semibold text-white mb-4">📊 참여도 / 기여도</h2>
            <ParticipationChart data={participation} />
          </div>

          {/* Teams Table */}
          <div className="bg-[#111111] border border-[#262626] mb-6">
            <div className="flex items-center justify-between p-5 border-b border-[#262626]">
              <h2 className="font-semibold text-white">팀 관리 ({teams.length}팀)</h2>
              <button onClick={() => { setEditingTeam(null); setShowTeamModal(true); }} className="px-3 py-1.5 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">+ 팀 추가</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-[#262626]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase">팀명</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">팀 리더</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">인원</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">현재 주차</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">작업</th>
                </tr></thead>
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

          {/* Students Table */}
          <div className="bg-[#111111] border border-[#262626]">
            <div className="flex items-center justify-between p-5 border-b border-[#262626]">
              <h2 className="font-semibold text-white">수강생 관리 ({users.filter(u => u.role !== 'admin').length}명)</h2>
              <button onClick={() => { setEditingStudent(null); setShowStudentModal(true); }} className="px-3 py-1.5 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">+ 수강생 추가</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-[#262626]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase">이름</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">이메일</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">팀</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">상태</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">역할</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">작업</th>
                </tr></thead>
                <tbody>
                  {users.filter(u => u.role !== 'admin').map(u => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab: Curriculum */}
      {activeTab === 'curriculum' && <CurriculumEditor />}

      {/* Tab: Progress */}
      {activeTab === 'progress' && <ProgressController />}

      {/* Modals */}
      <Modal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} title={editingTeam ? '팀 수정' : '팀 추가'}>
        <div className="space-y-4">
          <div><label className="block text-xs text-neutral-500 mb-1.5">팀명</label><input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="Team Delta" /></div>
          <div><label className="block text-xs text-neutral-500 mb-1.5">팀 리더</label>
            <select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm"><option value="">선택</option>{users.filter(u => u.role !== 'admin').map(u => (<option key={u.userId} value={u.userId}>{u.displayName}</option>))}</select>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">저장</button>
            <button onClick={() => setShowTeamModal(false)} className="px-4 py-2 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">취소</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showStudentModal} onClose={() => setShowStudentModal(false)} title={editingStudent ? '수강생 수정' : '수강생 추가'}>
        <div className="space-y-4">
          <div><label className="block text-xs text-neutral-500 mb-1.5">이름</label><input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="홍길동" /></div>
          <div><label className="block text-xs text-neutral-500 mb-1.5">이메일</label><input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="email@example.com" type="email" /></div>
          <div><label className="block text-xs text-neutral-500 mb-1.5">팀 배치</label>
            <select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm"><option value="">미배치</option>{teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}</select>
          </div>
          <div><label className="block text-xs text-neutral-500 mb-1.5">역할</label>
            <select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm"><option value="student">수강생</option><option value="team_lead">팀 리더</option></select>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">저장</button>
            <button onClick={() => setShowStudentModal(false)} className="px-4 py-2 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">취소</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="목표 추가">
        <div className="space-y-4">
          <div><label className="block text-xs text-neutral-500 mb-1.5">팀</label><select className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm">{teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}</select></div>
          <div><label className="block text-xs text-neutral-500 mb-1.5">목표 제목</label><input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="전원 Week 3 완료" /></div>
          <div><label className="block text-xs text-neutral-500 mb-1.5">설명</label><textarea className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm resize-none" rows={2} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs text-neutral-500 mb-1.5">목표치</label><input type="number" className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-neutral-500 mb-1.5">현재값</label><input type="number" className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-neutral-500 mb-1.5">단위</label><input className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm" placeholder="건" /></div>
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
