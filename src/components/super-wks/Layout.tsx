'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Role } from '@/lib/super-wks/types';

const navItems = [
  { to: '/super-wks/dashboard', label: '대시보드', icon: '📊' },
  { to: '/super-wks/curriculum', label: '커리큘럼', icon: '📚' },
  { to: '/super-wks/submit', label: '과제 제출', icon: '📤' },
  { to: '/super-wks/community', label: '커뮤니티', icon: '💬' },
];

const adminNavItems = [
  { to: '/super-wks/admin', label: '관리자', icon: '⚙️' },
];

const roleLabels: Record<Role, string> = {
  admin: '관리자',
  team_lead: '팀 리더',
  student: '수강생',
};

const roleColors: Record<Role, string> = {
  admin: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  team_lead: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  student: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20',
};

interface LayoutUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface LayoutProps {
  user: LayoutUser;
  role: Role;
  onLogout: () => void;
  children: React.ReactNode;
}

export function Layout({ user, role, onLogout, children }: LayoutProps) {
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
          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 border-l-2 ${
            pathname === item.to
              ? 'border-emerald-500 bg-emerald-500/10 text-white font-medium'
              : 'border-transparent text-neutral-400 hover:text-white hover:bg-[#1a1a1a] hover:border-neutral-600'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#262626] flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-[#262626]">
          <h1 className="text-lg font-semibold text-white">🎓 AI 슈퍼워크샵</h1>
          <p className="text-neutral-600 text-xs mt-1">HOBBYTAN AI</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-3 mb-3">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-medium">
                {(user.displayName || '?')[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{user.displayName}</div>
              <span className={`inline-block text-[10px] px-1.5 py-0.5 border ${roleColors[role]}`}>
                {roleLabels[role]}
              </span>
            </div>
          </div>
          {/* Role badge */}
          <button onClick={onLogout} className="w-full text-xs text-neutral-500 hover:text-red-400 transition-colors py-1">
            로그아웃
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#111111] border-r border-[#262626] flex flex-col">
            <div className="p-6 border-b border-[#262626] flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-white">🎓 AI 슈퍼워크샵</h1>
                <p className="text-neutral-600 text-xs mt-1">HOBBYTAN AI</p>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 hover:text-white text-xl">✕</button>
            </div>
            <nav className="flex-1 py-4 space-y-0.5">
              <NavLinks onClick={() => setMobileMenuOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#111111] border-b border-[#262626] px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-neutral-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="md:hidden font-semibold text-white text-sm">🎓 AI 슈퍼워크샵</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400 hidden sm:inline">{user.displayName}</span>
            <button onClick={onLogout} className="text-xs text-neutral-500 hover:text-red-400 transition-colors">로그아웃</button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
