"use client";

import {
  BookOpen,
  Code,
  Rocket,
  Check,
  Calendar,
  Video,
  MessageSquare,
  Users,
  ArrowRight,
} from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks";

const weeks = [
  {
    num: "01",
    weeks: "WEEK 1-2",
    title: "기초 + 실습",
    icon: BookOpen,
    items: [
      "AI 도구 세팅 (ChatGPT, Claude, Gemini, Notion AI 등)",
      "프롬프트 엔지니어링 기본",
      "개인별 업무 AI 적용 과제",
    ],
  },
  {
    num: "02",
    weeks: "WEEK 3-4",
    title: "심화 + 프로젝트",
    icon: Code,
    items: [
      "업무별 AI 활용 실습 (마케팅/영업/기획/CS/개발)",
      "자동화 워크플로우 설계 (Make, Zapier, n8n)",
      "개인/팀 프로젝트 수행",
      "주 2회 피드백 세션",
    ],
  },
  {
    num: "03",
    weeks: "WEEK 5",
    title: "통합 + 확산 준비",
    icon: Rocket,
    items: ["통합 과제 발표 (경쟁 PT)", "수료 및 AI 슈퍼유저 인증"],
  },
];

const specialEvents = [
  {
    icon: Calendar,
    title: "1박 2일 집중 워크샵",
    subtitle: "₩200만 상당",
    description: "일상에서 벗어나 오직 AI에만 집중하는 48시간. 팀 프로젝트, 해커톤, 네트워킹까지.",
    highlight: "몰입",
  },
  {
    icon: Users,
    title: "현직 AI 리더 특강",
    subtitle: "₩50만 상당",
    description: "책이나 유튜브에서 절대 배울 수 없는 10년차 전문가의 실전 노하우를 직접 듣습니다.",
    highlight: "전문성",
  },
  {
    icon: Video,
    title: "소수정예 온라인 코칭",
    subtitle: "총 10회 × ₩15만",
    description: "5인 1그룹으로 진행. 혼자였다면 포기할 지점을 함께 넘습니다. 94% 수료율의 비결.",
    highlight: "지속성",
  },
  {
    icon: MessageSquare,
    title: "수료 후 90일 성과관리",
    subtitle: "₩100만 상당",
    description: "프로그램 종료 후에도 전문가가 함께합니다. 배운 것이 진짜 내 것이 될 때까지.",
    highlight: "책임",
  },
];

const included = [
  { text: "5주 실전 커리큘럼 + 교재", value: "₩150만" },
  { text: "주 2회 온라인 코칭 (총 10회)", value: "₩150만" },
  { text: "1박 2일 오프라인 워크샵", value: "₩200만" },
  { text: "현직 AI 리더 특강 1회", value: "₩50만" },
  { text: "수료 후 90일 팔로업 지원", value: "₩100만" },
  { text: "프롬프트 템플릿 150종+", value: "₩80만" },
];

export default function Curriculum() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="curriculum"
      className="section-padding bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span
            className={`section-label ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            5 WEEK CURRICULUM
          </span>
          <h2
            className={`mb-6 ${
              isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            5주 후, 당신의 조직에
            <br />
            <span className="text-neutral-500">AI 전문가</span>가 생성됩니다
          </h2>
        </div>

        {/* Timeline - Horizontal Cards */}
        <div
          className={`mb-20 ${
            isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
          }`}
        >
          {/* Progress Line */}
          <div className="hidden lg:block relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800" />
            <div className="flex justify-between relative">
              {weeks.map((week, index) => (
                <div
                  key={index}
                  className="w-4 h-4 bg-blue-500 border-4 border-[#0a0a0a]"
                  style={{ marginLeft: index === 0 ? "16.66%" : 0, marginRight: index === weeks.length - 1 ? "16.66%" : 0 }}
                />
              ))}
            </div>
          </div>

          {/* Week Cards */}
          <div className="grid lg:grid-cols-3 gap-px bg-neutral-800">
            {weeks.map((week, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] p-5 sm:p-6 lg:p-8 group hover:bg-neutral-900/50 transition-colors duration-200"
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl lg:text-5xl font-medium text-neutral-800 group-hover:text-neutral-700 transition-colors duration-200">
                    {week.num}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600 mb-2 block">
                      {week.weeks}
                    </span>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="icon-box group-hover:border-neutral-600 transition-colors duration-200">
                        <week.icon className="w-4 h-4 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        {week.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {week.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Events - Premium Section */}
        <div
          className={`mb-24 py-16 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 bg-gradient-to-b from-blue-500/5 via-neutral-900/50 to-transparent ${
            isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 uppercase mb-4">
              Premium Exclusive
            </span>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              타 교육에서 볼 수 없는 특별 구성
            </h3>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              총 <span className="text-white font-medium">₩500만원 상당</span>의 프리미엄 혜택이 포함되어 있습니다
            </p>
          </div>

          {/* Cards Grid - 2x2 on desktop for better readability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {specialEvents.map((event, index) => (
              <div
                key={index}
                className="relative bg-neutral-900/80 border border-neutral-800 p-4 sm:p-6 lg:p-8 group hover:border-blue-500/30 hover:bg-neutral-900 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {/* Highlight Badge */}
                <span className="absolute top-4 right-4 text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 uppercase tracking-wider">
                  {event.highlight}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <event.icon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Content */}
                <h4 className="text-base lg:text-lg font-semibold text-white mb-1">
                  {event.title}
                </h4>
                <span className="text-xs text-blue-400 font-medium mb-3 block">
                  {event.subtitle}
                </span>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included - Value-Based Layout */}
        <div
          className={`border border-neutral-800 bg-neutral-900/30 ${
            isVisible ? "animate-fade-in-up delay-400" : "opacity-0"
          }`}
        >
          {/* Header with Total Value */}
          <div className="p-5 sm:p-6 lg:p-10 border-b border-neutral-800 text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
              <span className="text-blue-400">₩800만</span>
              <span className="text-neutral-400 text-lg ml-2">(5인 팀 기준 · 1인당 ₩160만)</span>
            </h3>
            <p className="text-neutral-400">
              모든 혜택이 포함된 올인원 패키지
            </p>
          </div>

          {/* Items Grid */}
          <div className="p-5 sm:p-6 lg:p-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {included.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors duration-200">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white block mb-1">{item.text}</span>
                    <span className="text-xs text-blue-400 font-medium">시장가 {item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA - Prominent Position */}
          <div className="p-5 sm:p-6 lg:p-10 border-t border-neutral-800 bg-gradient-to-r from-blue-500/5 to-transparent">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-white font-medium mb-1">
                  소수정예 <span className="text-blue-400">5인 1팀</span> 구성
                </p>
                <p className="text-sm text-neutral-500">
                  30분 무료 상담으로 우리 팀 ROI를 계산해보세요
                </p>
              </div>
              <a href="#pricing" className="btn-primary group whitespace-nowrap">
                무료 ROI 계산받기
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
