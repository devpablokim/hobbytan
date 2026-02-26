'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { OnboardingPage } from '@/components/super-wks/OnboardingPage';
import { createUserFromOnboarding } from '@/lib/super-wks/firestoreService';

export default function SuperWksHome() {
  const router = useRouter();
  const { isLoggedIn, userState, firebaseUser, loading, login, refreshUser } = useAuth();

  useEffect(() => {
    if (userState === 'active') {
      router.push('/super-wks/dashboard');
    }
  }, [userState, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-500">로딩 중...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  if (userState === 'needs_onboarding' && firebaseUser) {
    return (
      <OnboardingPage
        defaultName={firebaseUser.displayName || ''}
        defaultEmail={firebaseUser.email || ''}
        onComplete={async (data) => {
          await createUserFromOnboarding(
            firebaseUser.uid,
            firebaseUser.email || '',
            firebaseUser.displayName || '',
            firebaseUser.photoURL,
            data
          );
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-neutral-500">로딩 중...</div>
    </div>
  );
}
