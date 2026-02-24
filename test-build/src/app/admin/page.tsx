"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  User,
  Loader2,
  Inbox,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "replied";
}

export default function AdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      } else {
        setError("문의 목록을 불러오는데 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded">
            <AlertCircle className="w-3 h-3" />
            신규
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-400 rounded">
            <Clock className="w-3 h-3" />
            확인됨
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded">
            <CheckCircle className="w-3 h-3" />
            답변완료
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-white.svg"
                  alt="HOBBYTAN AI"
                  width={160}
                  height={32}
                  className="h-7 lg:h-8 w-auto"
                />
              </Link>
              <span className="px-2 py-1 text-xs font-medium bg-neutral-800 text-neutral-400 rounded">
                Admin
              </span>
            </div>
            <Link
              href="/"
              className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                문의 관리
              </h1>
              <p className="text-neutral-400">
                총 {inquiries.length}건의 문의
              </p>
            </div>
            <button
              onClick={fetchInquiries}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              새로고침
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchInquiries}
                className="px-4 py-2 bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-20">
              <Inbox className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg mb-2">아직 문의가 없습니다</p>
              <p className="text-neutral-500 text-sm">
                새로운 문의가 들어오면 여기에 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Inquiry List */}
              <div className="lg:col-span-1 space-y-3">
                {inquiries.map((inquiry) => (
                  <button
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`w-full text-left p-4 border transition-colors ${
                      selectedInquiry?.id === inquiry.id
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral-500" />
                        <span className="font-medium text-white">{inquiry.name}</span>
                      </div>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    {inquiry.company && (
                      <p className="text-sm text-neutral-500 mb-1">{inquiry.company}</p>
                    )}
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-2">
                      {inquiry.message}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </button>
                ))}
              </div>

              {/* Inquiry Detail */}
              <div className="lg:col-span-2">
                {selectedInquiry ? (
                  <div className="bg-neutral-900/50 border border-neutral-800 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-800">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-white">
                            {selectedInquiry.name}
                          </h2>
                          {getStatusBadge(selectedInquiry.status)}
                        </div>
                        <p className="text-sm text-neutral-500">
                          {formatDate(selectedInquiry.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded">
                        <Mail className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-xs text-neutral-500">이메일</p>
                          <a
                            href={`mailto:${selectedInquiry.email}`}
                            className="text-sm text-white hover:text-emerald-400 transition-colors"
                          >
                            {selectedInquiry.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded">
                        <Phone className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-xs text-neutral-500">연락처</p>
                          <a
                            href={`tel:${selectedInquiry.phone}`}
                            className="text-sm text-white hover:text-emerald-400 transition-colors"
                          >
                            {selectedInquiry.phone}
                          </a>
                        </div>
                      </div>
                      {selectedInquiry.company && (
                        <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded sm:col-span-2">
                          <Building2 className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-xs text-neutral-500">회사/기관명</p>
                            <p className="text-sm text-white">{selectedInquiry.company}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-medium text-white">문의 내용</h3>
                      </div>
                      <div className="p-4 bg-neutral-800/50 rounded">
                        <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=Re: [하비탄 AI] 문의에 대한 답변입니다`}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        이메일 답변하기
                      </a>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-700 text-white hover:border-neutral-600 hover:bg-neutral-800/50 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        전화하기
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[400px] bg-neutral-900/50 border border-neutral-800">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500">문의를 선택해 주세요</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
