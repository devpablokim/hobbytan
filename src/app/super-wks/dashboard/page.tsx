'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { AuthGuard } from '@/components/super-wks/AuthGuard';
import { Layout } from '@/components/super-wks/Layout';
import { DashboardPage } from '@/components/super-wks/DashboardPage';

export default function DashboardRoute() {
  const { firebaseUser, appUser, role, logout } = useAuth();

  return (
    <AuthGuard>
      {firebaseUser && appUser && (
        <Layout user={firebaseUser} role={role} onLogout={logout}>
          <DashboardPage user={appUser} role={role} />
        </Layout>
      )}
    </AuthGuard>
  );
}
