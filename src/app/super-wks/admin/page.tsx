'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { AuthGuard } from '@/components/super-wks/AuthGuard';
import { Layout } from '@/components/super-wks/Layout';
import { AdminPage } from '@/components/super-wks/AdminPage';

export default function AdminRoute() {
  const { firebaseUser, role, logout } = useAuth();

  return (
    <AuthGuard>
      {firebaseUser && (
        role === 'admin' ? (
          <Layout user={firebaseUser} role={role} onLogout={logout}>
            <AdminPage />
          </Layout>
        ) : (
          <Layout user={firebaseUser} role={role} onLogout={logout}>
            <div className="text-center py-12">
              <p className="text-neutral-400">관리자만 접근 가능합니다.</p>
            </div>
          </Layout>
        )
      )}
    </AuthGuard>
  );
}
