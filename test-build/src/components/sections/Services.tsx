"use client";

import {
  Settings,
  Globe,
  Lightbulb,
  Users,
  Layers,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks";

const services = [
  {
    icon: Users,
    title: "하비탄 AI 클럽",
    category: "COMMUNITY",
    description:
      "AI 비즈니스 전문가 네트워크. 월별 이벤트와 코워킹. 파워워크샵 수료자 자동 초대.",
  },
  {
    icon: Settings,
    title: "AI 시스템 설정/대행",
    category: "SETUP",
    description:
      "ChatGPT, Claude, Notion AI 초기 세팅. Make/Zapier 자동화 워크플로우 구축.",
  },
  {
    icon: Globe,
    title: "AI 비즈니스 웹사이트 구축",
    category: "DEVELOPMENT",
    description:
      "AI 기반 랜딩페이지/웹사이트 제작. 컨설팅부터 BM 설계, 개발까지 원스톱.",
  },
  {
    icon: GraduationCap,
    title: "AI 역량 강화 교육",
    category: "EDUCATION",
    description:
      "부모, 구직자, 학생, 공공기관 대상 맞춤형 AI 교육 프로그램. 단기/장기 과정 운영.",
  },
  {
    icon: Layers,
    title: "자체 AI 서비스",
    category: "SOLUTION",
    description:
      "ORDER MAKER (발주 자동화), OurSona (페르소나 생성), WEB FIT (가상 피팅), AI조씨 (교육 콘텐츠)",
  },
  {
    icon: Lightbulb,
    title: "맞춤형 컨설팅",
    category: "STRATEGY",
    description:
      "AI 도입 로드맵 수립, 비즈니스 모델 설계, 조직 AI 역량 진단.",
  },
];

export default function Services() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-padding bg-[#0a0a0a] relative"
    >
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="max-w-2xl mb-8 lg:mb-0">
            <span
              className={`section-label ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              MORE SERVICES
            </span>
            <h2
              className={`mb-4 ${
                isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
              }`}
            >
              다양한 AI 밀착 서비스로
              <br />
              <span className="text-neutral-500">귀사의 성장을 돕습니다</span>
            </h2>
          </div>
          <p
            className={`text-neutral-400 max-w-md ${
              isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            각 서비스는 독립적으로 또는 파워워크샵과 연계하여 제공됩니다.
          </p>
        </div>

        {/* Services Grid */}
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800 mb-16 ${
            isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="card-feature group"
            >
              <div className="relative z-10">
                <span className="inline-block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600 mb-6">
                  {service.category}
                </span>
                <div className="icon-box mb-6 group-hover:border-neutral-600 transition-colors duration-200">
                  <service.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex items-center text-sm font-medium text-neutral-500 group-hover:text-white transition-colors duration-200">
                  자세히 보기
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center ${
            isVisible ? "animate-fade-in-up delay-400" : "opacity-0"
          }`}
        >
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
            어떤 서비스가 필요한지 모르겠다면?
            <br />
            무료 상담을 통해 맞춤형 솔루션을 찾아드립니다.
          </p>
          <a href="#pricing" className="btn-primary group">
            무료 상담 신청
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
