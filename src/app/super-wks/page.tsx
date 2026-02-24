'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { DashboardPage } from '@/components/super-wks/DashboardPage';

export default function SuperWksPage() {
  const router = useRouter();
  const { isLoggedIn, currentUser, role, login, logout, switchRole } = useAuth();

  // Redirect to dashboard when logged in
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      router.push('/super-wks/dashboard');
    }
  }, [isLoggedIn, currentUser, router]);

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <Layout user={currentUser} role={role} onSwitchRole={switchRole} onLogout={logout}>
      <DashboardPage user={currentUser} role={role} />
    </Layout>
  );
}
