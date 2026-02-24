"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Send, CheckCircle, Mail, Phone, MapPin, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  website: string; // honeypot field
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해 주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해 주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해 주세요.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해 주세요.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "문의 내용을 입력해 주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        alert(data.error || "문의 접수 중 오류가 발생했습니다.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            문의가 접수되었습니다
          </h1>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            문의해 주셔서 감사합니다.<br />
            담당자가 빠르게 확인 후 연락 드리겠습니다.<br />
            <span className="text-white font-medium">영업일 기준 48시간 이내</span> 회신 드립니다.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-white.svg"
                alt="HOBBYTAN AI"
                width={160}
                height={32}
                className="h-7 lg:h-8 w-auto"
              />
            </Link>
            <Link
              href="/"
              className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Info */}
            <div className="lg:pr-8">
              <span className="inline-block px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-emerald-400 border border-emerald-500/30 mb-6">
                Contact Us
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">
                무엇이든
                <br />
                <span className="text-emerald-400">물어보세요</span>
              </h1>
              <p className="text-lg text-neutral-400 mb-12 leading-relaxed">
                AI 도입, 파워워크샵, 맞춤 컨설팅 등<br />
                궁금하신 점을 남겨주시면 빠르게 답변 드리겠습니다.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <div className="p-5 bg-neutral-900/50 border border-neutral-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">이메일</h3>
                    <a
                      href="mailto:pablo@hobbytan.com"
                      className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors"
                    >
                      pablo@hobbytan.com
                    </a>
                  </div>
                </div>

                <div className="p-5 bg-neutral-900/50 border border-neutral-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">상담 가능 시간</h3>
                    <p className="text-sm text-neutral-400">
                      평일 09:00 - 18:00
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-neutral-900/50 border border-neutral-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">회신 안내</h3>
                    <p className="text-sm text-neutral-400">
                      영업일 기준 48시간 이내 회신
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:pl-8 lg:border-l border-neutral-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot - hidden from users, bots will fill this */}
                <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    이름 <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-neutral-900/50 border ${
                      errors.name ? "border-red-500" : "border-neutral-700"
                    } text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors`}
                    placeholder="홍길동"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    이메일 <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-neutral-900/50 border ${
                      errors.email ? "border-red-500" : "border-neutral-700"
                    } text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors`}
                    placeholder="example@company.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    연락처 <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-neutral-900/50 border ${
                      errors.phone ? "border-red-500" : "border-neutral-700"
                    } text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors`}
                    placeholder="010-1234-5678"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    회사/기관명
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="(주)회사명"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    문의 내용 <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-neutral-900/50 border ${
                      errors.message ? "border-red-500" : "border-neutral-700"
                    } text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none`}
                    placeholder="문의하실 내용을 자유롭게 작성해 주세요."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-400">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      문의하기
                    </>
                  )}
                </button>

                <p className="text-xs text-neutral-500 text-center">
                  제출하신 정보는 문의 응대 목적으로만 사용됩니다.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
