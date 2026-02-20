"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "왜 지금인가", href: "#why-now" },
  { label: "프로그램", href: "#program" },
  { label: "커리큘럼", href: "#curriculum" },
  { label: "서비스", href: "#services" },
  { label: "성공 사례", href: "#success" },
  { label: "가격", href: "#pricing" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="https://hobbytan.com" className="flex items-center group">
            <Image
              src="/logo-white.svg"
              alt="HOBBYTAN AI"
              width={160}
              height={32}
              className="h-7 lg:h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-[13px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/contact" className="nav-link text-[13px]">
              문의하기
            </Link>
            <Link
              href="#pricing"
              className="btn-primary text-[13px] group"
            >
              무료 상담 신청
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 -mr-3 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-[#0a0a0a] transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-wide py-8">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-4 text-xl sm:text-2xl font-medium text-white border-b border-neutral-800 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <Link
              href="/contact"
              className="block w-full btn-secondary text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              문의하기
            </Link>
            <Link
              href="#pricing"
              className="block w-full btn-primary text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              무료 상담 신청
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
