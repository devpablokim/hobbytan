'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { AdminPage } from '@/components/super-wks/AdminPage';

export default function AdminRoute() {
  const { isLoggedIn, currentUser, role, loading, login, logout, switchRole } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-neutral-500">로딩 중...</div></div>;
  }

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={login} />;
  }

  if (role !== 'admin') {
    return (
      <Layout user={currentUser} role={role} onSwitchRole={switchRole} onLogout={logout}>
        <div className="text-center py-12">
          <p className="text-neutral-400">관리자만 접근 가능합니다.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={currentUser} role={role} onSwitchRole={switchRole} onLogout={logout}>
      <AdminPage />
    </Layout>
  );
}
