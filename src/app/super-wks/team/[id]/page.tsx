'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/super-wks/useAuth';
import { AuthGuard } from '@/components/super-wks/AuthGuard';
import { Layout } from '@/components/super-wks/Layout';
import { TeamDetailPage } from '@/components/super-wks/TeamDetailPage';

export default function TeamRoute() {
  const params = useParams();
  const teamId = params.id as string;
  const { firebaseUser, appUser, role, logout } = useAuth();

  return (
    <AuthGuard>
      {firebaseUser && appUser && (
        <Layout user={firebaseUser} role={role} onLogout={logout}>
          <TeamDetailPage teamId={teamId} user={appUser} role={role} />
        </Layout>
      )}
    </AuthGuard>
  );
}
