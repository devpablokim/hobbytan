'use client';

import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { Layout } from '@/components/super-wks/Layout';
import { AdminPage } from '@/components/super-wks/AdminPage';
import { OnboardingPage } from '@/components/super-wks/OnboardingPage';
import { createUserFromOnboarding } from '@/lib/super-wks/firestoreService';

export default function AdminRoute() {
  const { isLoggedIn, userState, firebaseUser, role, loading, login, logout, refreshUser } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-neutral-500">로딩 중...</div></div>;
  }

  if (!isLoggedIn || !firebaseUser) {
    return <LoginPage onLogin={login} />;
  }

  if (userState === 'needs_onboarding') {
    return (
      <OnboardingPage
        defaultName={firebaseUser.displayName || ''}
        defaultEmail={firebaseUser.email || ''}
        onComplete={async (data) => {
          await createUserFromOnboarding(firebaseUser.uid, firebaseUser.email || '', firebaseUser.displayName || '', firebaseUser.photoURL, data);
          await refreshUser();
        }}
      />
    );
  }

  if (userState === 'pending_approval') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center p-8 border border-amber-500/20 bg-amber-500/5 max-w-md">
          <div className="text-3xl mb-3">⏳</div>
          <h2 className="text-lg font-semibold text-white mb-2">승인 대기 중</h2>
          <p className="text-sm text-neutral-400">관리자의 승인을 기다리고 있습니다.</p>
          <button onClick={logout} className="mt-4 text-xs text-neutral-500 hover:text-white transition-colors">로그아웃</button>
        </div>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <Layout user={firebaseUser} role={role} onLogout={logout}>
        <div className="text-center py-12">
          <p className="text-neutral-400">관리자만 접근 가능합니다.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={firebaseUser} role={role} onLogout={logout}>
      <AdminPage />
    </Layout>
  );
}
