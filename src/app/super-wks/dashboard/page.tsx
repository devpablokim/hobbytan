'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { DashboardPage } from '@/components/super-wks/DashboardPage';

export default function DashboardRoute() {
  const { isLoggedIn, currentUser, role, loading, login, logout, switchRole } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-neutral-500">로딩 중...</div></div>;
  }

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <Layout user={currentUser} role={role} onSwitchRole={switchRole} onLogout={logout}>
      <DashboardPage user={currentUser} role={role} />
    </Layout>
  );
}
