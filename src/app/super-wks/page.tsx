'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';
import { OnboardingPage } from '@/components/super-wks/OnboardingPage';
import type { OnboardingData } from '@/lib/super-wks/types';

export default function SuperWksHome() {
  const router = useRouter();
  const { isLoggedIn, firebaseUser, loading, login } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !firebaseUser) return;
    // Check localStorage for onboarding status (will be Firestore in production)
    const key = `swks_onboarded_${firebaseUser.uid}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setOnboarded(true);
      router.push('/super-wks/dashboard');
    } else {
      setOnboarded(false);
    }
  }, [isLoggedIn, firebaseUser, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-500">로딩 중...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={login} loading={loading} />;
  }

  // Logged in but not onboarded
  if (onboarded === false && firebaseUser) {
    return (
      <OnboardingPage
        defaultName={firebaseUser.displayName || ''}
        defaultEmail={firebaseUser.email || ''}
        onComplete={(data: OnboardingData) => {
          // Save onboarding data (localStorage now, Firestore in production)
          const key = `swks_onboarded_${firebaseUser.uid}`;
          localStorage.setItem(key, JSON.stringify({
            ...data,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            completedAt: new Date().toISOString(),
          }));
          // Save to pending approvals list
          const pendingKey = 'swks_pending_approvals';
          const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
          pending.push({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...data,
            requestedAt: new Date().toISOString(),
            status: 'pending',
          });
          localStorage.setItem(pendingKey, JSON.stringify(pending));
          setOnboarded(true);
          router.push('/super-wks/dashboard');
        }}
      />
    );
  }

  // Loading onboarding check
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-neutral-500">로딩 중...</div>
    </div>
  );
}
