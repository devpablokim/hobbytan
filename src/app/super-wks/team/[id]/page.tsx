'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { TeamDetailPage } from '@/components/super-wks/TeamDetailPage';

export default function TeamRoute() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;
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
      <TeamDetailPage teamId={teamId} />
    </Layout>
  );
}
