"use client";

import { AlertTriangle, TrendingDown, DollarSign } from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks";

const urgencyStats = [
  {
    icon: TrendingDown,
    value: "₩2.4억",
    label: "AI 미도입 기업의 연간 기회비용",
    detail: "경쟁사 대비 생산성 격차로 인한 손실",
  },
  {
    icon: AlertTriangle,
    value: "18개월",
    label: "경쟁력 회복 불가 시점",
    detail: "Gartner: AI 격차가 되돌릴 수 없는 지점",
  },
  {
    icon: DollarSign,
    value: "3.2배",
    label: "AI 도입 기업의 성장률",
    detail: "비도입 기업 대비 매출 성장률 차이",
  },
];

export default function WhyNow() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="why-now"
      className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#0f0a0a] to-[#0a0a0a] relative overflow-hidden"
    >
      {/* Red Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[250px] sm:h-[300px] md:h-[400px] bg-red-500/5 blur-[150px] rounded-full" />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className={`inline-block px-3 py-1 mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-red-400 border border-red-500/30 bg-red-500/10 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            ⚠️ 긴급 경고
          </span>
          <h2
            className={`mb-6 ${
              isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            지금 도입하지 않으면
            <br />
            <span className="text-red-400">18개월 후 따라잡을 수 없습니다</span>
          </h2>
          <p
            className={`text-lg text-neutral-400 max-w-xl mx-auto ${
              isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            경쟁사는 이미 AI로 비용을 절감하고,
            당신의 고객을 빼앗아가고 있습니다.
          </p>
        </div>

        {/* Urgency Stats - Horizontal Layout */}
        <div
          className={`grid md:grid-cols-3 gap-6 mb-16 ${
            isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          {urgencyStats.map((stat, index) => (
            <div
              key={index}
              className="relative p-5 sm:p-6 md:p-8 border border-red-500/20 bg-red-500/5 group hover:border-red-500/40 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center border border-red-500/30 bg-red-500/10">
                  <stat.icon className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-semibold text-white">
                  {stat.value}
                </div>
              </div>
              <div className="text-sm font-medium text-white mb-2">
                {stat.label}
              </div>
              <div className="text-xs text-neutral-500">{stat.detail}</div>
            </div>
          ))}
        </div>

        {/* Timeline Warning */}
        <div
          className={`max-w-4xl mx-auto ${
            isVisible ? "animate-fade-in-up delay-400" : "opacity-0"
          }`}
        >
          <div className="relative p-5 sm:p-6 md:p-8 border border-neutral-800 bg-neutral-900/50">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              {/* Timeline Visual */}
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-500 mb-4">
                  AI 도입 타이밍별 경쟁력 변화
                </div>
                <div className="relative">
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full" />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-neutral-600">
                    <span className="text-emerald-400">지금 도입</span>
                    <span className="text-yellow-400">6개월 후</span>
                    <span className="text-red-400">18개월 후</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center md:text-right">
                <div className="text-lg font-medium text-white mb-2">
                  아직 늦지 않았습니다
                </div>
                <div className="text-sm text-neutral-500 mb-4">
                  지금 시작하면 6개월 안에 경쟁 우위 확보
                </div>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                >
                  긴급 상담 신청
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
