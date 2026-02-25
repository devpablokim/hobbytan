'use client';

import { useState } from 'react';
import type { OnboardingData, ParticipationStatus } from '@/lib/super-wks/types';
import { JOB_ROLES } from '@/lib/super-wks/types';

interface OnboardingPageProps {
  defaultName: string;
  defaultEmail: string;
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingPage({ defaultName, defaultEmail, onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const [participationStatus, setParticipationStatus] = useState<ParticipationStatus | null>(null);
  const [nickname, setNickname] = useState(defaultName);
  const [realName, setRealName] = useState(defaultName);
  const [organization, setOrganization] = useState('');
  const [jobRole, setJobRole] = useState('');

  const handleSubmit = () => {
    if (!participationStatus || !nickname.trim() || !realName.trim() || !jobRole) return;
    onComplete({
      participationStatus,
      nickname: nickname.trim(),
      realName: realName.trim(),
      organization: organization.trim(),
      jobRole,
    });
  };

  const blocked = participationStatus === 'not_participating';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">🎓</span>
          </div>
          <h1 className="text-xl font-semibold text-white">AI 슈퍼워크샵 온보딩</h1>
          <p className="text-neutral-500 text-sm mt-1">{defaultEmail}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6 px-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`flex-1 h-1 transition-colors ${i <= step ? 'bg-emerald-500' : 'bg-[#262626]'}`} />
          ))}
        </div>

        <div className="border border-[#262626] bg-[#111111] p-6 md:p-8">
          {/* Step 0: Participation Status */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-medium text-white mb-2">워크샵 참여 상태</h2>
              <p className="text-sm text-neutral-500 mb-6">현재 AI 슈퍼워크샵 참여 상태를 선택해주세요.</p>
              <div className="space-y-3">
                {([
                  { value: 'participating', label: '🟢 현재 참여 중', desc: '진행 중인 기수에 참여하고 있습니다' },
                  { value: 'completed', label: '✅ 수료함', desc: '이전 기수를 수료했습니다' },
                  { value: 'not_participating', label: '⬜ 미참여', desc: '워크샵에 참여하지 않습니다' },
                ] as { value: ParticipationStatus; label: string; desc: string }[]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setParticipationStatus(opt.value)}
                    className={`w-full text-left p-4 border transition-all ${
                      participationStatus === opt.value
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-[#262626] hover:border-[#404040]'
                    }`}
                  >
                    <div className="text-sm font-medium text-white">{opt.label}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
              {blocked && (
                <div className="mt-4 p-4 border border-red-500/20 bg-red-500/5 text-sm text-red-400">
                  ⚠️ 미참여를 선택하시면 대시보드에 접근할 수 없습니다.
                </div>
              )}
              <button
                onClick={() => { if (participationStatus && !blocked) setStep(1); }}
                disabled={!participationStatus || blocked}
                className="w-full mt-6 py-3 bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-medium text-white mb-2">이름 설정</h2>
              <p className="text-sm text-neutral-500 mb-6">워크샵에서 사용할 닉네임과 실명을 입력해주세요.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">닉네임</label>
                  <input
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="워크샵에서 사용할 이름"
                    className="w-full border border-[#404040] bg-[#171717] text-white px-4 py-3 text-sm placeholder-neutral-600"
                  />
                  <p className="text-[10px] text-neutral-600 mt-1">기본값: Google 계정 이름</p>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">실명</label>
                  <input
                    value={realName}
                    onChange={e => setRealName(e.target.value)}
                    placeholder="실제 이름"
                    className="w-full border border-[#404040] bg-[#171717] text-white px-4 py-3 text-sm placeholder-neutral-600"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="px-6 py-3 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">이전</button>
                <button
                  onClick={() => { if (nickname.trim() && realName.trim()) setStep(2); }}
                  disabled={!nickname.trim() || !realName.trim()}
                  className="flex-1 py-3 bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Organization */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-medium text-white mb-2">소속</h2>
              <p className="text-sm text-neutral-500 mb-6">현재 소속을 입력해주세요. (회사, 학교, 팀 등)</p>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">소속</label>
                <input
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder="예: 하비탄AI, 서울대학교, 프리랜서"
                  className="w-full border border-[#404040] bg-[#171717] text-white px-4 py-3 text-sm placeholder-neutral-600"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">이전</button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Job Role */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-medium text-white mb-2">직무</h2>
              <p className="text-sm text-neutral-500 mb-6">현재 직무를 선택해주세요.</p>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">직무</label>
                <select
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  className="w-full border border-[#404040] bg-[#171717] text-white px-4 py-3 text-sm"
                >
                  <option value="">직무를 선택하세요</option>
                  {JOB_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              {jobRole && (
                <div className="mt-6 p-4 border border-[#262626] bg-[#0a0a0a]">
                  <div className="text-xs text-neutral-500 mb-2 uppercase">입력 정보 확인</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-neutral-500">참여 상태:</span> <span className="text-emerald-400">{participationStatus === 'participating' ? '참여 중' : '수료'}</span></div>
                    <div><span className="text-neutral-500">닉네임:</span> <span className="text-white">{nickname}</span></div>
                    <div><span className="text-neutral-500">실명:</span> <span className="text-white">{realName}</span></div>
                    <div><span className="text-neutral-500">소속:</span> <span className="text-white">{organization || '-'}</span></div>
                    <div><span className="text-neutral-500">직무:</span> <span className="text-white">{jobRole}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="px-6 py-3 border border-[#404040] text-neutral-400 text-sm hover:text-white transition-colors">이전</button>
                <button
                  onClick={handleSubmit}
                  disabled={!jobRole}
                  className="flex-1 py-3 bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✅ 완료 — 승인 요청
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
