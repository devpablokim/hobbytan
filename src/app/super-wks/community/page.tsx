'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { AuthGuard } from '@/components/super-wks/AuthGuard';
import { Layout } from '@/components/super-wks/Layout';
import { CommunityPage } from '@/components/super-wks/CommunityPage';

export default function CommunityRoute() {
  const { firebaseUser, appUser, role, logout } = useAuth();

  return (
    <AuthGuard>
      {firebaseUser && appUser && (
        <Layout user={firebaseUser} role={role} onLogout={logout}>
          <CommunityPage user={appUser} role={role} />
        </Layout>
      )}
    </AuthGuard>
  );
}
