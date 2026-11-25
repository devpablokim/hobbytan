'use client';

interface LoginPageProps {
  onLogin: () => void;
  loading?: boolean;
}

export function LoginPage({ onLogin, loading }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 md:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/[0.03] blur-[200px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-emerald-400/[0.02] blur-[160px] rounded-full" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="relative w-full max-w-lg">
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mb-8" />

        {/* Card */}
        <div className="border border-[#1e1e1e] bg-[#111111]/80 backdrop-blur-sm px-8 py-12 md:px-14 md:py-16 text-center">

          {/* Brand Mark */}
          <div className="mb-10">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">🎓</span>
              </div>
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-emerald-500/40" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-emerald-500/40" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-emerald-500/40" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-emerald-500/40" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              AI 슈퍼워크샵
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-emerald-500/30" />
              <span className="text-emerald-400 text-xs font-medium uppercase tracking-[0.2em]">HOBBYTAN AI</span>
              <div className="h-px w-8 bg-emerald-500/30" />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto">
              5주 집중 파워워크샵으로<br />AI 실무 역량을 완성하세요
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#262626] to-transparent mb-10" />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: '📚', label: '체계적 커리큘럼' },
              { icon: '👥', label: '팀 기반 학습' },
              { icon: '🚀', label: '실무 프로젝트' },
            ].map(f => (
              <div key={f.label} className="text-center">
                <div className="text-xl mb-2">{f.icon}</div>
                <div className="text-[10px] text-neutral-500 leading-tight">{f.label}</div>
              </div>
            ))}
          </div>

          {/* Google Login Button */}
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-[#333333] bg-[#171717] px-6 py-4 text-white font-medium hover:bg-[#1c1c1c] hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm">{loading ? '로그인 중...' : 'Google 계정으로 시작하기'}</span>
          </button>

          {/* Footer note */}
          <p className="text-neutral-600 text-xs mt-8 leading-relaxed">
            하비탄 AI 워크샵 참가자 전용 대시보드입니다<br />
            <span className="text-neutral-700">승인된 계정만 접근할 수 있습니다</span>
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mt-8" />

        {/* Copyright */}
        <div className="text-center mt-6">
          <span className="text-[10px] text-neutral-700 tracking-wider">© 2026 HOBBYTAN AI. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
