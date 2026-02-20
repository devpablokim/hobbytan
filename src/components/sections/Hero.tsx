"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-radial-top" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Subtle Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[250px] sm:h-[300px] md:h-[400px] bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="container-wide relative z-10 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 mb-8 border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm ${
              mounted ? "animate-fade-in-down" : "opacity-0"
            }`}
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              가장 뛰어난 AX 혁신 파트너
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${
              mounted ? "animate-fade-in-up delay-100" : "opacity-0"
            }`}
          >
            조직의 체질을 완전히 바꾸는 5주,
            <br />
            <span className="text-gradient">하비탄AI가 만들어드립니다.</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-base sm:text-lg md:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed ${
              mounted ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            5주 파워워크샵 수료 후, 귀사의 팀원 5명이
            <br />
            <span className="text-white font-medium">
              매월 600만원의 업무 가치를 추가로 창출합니다.
            </span>
          </p>

          {/* Social Proof */}
          <div
            className={`flex items-center justify-center gap-6 mb-12 ${
              mounted ? "animate-fade-in-up delay-250" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-neutral-700 border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-medium text-white"
                  >
                    {["E", "F", "G", "S"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-neutral-500">
                <span className="text-white font-medium">10+</span> 기업 수료
              </span>
            </div>
            <div className="h-4 w-px bg-neutral-800" />
            <span className="text-sm text-neutral-500">
              <span className="text-emerald-400 font-medium">80+</span> 슈퍼유저 육성
            </span>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 ${
              mounted ? "animate-fade-in-up delay-300" : "opacity-0"
            }`}
          >
            <a href="#pricing" className="btn-primary group">
              30분 무료 진단 받기
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Value Proposition Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
              mounted ? "animate-fade-in-up delay-400" : "opacity-0"
            }`}
          >
            <div className="p-4 sm:p-6 border border-neutral-800 bg-neutral-900/30 text-left">
              <div className="text-xl sm:text-2xl font-semibold text-white mb-1">5주</div>
              <div className="text-xs sm:text-sm text-neutral-500">
                AI 슈퍼유저 육성 기간
              </div>
            </div>
            <div className="p-4 sm:p-6 border border-emerald-500/30 bg-emerald-500/5 text-left">
              <div className="text-xl sm:text-2xl font-semibold text-emerald-400 mb-1">
                ₩9,600만
              </div>
              <div className="text-xs sm:text-sm text-neutral-500">
                연간 예상 절감 효과 (5인 기준)
              </div>
            </div>
            <div className="p-4 sm:p-6 border border-neutral-800 bg-neutral-900/30 text-left">
              <div className="text-xl sm:text-2xl font-semibold text-white mb-1">80%</div>
              <div className="text-xs sm:text-sm text-neutral-500">
                재구매율
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator - Outside container, at very bottom */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 ${
          mounted ? "animate-fade-in delay-500" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-neutral-600">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-neutral-600 to-transparent" />
        </div>
      </div>
    </section>
  );
}
