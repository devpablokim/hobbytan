import type { Metadata } from "next";
import localFont from "next/font/local";
import NewTestSite from "./newtest/NewTestSite";

const pretendard = localFont({
  src: "./newtest/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  preload: false,
});

export const metadata: Metadata = {
  title: "HOBBYTAN AI | 업무 자동화·AI 구축·기업 교육",
  description: "하비탄은 반복 업무를 자동화하고, 사내 자료를 활용하는 AI 도구를 만듭니다. 물류·구매·재고·판매·마케팅·분석·예측 업무 진단과 기업 교육을 함께 진행합니다.",
  keywords: ["하비탄AI", "업무 자동화", "AI 시스템 구축", "기업 AI 교육", "AX 컨설팅", "슈퍼AI워크샵"],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://hobbytan.com" },
  openGraph: {
    title: "HOBBYTAN AI | 업무 자동화·AI 구축·기업 교육",
    description: "매일 반복하는 업무, AI로 줄여드립니다. 업무 진단부터 시스템 구축과 팀 교육까지.",
    url: "https://hobbytan.com",
    siteName: "HOBBYTAN AI",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HOBBYTAN AI | 업무 자동화·AI 구축·기업 교육",
    description: "반복 업무 자동화, 맞춤형 AI 시스템 구축, 실무 중심 기업 교육.",
  },
};

export default function Home() {
  return <div className={pretendard.className}><NewTestSite preview={false} /></div>;
}
