"use client";

import { ArrowUpRight } from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks";

const testimonials = [
  {
    company: "E사",
    industry: "IT/소프트웨어",
    quote:
      "외부 컨설팅에 3천만원 썼는데 보고서만 받았습니다. 파워워크샵은 우리 팀이 직접 할 수 있게 만들어줬어요. 기획 인건비가 절반으로 줄었습니다.",
    person: "김OO 이사",
    duration: "5주 수료",
  },
  {
    company: "F사",
    industry: "정보통신",
    quote:
      "임원진이 직접 Claude로 보고서를 작성합니다. 이제 'AI 하세요'가 아니라 '저도 쓰고 있어요'가 됐습니다. 리더 AI 활용률이 12%에서 94%로 올랐어요.",
    person: "박OO 팀장",
    duration: "5주 수료",
  },
  {
    company: "G사",
    industry: "이커머스",
    quote:
      "매일 4시간 걸리던 발주 업무가 40분으로 줄었습니다. 그 시간에 신규 거래처 영업을 합니다. 팀 전체 생산성이 완전히 달라졌어요.",
    person: "이OO 과장",
    duration: "5주 수료",
  },
  {
    company: "H사",
    industry: "제조/물류",
    quote:
      "처음엔 'AI가 뭔 소용이야' 하던 현장 팀장님들이 이제는 먼저 자동화 아이디어를 냅니다. 문화 자체가 바뀌었어요.",
    person: "최OO 부장",
    duration: "5주 수료",
  },
  {
    company: "I사",
    industry: "금융/보험",
    quote:
      "규정 검토에 하루 종일 걸리던 게 이제 30분이면 끝납니다. 컴플라이언스 팀 모두가 워크샵 수료했어요.",
    person: "정OO 차장",
    duration: "5주 수료",
  },
];

export default function Success() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="success"
      className="section-padding bg-gradient-to-b from-[#050505] via-[#0a0a0f] to-[#0a0a0a] relative overflow-hidden"
    >
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <div className="w-full h-px bg-neutral-800 mb-12" />
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-normal text-white ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            수강생들의 이야기
          </h2>
        </div>

        {/* Testimonial Cards - Palantir Style */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 mb-16 ${
            isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
          }`}
        >
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 lg:p-8 bg-neutral-900/50 border-b md:border-b-0 md:border-r border-neutral-800 last:border-b-0 md:last:border-r-0 flex flex-col min-h-0 md:min-h-[280px]"
            >
              {/* Company Name */}
              <div className="mb-6">
                <span className="text-xs font-medium tracking-wider text-white uppercase">
                  {item.company}
                </span>
                <span className="text-xs text-neutral-500 block mt-1">
                  {item.industry}
                </span>
              </div>

              {/* Quote */}
              <p className="text-sm text-neutral-400 leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Person */}
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <p className="text-xs text-neutral-500">
                  {item.person} · {item.duration}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats - Text Based */}
        <div
          className={`border-t border-neutral-800 pt-12 ${
            isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
          }`}
        >
          <p className="text-neutral-400 text-center max-w-3xl mx-auto leading-relaxed">
            지금까지 <span className="text-white font-medium">11개 기업</span>의{" "}
            <span className="text-white font-medium">82명</span>이 파워워크샵을
            수료했습니다. 평균{" "}
            <span className="text-white font-medium">12배의 ROI</span>를
            달성했으며, 중도 포기율은{" "}
            <span className="text-white font-medium">0%</span>입니다.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`mt-12 text-center ${
            isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            우리 회사도 시작하기
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
