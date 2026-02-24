"use client";

import { ArrowRight, Calendar, Clock, MessageSquare, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { useIntersectionObserver } from "@/lib/hooks";

const guarantees = [
  {
    icon: Shield,
    text: "100% 환불 보장",
  },
  {
    icon: Clock,
    text: "30분 무료 상담",
  },
  {
    icon: Calendar,
    text: "48시간 내 응답",
  },
];

const urgencyReasons = [
  "다음 기수 모집 중 — 일정 문의",
];

export default function CTA() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#050a05] to-[#0a0a0a] relative overflow-hidden"
    >
      {/* Emerald Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] bg-emerald-500/10 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-green-500/5 blur-[150px] rounded-full" />

      <div className="container-wide relative z-10">
        {/* Main CTA Card */}
        <div
          className={`max-w-4xl mx-auto ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="relative border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent p-5 sm:p-6 md:p-8 lg:p-12">
            {/* Urgency Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                한정 모집 중
              </span>
            </div>

            <div className="text-center mb-8">
              <h2
                className={`mb-4 ${
                  isVisible ? "animate-fade-in-up delay-100" : "opacity-0"
                }`}
              >
                다음 <span className="text-emerald-400">성공 사례</span>는
                <br />
                귀사가 될 차례입니다
              </h2>
              <p
                className={`text-lg text-neutral-400 max-w-xl mx-auto ${
                  isVisible ? "animate-fade-in-up delay-200" : "opacity-0"
                }`}
              >
                11개 기업이 ₩800만원 투자로 연 ₩9,600만원의 가치를 만들었습니다.
                <br />
                <span className="text-white font-medium">
                  30분 무료 상담으로 귀사의 ROI를 계산해 드립니다.
                </span>
              </p>
            </div>

            {/* Urgency List */}
            <div
              className={`flex flex-col sm:flex-row justify-center gap-4 mb-8 ${
                isVisible ? "animate-fade-in-up delay-250" : "opacity-0"
              }`}
            >
              {urgencyReasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900/50 border border-emerald-500/20"
                >
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-neutral-300">{reason}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 ${
                isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
              }`}
            >
              <Link
                href="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors duration-200"
              >
                <MessageSquare className="w-5 h-5" />
                지금 바로 상담 신청
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#pricing"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-neutral-600 text-white hover:border-neutral-500 hover:bg-neutral-900/50 transition-all duration-200"
              >
                프로그램 상세 보기
              </a>
            </div>

            {/* Guarantees */}
            <div
              className={`flex flex-wrap justify-center gap-6 ${
                isVisible ? "animate-fade-in-up delay-400" : "opacity-0"
              }`}
            >
              {guarantees.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-neutral-400"
                >
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Proof Footer */}
        <div
          className={`mt-12 text-center ${
            isVisible ? "animate-fade-in-up delay-500" : "opacity-0"
          }`}
        >
          <p className="text-sm text-neutral-600 mb-4">
            이미 검증된 기업들의 선택
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["E", "F", "G", "S", "+"].map((letter, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-[#0a0a0a] ${
                      letter === "+"
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {letter === "+" ? "43" : letter}
                  </div>
                ))}
              </div>
              <span className="text-sm text-neutral-500">
                <span className="text-white font-medium">11개</span> 기업 수료
              </span>
            </div>
            <div className="h-4 w-px bg-neutral-800" />
            <span className="text-sm text-neutral-500">
              중도 포기 <span className="text-emerald-400 font-medium">0건</span>
            </span>
            <div className="h-4 w-px bg-neutral-800" />
            <span className="text-sm text-neutral-500">
              평균 ROI <span className="text-emerald-400 font-medium">12배</span>
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div
          className={`mt-8 text-center ${
            isVisible ? "animate-fade-in-up delay-600" : "opacity-0"
          }`}
        >
          <p className="text-xs text-neutral-600">
            문의: pablo@hobbytan.com | 상담 가능 시간: 평일 09:00-18:00
          </p>
        </div>
      </div>
    </section>
  );
}
