'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { CommunityPage } from '@/components/super-wks/CommunityPage';

export default function CommunityRoute() {
  const router = useRouter();
  const { isLoggedIn, currentUser, role, login, logout, switchRole } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/super-wks');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <Layout user={currentUser} role={role} onSwitchRole={switchRole} onLogout={logout}>
      <CommunityPage user={currentUser} />
    </Layout>
  );
}
