'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { OnboardingPage } from '@/components/super-wks/OnboardingPage';
import { createUserFromOnboarding } from '@/lib/super-wks/firestoreService';

export default function SuperWksHome() {
  const router = useRouter();
  const { isLoggedIn, userState, firebaseUser, loading, login, logout, refreshUser } = useAuth();

  useEffect(() => {
    if (userState === 'active') {
      router.replace('/super-wks/dashboard');
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
          // Send admin notification email (fire-and-forget)
          fetch('/api/workshop/onboarding-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.realName || data.nickname,
              email: firebaseUser.email,
              organization: data.organization,
              jobRole: data.jobRole,
              participationStatus: data.participationStatus,
            }),
          }).catch(() => {}); // Don't block on email failure
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
          <p className="text-sm text-neutral-400 mb-1">관리자의 승인을 기다리고 있습니다.</p>
          <p className="text-xs text-neutral-600 mb-4">{firebaseUser?.email}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => refreshUser()} className="text-xs text-emerald-400 border border-emerald-500/20 px-3 py-1.5 hover:bg-emerald-500/10 transition-colors">🔄 상태 확인</button>
            <button onClick={logout} className="text-xs text-neutral-500 border border-[#404040] px-3 py-1.5 hover:text-white transition-colors">로그아웃</button>
          </div>
        </div>
      </div>
    );
  }

  if (userState === 'suspended') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center p-8 border border-red-500/20 bg-red-500/5 max-w-md">
          <div className="text-3xl mb-3">🚫</div>
          <h2 className="text-lg font-semibold text-white mb-2">접근이 제한되었습니다</h2>
          <p className="text-sm text-neutral-400 mb-4">관리자에 의해 접근이 제한되었습니다. 문의사항은 운영진에게 연락해주세요.</p>
          <button onClick={logout} className="text-xs text-neutral-500 border border-[#404040] px-3 py-1.5 hover:text-white transition-colors">로그아웃</button>
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
