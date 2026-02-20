"use client";

import { Check, ArrowRight, Shield, Clock, Users, Zap } from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks";

const valueProps = [
  {
    icon: Clock,
    title: "5주 집중 프로그램",
    description: "주 2회 실시간 세션, 1박 2일 오프라인 워크샵 포함",
  },
  {
    icon: Users,
    title: "5인 1팀 맞춤 구성",
    description: "팀 단위 학습으로 내부 확산 기반 마련",
  },
  {
    icon: Shield,
    title: "성과 보장 시스템",
    description: "습득할 때까지 추가 세션 무료 제공",
  },
  {
    icon: Zap,
    title: "즉시 적용 가능",
    description: "실제 업무 기반 프로젝트로 바로 활용",
  },
];

const included = [
  "5주 파워워크샵 전체 커리큘럼",
  "주 2회 온라인 스터디 (총 10회)",
  "1박 2일 오프라인 집중 워크샵",
  "전문가 특강 1회",
  "수료 후 1개월 팔로업 지원",
  "하비탄 AI 클럽 평생 멤버십",
  "AI 도구 세팅 가이드 제공",
  "실무 템플릿 & 프롬프트 모음집",
];

const comparison = [
  { item: "외부 AI 컨설팅", price: "₩3,000만+", result: "보고서만 남음" },
  { item: "대기업 AI 교육", price: "₩2,000만+", result: "일회성 강의" },
  { item: "하비탄 파워워크샵", price: "₩800만", result: "AI 슈퍼유저 5명", highlight: true },
];

export default function Pricing() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="section-padding bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Emerald Accent Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[400px] bg-emerald-500/5 blur-[150px] rounded-full" />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className={`section-label ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            투자 가치
          </span>
          <h2
            className={`mb-6 ${
              isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            ₩800만원 투자,
            <br />
            <span className="text-emerald-400">₩9,600만원 회수</span>
          </h2>
          <p
            className={`text-lg text-neutral-400 max-w-xl mx-auto ${
              isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            교육비가 아닙니다. 연간 ₩9,600만원을 만들어내는
            <br />
            AI 슈퍼유저 5명을 확보하는 투자입니다.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div
          className={`max-w-4xl mx-auto mb-16 ${
            isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          <div className="relative border-2 border-emerald-500/30 bg-emerald-500/5">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-medium uppercase tracking-wider">
              가장 인기 있는 선택
            </div>

            <div className="p-5 sm:p-6 md:p-8 lg:p-12">
              {/* Price Header */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 pb-8 border-b border-emerald-500/20">
                <div>
                  <div className="text-sm text-neutral-500 mb-2">
                    5인 팀 기준 총 투자금
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-2">
                    ₩8,000,000
                  </div>
                  <div className="text-neutral-400">
                    1인당 <span className="text-white font-medium">₩1,600,000</span>
                  </div>
                </div>
                <div className="mt-6 lg:mt-0 text-right">
                  <div className="text-sm text-neutral-500 mb-1">
                    예상 연간 수익
                  </div>
                  <div className="text-3xl font-semibold text-emerald-400">
                    ₩96,000,000
                  </div>
                  <div className="text-sm text-emerald-400/70">
                    ROI 12배 (실제 수료 기업 평균)
                  </div>
                </div>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {valueProps.map((prop, index) => (
                  <div key={index} className="p-4 bg-neutral-900/50 border border-neutral-800">
                    <prop.icon className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="text-sm font-medium text-white mb-1">
                      {prop.title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {prop.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <div className="text-sm font-medium text-white mb-4">
                  포함 내역
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {included.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-200"
                >
                  무료 상담 신청하기
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="flex-1 flex items-center justify-center gap-2 py-4 border border-neutral-700 text-white hover:border-neutral-600 hover:bg-neutral-900/50 transition-all duration-200"
                >
                  프로그램 안내서 다운로드
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div
          className={`max-w-2xl mx-auto ${
            isVisible ? "animate-fade-in-up delay-400" : "opacity-0"
          }`}
        >
          <div className="text-center mb-6">
            <div className="text-sm font-medium text-neutral-500">
              다른 옵션과 비교해보세요
            </div>
          </div>
          <div className="border border-neutral-800">
            {comparison.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 ${
                  index !== comparison.length - 1 ? "border-b border-neutral-800" : ""
                } ${item.highlight ? "bg-emerald-500/5" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {item.highlight && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className={item.highlight ? "text-white font-medium" : "text-neutral-500"}>
                    {item.item}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={item.highlight ? "text-white font-medium" : "text-neutral-500"}>
                    {item.price}
                  </span>
                  <span className={`text-sm ${item.highlight ? "text-emerald-400" : "text-neutral-600"}`}>
                    {item.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div
          className={`mt-12 text-center text-sm text-neutral-600 ${
            isVisible ? "animate-fade-in-up delay-500" : "opacity-0"
          }`}
        >
          <p>
            개인 참가 또는 10인 이상 단체는 별도 문의 |{" "}
            <a href="/contact" className="text-neutral-400 hover:text-white transition-colors">
              맞춤 견적 받기
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
