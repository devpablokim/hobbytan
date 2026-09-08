import type { Metadata } from "next";
import localFont from "next/font/local";
import NewTestSite from "./NewTestSite";

const pretendard = localFont({ src: "./fonts/PretendardVariable.woff2", display: "swap", weight: "100 900", preload: false });
export const metadata: Metadata = {
  title: "HOBBYTAN AI | 업무 자동화·AI 구축 — 새 사이트 미리보기",
  description: "하비탄은 반복 업무를 자동화하고, 사내 자료를 활용하는 AI 도구를 만듭니다. 팀 교육과 업무 진단도 함께 진행합니다.",
  robots: { index: false, follow: false },
  openGraph: { title: "HOBBYTAN AI | 업무 자동화·AI 구축", description: "매일 반복하는 업무, AI로 줄여드립니다.", url: "https://hobbytan.com/newtest" },
  twitter: { card: "summary", title: "HOBBYTAN AI | 업무 자동화·AI 구축", description: "새 사이트 디자인 미리보기" },
};
export default function NewTestPage() {
  return <div className={pretendard.className}><NewTestSite /></div>;
}
