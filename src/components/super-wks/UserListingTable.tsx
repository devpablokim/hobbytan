'use client';

import { useState, useMemo } from 'react';
import type { FirestoreUser } from '@/lib/super-wks/firestoreService';
import type { Team, UserStatus, Role } from '@/lib/super-wks/types';

type SortField = 'nickname' | 'email' | 'jobRole' | 'organization' | 'status' | 'role' | 'onboardedAt';
type SortDir = 'asc' | 'desc';

interface Props {
  users: FirestoreUser[];
  teams: Team[];
  onEdit?: (uid: string) => void;
  onDelete?: (uid: string) => void;
}

export function UserListingTable({ users, teams, onEdit, onDelete }: Props) {
  // ─── Filters ───
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [filterRole, setFilterRole] = useState<Role | 'all'>('all');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterJobRole, setFilterJobRole] = useState<string>('all');

  // ─── Sort ───
  const [sortField, setSortField] = useState<SortField>('onboardedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  // ─── Derived data ───
  const jobRoles = useMemo(() => {
    const roles = new Set(users.map(u => u.jobRole).filter(Boolean));
    return Array.from(roles).sort();
  }, [users]);

  const nonAdminUsers = useMemo(() => users.filter(u => u.role !== 'admin'), [users]);

  const filtered = useMemo(() => {
    let result = nonAdminUsers;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        (u.nickname || '').toLowerCase().includes(q) ||
        (u.realName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.organization || '').toLowerCase().includes(q)
      );
    }

    // Filters
    if (filterStatus !== 'all') result = result.filter(u => u.status === filterStatus);
    if (filterRole !== 'all') result = result.filter(u => u.role === filterRole);
    if (filterTeam !== 'all') {
      if (filterTeam === 'none') {
        result = result.filter(u => !u.teamId);
      } else {
        result = result.filter(u => u.teamId === filterTeam);
      }
    }
    if (filterJobRole !== 'all') result = result.filter(u => u.jobRole === filterJobRole);

    // Sort
    result = [...result].sort((a, b) => {
      let va: string | number = '';
      let vb: string | number = '';

      switch (sortField) {
        case 'nickname': va = (a.nickname || a.displayName || '').toLowerCase(); vb = (b.nickname || b.displayName || '').toLowerCase(); break;
        case 'email': va = a.email.toLowerCase(); vb = b.email.toLowerCase(); break;
        case 'jobRole': va = (a.jobRole || '').toLowerCase(); vb = (b.jobRole || '').toLowerCase(); break;
        case 'organization': va = (a.organization || '').toLowerCase(); vb = (b.organization || '').toLowerCase(); break;
        case 'status': va = a.status; vb = b.status; break;
        case 'role': va = a.role; vb = b.role; break;
        case 'onboardedAt': va = a.onboardedAt || ''; vb = b.onboardedAt || ''; break;
      }

      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [nonAdminUsers, searchQuery, filterStatus, filterRole, filterTeam, filterJobRole, sortField, sortDir]);

  // ─── Stats ───
  const stats = useMemo(() => ({
    total: nonAdminUsers.length,
    active: nonAdminUsers.filter(u => u.status === 'active').length,
    pending: nonAdminUsers.filter(u => u.status === 'pending').length,
    suspended: nonAdminUsers.filter(u => u.status === 'suspended').length,
    noTeam: nonAdminUsers.filter(u => !u.teamId).length,
  }), [nonAdminUsers]);

  const hasActiveFilters = searchQuery || filterStatus !== 'all' || filterRole !== 'all' || filterTeam !== 'all' || filterJobRole !== 'all';

  return (
    <div className="bg-[#111111] border border-[#262626]">
      {/* Header + Stats */}
      <div className="p-5 border-b border-[#262626]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-white">수강생 관리 ({stats.total}명)</h2>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">활성 {stats.active}</span>
            <span className="px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400">대기 {stats.pending}</span>
            <span className="px-2 py-0.5 border border-red-500/20 bg-red-500/10 text-red-400">제한 {stats.suspended}</span>
            <span className="px-2 py-0.5 border border-neutral-500/20 bg-neutral-500/10 text-neutral-400">미배치 {stats.noTeam}</span>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 이름, 이메일, 소속 검색..."
            className="flex-1 border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm placeholder-neutral-600"
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as UserStatus | 'all')} className="text-xs border border-[#404040] bg-[#171717] text-neutral-400 px-3 py-2">
            <option value="all">상태: 전체</option>
            <option value="active">✅ 활성</option>
            <option value="pending">⏳ 대기</option>
            <option value="suspended">🚫 제한</option>
          </select>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value as Role | 'all')} className="text-xs border border-[#404040] bg-[#171717] text-neutral-400 px-3 py-2">
            <option value="all">역할: 전체</option>
            <option value="student">수강생</option>
            <option value="team_lead">팀 리더</option>
          </select>
          <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} className="text-xs border border-[#404040] bg-[#171717] text-neutral-400 px-3 py-2">
            <option value="all">팀: 전체</option>
            <option value="none">미배치</option>
            {teams.map(t => <option key={t.teamId} value={t.teamId}>{t.name}</option>)}
          </select>
          <select value={filterJobRole} onChange={e => setFilterJobRole(e.target.value)} className="text-xs border border-[#404040] bg-[#171717] text-neutral-400 px-3 py-2">
            <option value="all">직무: 전체</option>
            {jobRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-neutral-500">{filtered.length}건 표시</span>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterRole('all'); setFilterTeam('all'); setFilterJobRole('all'); }} className="text-xs text-emerald-400 hover:text-emerald-300">필터 초기화</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th onClick={() => toggleSort('nickname')} className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase cursor-pointer hover:text-white select-none">이름{sortIndicator('nickname')}</th>
              <th onClick={() => toggleSort('email')} className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase cursor-pointer hover:text-white select-none">이메일{sortIndicator('email')}</th>
              <th onClick={() => toggleSort('organization')} className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase cursor-pointer hover:text-white select-none">소속{sortIndicator('organization')}</th>
              <th onClick={() => toggleSort('jobRole')} className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase cursor-pointer hover:text-white select-none">직무{sortIndicator('jobRole')}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">팀</th>
              <th onClick={() => toggleSort('status')} className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase cursor-pointer hover:text-white select-none">상태{sortIndicator('status')}</th>
              <th onClick={() => toggleSort('role')} className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase cursor-pointer hover:text-white select-none">역할{sortIndicator('role')}</th>
              <th onClick={() => toggleSort('onboardedAt')} className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase cursor-pointer hover:text-white select-none">가입일{sortIndicator('onboardedAt')}</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-neutral-500 text-sm">{hasActiveFilters ? '조건에 맞는 수강생이 없습니다.' : '등록된 수강생이 없습니다.'}</td></tr>
            ) : (
              filtered.map(u => {
                const team = teams.find(t => t.teamId === u.teamId);
                return (
                  <tr key={u.uid} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]">
                    <td className="px-5 py-3">
                      <div className="text-sm text-white">{u.nickname || u.displayName}</div>
                      {u.realName && u.realName !== u.nickname && <div className="text-[10px] text-neutral-600">{u.realName}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400">{u.organization || '-'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-400">{u.jobRole || '-'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400">{team?.name || <span className="text-neutral-600">미배치</span>}</td>
                    <td className="text-center px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 border ${u.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : u.status === 'pending' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                        {u.status === 'active' ? '활성' : u.status === 'pending' ? '대기' : '제한'}
                      </span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 border ${u.role === 'team_lead' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20'}`}>
                        {u.role === 'team_lead' ? '팀 리더' : '수강생'}
                      </span>
                    </td>
                    <td className="text-center px-4 py-3 text-xs text-neutral-600">
                      {u.onboardedAt ? new Date(u.onboardedAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="text-center px-4 py-3">
                      {onEdit && <button onClick={() => onEdit(u.uid)} className="text-xs text-emerald-400 hover:text-emerald-300 mr-2">수정</button>}
                      {onDelete && <button onClick={() => onDelete(u.uid)} className="text-xs text-red-400 hover:text-red-300">삭제</button>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
