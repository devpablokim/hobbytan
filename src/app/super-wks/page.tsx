'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/super-wks/useAuth';
import { LoginPage } from '@/components/super-wks/LoginPage';

export default function SuperWksHome() {
  const router = useRouter();
  const { isLoggedIn, loading, login } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/super-wks/dashboard');
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-500">로딩 중...</div>
      </div>
    );
  }

  return <LoginPage onLogin={login} loading={loading} />;
}
