"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  services: [
    { label: "AI 파워워크샵", href: "#program" },
    { label: "AI 시스템 설정/대행", href: "#services" },
    { label: "AI 비즈니스 웹사이트 구축", href: "#services" },
    { label: "맞춤형 컨설팅", href: "#services" },
  ],
  resources: [
    { label: "하비탄 AI 클럽", href: "#" },
    { label: "성공 사례", href: "#success" },
    { label: "블로그", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  company: [
    { label: "회사 소개", href: "#" },
    { label: "채용", href: "#" },
    { label: "연락처", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-neutral-800">
      <div className="container-wide">
        {/* Main Footer */}
        <div className="py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-16">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-2">
              <Link href="https://hobbytan.com" className="inline-block mb-6 group">
                <Image
                  src="/logo-white.svg"
                  alt="HOBBYTAN AI"
                  width={160}
                  height={32}
                  className="h-7 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-6">
                당신과 AI 기술 사이, 하비탄 AI
                <br />
                AI 도입의 모든 단계를 책임지는 유일한 파트너
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:pablo@hobbytan.com"
                  className="text-xs text-neutral-600 hover:text-white transition-colors duration-200"
                >
                  pablo@hobbytan.com
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500 mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500 mb-6">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500 mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-neutral-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-600">
              &copy; {new Date().getFullYear()} HOBBYTAN AI. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-xs text-neutral-600 hover:text-white transition-colors duration-200"
              >
                이용약관
              </Link>
              <Link
                href="#"
                className="text-xs text-neutral-600 hover:text-white transition-colors duration-200"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
