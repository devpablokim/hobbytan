'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { CurriculumPage } from '@/components/super-wks/CurriculumPage';

export default function CurriculumRoute() {
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
      <CurriculumPage user={currentUser} role={role} />
    </Layout>
  );
}
