'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from './LoginPage';

/**
 * AuthGuard: wraps pages that require active user status.
 * - logged_out → LoginPage
 * - needs_onboarding / pending_approval / suspended → redirect to /super-wks
 * - active → render children
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, userState, loading, login } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn && userState !== 'active') {
      router.replace('/super-wks');
    }
  }, [loading, isLoggedIn, userState, router]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-neutral-500">로딩 중...</div></div>;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  if (userState !== 'active') {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-neutral-500">리다이렉트 중...</div></div>;
  }

  return <>{children}</>;
}
