'use client';

import { useState } from 'react';
import { teams, users, cohort } from '@/lib/super-wks/mockData';
import { Modal } from './Modal';

export function AdminPage() {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">관리자 패널</h1>

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
    </div>
  );
}
