'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { CommunityPage } from '@/components/super-wks/CommunityPage';

export default function CommunityRoute() {
  const { isLoggedIn, firebaseUser, appUser, role, loading, login, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-neutral-500">로딩 중...</div></div>;
  }

  if (!isLoggedIn || !firebaseUser || !appUser) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <Layout user={firebaseUser} role={role} onLogout={logout}>
      <CommunityPage user={appUser} role={role} />
    </Layout>
  );
}
