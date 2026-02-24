'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Role, User } from '@/lib/super-wks/types';

const navItems = [
  { to: '/super-wks/dashboard', label: '📊 대시보드' },
  { to: '/super-wks/curriculum', label: '📚 커리큘럼' },
  { to: '/super-wks/submit', label: '📤 과제 제출' },
  { to: '/super-wks/community', label: '💬 커뮤니티' },
];

const adminNavItems = [
  { to: '/super-wks/admin', label: '⚙️ 관리자' },
];

const roleLabels: Record<Role, string> = {
  admin: '관리자',
  team_lead: '팀 리더',
  student: '수강생',
};

interface LayoutProps {
  user: User;
  role: Role;
  onSwitchRole: (role: Role) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function Layout({ user, role, onSwitchRole, onLogout, children }: LayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const allNav = role === 'admin' ? [...navItems, ...adminNavItems] : navItems;

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {allNav.map(item => (
        <Link
          key={item.to}
          href={item.to}
          onClick={onClick}
          className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
            pathname === item.to
              ? 'bg-indigo-700 text-white font-medium'
              : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-indigo-700">
          <h1 className="text-lg font-bold">🎓 AI 슈퍼워크샵</h1>
          <p className="text-indigo-300 text-sm mt-1">HOBBYTAN AI</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <div className="text-sm text-indigo-200">{user.displayName}</div>
          <div className="text-xs text-indigo-400 mt-0.5">{roleLabels[role]}</div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-indigo-900 text-white flex flex-col">
            <div className="p-6 border-b border-indigo-700 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">🎓 AI 슈퍼워크샵</h1>
                <p className="text-indigo-300 text-sm mt-1">HOBBYTAN AI</p>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-indigo-300 hover:text-white text-2xl">x</button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <NavLinks onClick={() => setMobileMenuOpen(false)} />
            </nav>
            <div className="p-4 border-t border-indigo-700">
              <div className="text-sm text-indigo-200">{user.displayName}</div>
              <div className="text-xs text-indigo-400 mt-0.5">{roleLabels[role]}</div>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="md:hidden font-bold text-indigo-900 text-sm">🎓 AI 슈퍼워크샵</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Role Switcher (dev only) */}
            {process.env.NODE_ENV === 'development' && (
              <select
                value={role}
                onChange={e => onSwitchRole(e.target.value as Role)}
                className="text-xs border rounded px-2 py-1 bg-yellow-50 text-yellow-700"
                title="개발 모드 전용"
              >
                <option value="admin">🔧 관리자</option>
                <option value="team_lead">🔧 팀 리더</option>
                <option value="student">🔧 수강생</option>
              </select>
            )}
            <span className="text-sm text-gray-600 hidden sm:inline">{user.displayName}</span>
            <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700">로그아웃</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
