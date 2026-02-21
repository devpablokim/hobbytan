"use client";

import { XCircle, Check, ArrowRight } from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks";

const failures = [
  {
    title: "유튜브/인강으로 독학",
    cost: "₩0",
    result: "3개월 후 포기",
    waste: "90시간 낭비",
    reason: "실무 적용법 부재, 질문 불가",
  },
  {
    title: "외부 AI 컨설팅 업체",
    cost: "₩3,000만+",
    result: "보고서만 남음",
    waste: "₩3,000만 매몰비용",
    reason: "실행력 없는 전략, 내재화 실패",
  },
  {
    title: "일회성 기업 강연",
    cost: "₩500만",
    result: "1주 후 잊혀짐",
    waste: "₩500만 + 전 직원 시간",
    reason: "Follow-up 없음, 행동 변화 0",
  },
];

const solution = {
  title: "하비탄 AI 파워워크샵",
  cost: "₩800만",
  result: "5주 후 AI 슈퍼유저 5명",
  gain: "연 ₩9,600만 가치 창출",
  features: [
    "실무 프로젝트 기반 학습",
    "주 2회 피드백 세션",
    "습득할 때까지 추적",
    "수료 후 90일 팔로업 지원",
  ],
};

export default function Problem() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="program"
      className="section-padding bg-[#050505] relative overflow-hidden"
    >
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className={`section-label ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            왜 다른 방법은 실패하는가
          </span>
          <h2
            className={`mb-6 ${
              isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            이미 시도해본 방법들,
            <br />
            <span className="text-neutral-500">얼마나 낭비했습니까?</span>
          </h2>
        </div>

        {/* Failure Cards */}
        <div
          className={`grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-12 ${
            isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
          }`}
        >
          {failures.map((item, index) => (
            <div
              key={index}
              className="relative p-4 sm:p-6 border border-neutral-800 bg-neutral-900/30 group"
            >
              {/* Red X Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>

              <div className="text-lg font-medium text-white mb-4">
                {item.title}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">비용</span>
                  <span className="text-white">{item.cost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">결과</span>
                  <span className="text-red-400">{item.result}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">낭비</span>
                  <span className="text-red-400 font-medium">{item.waste}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-500">{item.reason}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow Divider */}
        <div
          className={`flex justify-center my-8 ${
            isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="w-6 h-6 text-neutral-600 rotate-90" />
            <span className="text-xs text-neutral-600 uppercase tracking-wider">
              대안
            </span>
          </div>
        </div>

        {/* Solution Card */}
        <div
          className={`max-w-2xl mx-auto ${
            isVisible ? "animate-fade-in-up delay-400" : "opacity-0"
          }`}
        >
          <div className="relative p-5 sm:p-6 md:p-8 border-2 border-emerald-500/30 bg-emerald-500/5">
            {/* Green Check Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-medium uppercase tracking-wider">
              검증된 솔루션
            </div>

            <div className="text-center mb-6">
              <div className="text-2xl font-semibold text-white mb-2">
                {solution.title}
              </div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-neutral-400">투자</span>
                <span className="text-xl font-semibold text-white">
                  {solution.cost}
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-600" />
                <span className="text-neutral-400">수익</span>
                <span className="text-xl font-semibold text-emerald-400">
                  {solution.gain}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {solution.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-neutral-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-emerald-500/20 text-center">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-200"
              >
                파워워크샵 자세히 보기
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
