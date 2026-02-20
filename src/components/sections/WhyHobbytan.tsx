"use client";

import { Cpu, GraduationCap, HeartHandshake, Sparkles } from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks";

const differentiators = [
  {
    icon: HeartHandshake,
    title: "100% 성과 보장",
    highlight: "중도포기 0건",
    description:
      "11개 기업, 82명 전원 수료. 못 따라오면 추가 세션 무료 제공. 실패하면 전액 환불.",
  },
  {
    icon: GraduationCap,
    title: "내재화 중심 교육",
    highlight: "외부 의존도 0%",
    description:
      "컨설팅 보고서가 아닌 '직접 할 수 있는 능력' 전수. 수료 후 외부 도움 없이 독립 운영.",
  },
  {
    icon: Cpu,
    title: "실시간 AI 트렌드 반영",
    highlight: "평균 3일 내 업데이트",
    description:
      "GPT-5, Claude 4 출시 시 즉시 커리큘럼 반영. 항상 최신 AI 기술로 교육.",
  },
  {
    icon: Sparkles,
    title: "실무 즉시 적용",
    highlight: "첫 주부터 성과",
    description:
      "이론 강의가 아닌 실제 업무 기반 프로젝트. 수료 다음 날부터 바로 업무에 활용.",
  },
];

const comparisonData = [
  {
    category: "교육 방식",
    others: "일방적 강의, 이론 중심",
    hobbytan: "실무 프로젝트 기반 실습",
  },
  {
    category: "수료 후",
    others: "자료만 남음, 지원 종료",
    hobbytan: "1개월 팔로업 + 평생 커뮤니티",
  },
  {
    category: "커리큘럼",
    others: "6개월~1년 전 자료",
    hobbytan: "최신 AI 모델 3일 내 반영",
  },
  {
    category: "성과 측정",
    others: "수료증 발급으로 끝",
    hobbytan: "ROI 측정, 성과 리포트 제공",
  },
];

export default function WhyHobbytan() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#0d0a14] to-[#0a0a0a] relative overflow-hidden"
    >
      {/* Purple Accent Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[400px] h-[300px] sm:h-[400px] md:h-[600px] bg-purple-500/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[150px] sm:w-[200px] md:w-[300px] h-[150px] sm:h-[200px] md:h-[300px] bg-violet-500/5 blur-[120px] rounded-full" />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className={`inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-400 border border-purple-500/30 bg-purple-500/10 mb-6 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            차별화 포인트
          </span>
          <h2
            className={`mb-6 ${
              isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            왜 <span className="text-purple-400">하비탄 AI</span>만
            <br />
            성과를 보장할 수 있는가?
          </h2>
          <p
            className={`text-lg text-neutral-400 max-w-xl mx-auto ${
              isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            11개 기업이 선택한 이유. 단순 교육이 아닌,
            <br />
            <span className="text-white font-medium">
              측정 가능한 성과를 만드는 시스템
            </span>
          </p>
        </div>

        {/* Differentiators Grid */}
        <div
          className={`grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-16 ${
            isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="group p-4 sm:p-5 md:p-6 border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center border border-purple-500/30 bg-purple-500/10 flex-shrink-0">
                  <item.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-medium text-white">
                      {item.title}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.highlight}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div
          className={`max-w-3xl mx-auto ${
            isVisible ? "animate-fade-in-up delay-400" : "opacity-0"
          }`}
        >
          <div className="text-center mb-6">
            <div className="text-sm font-medium text-neutral-500">
              기존 AI 교육 vs 하비탄 파워워크샵
            </div>
          </div>
          <div className="border border-neutral-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-neutral-900/50">
              <div className="p-2 sm:p-4 text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider border-r border-neutral-800">
                비교 항목
              </div>
              <div className="p-2 sm:p-4 text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider text-center border-r border-neutral-800">
                기존 AI 교육
              </div>
              <div className="p-2 sm:p-4 text-[10px] sm:text-xs text-purple-400 uppercase tracking-wider text-center font-medium">
                하비탄 AI
              </div>
            </div>
            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index !== comparisonData.length - 1
                    ? "border-b border-neutral-800"
                    : ""
                }`}
              >
                <div className="p-2 sm:p-4 text-xs sm:text-sm text-white font-medium border-r border-neutral-800">
                  {row.category}
                </div>
                <div className="p-2 sm:p-4 text-xs sm:text-sm text-neutral-500 text-center border-r border-neutral-800">
                  {row.others}
                </div>
                <div className="p-2 sm:p-4 text-xs sm:text-sm text-purple-300 text-center bg-purple-500/5">
                  {row.hobbytan}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div
          className={`mt-16 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto ${
            isVisible ? "animate-fade-in-up delay-500" : "opacity-0"
          }`}
        >
          <div className="text-center p-3 sm:p-4 border border-purple-500/20 bg-purple-500/5">
            <div className="text-xl sm:text-2xl font-semibold text-purple-400">100%</div>
            <div className="text-xs text-neutral-500">수료율</div>
          </div>
          <div className="text-center p-3 sm:p-4 border border-purple-500/20 bg-purple-500/5">
            <div className="text-xl sm:text-2xl font-semibold text-purple-400">3일</div>
            <div className="text-xs text-neutral-500">최신 AI 반영</div>
          </div>
          <div className="text-center p-3 sm:p-4 border border-purple-500/20 bg-purple-500/5">
            <div className="text-xl sm:text-2xl font-semibold text-purple-400">12배</div>
            <div className="text-xs text-neutral-500">평균 ROI</div>
          </div>
        </div>
      </div>
    </section>
  );
}
