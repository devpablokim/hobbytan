'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { AuthGuard } from '@/components/super-wks/AuthGuard';
import { Layout } from '@/components/super-wks/Layout';
import { SubmitPage } from '@/components/super-wks/SubmitPage';

export default function SubmitRoute() {
  const { firebaseUser, appUser, role, logout } = useAuth();

  return (
    <AuthGuard>
      {firebaseUser && appUser && (
        <Layout user={firebaseUser} role={role} onLogout={logout}>
          <SubmitPage user={appUser} role={role} />
        </Layout>
      )}
    </AuthGuard>
  );
}
