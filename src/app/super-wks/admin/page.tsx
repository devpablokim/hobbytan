'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { AdminPage } from '@/components/super-wks/AdminPage';

export default function AdminRoute() {
  const router = useRouter();
  const { isLoggedIn, currentUser, role, login, logout, switchRole } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/super-wks');
    }
    // Redirect non-admin users
    if (isLoggedIn && role !== 'admin') {
      router.push('/super-wks/dashboard');
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={login} />;
  }

  if (role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <Layout user={currentUser} role={role} onSwitchRole={switchRole} onLogout={logout}>
      <AdminPage />
    </Layout>
  );
}
