'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { AuthGuard } from '@/components/super-wks/AuthGuard';
import { Layout } from '@/components/super-wks/Layout';
import { CurriculumPage } from '@/components/super-wks/CurriculumPage';

export default function CurriculumRoute() {
  const { firebaseUser, appUser, role, logout } = useAuth();

  return (
    <AuthGuard>
      {firebaseUser && appUser && (
        <Layout user={firebaseUser} role={role} onLogout={logout}>
          <CurriculumPage user={appUser} role={role} />
        </Layout>
      )}
    </AuthGuard>
  );
}
