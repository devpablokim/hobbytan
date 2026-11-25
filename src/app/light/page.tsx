import type { Metadata } from "next";
import localFont from "next/font/local";
import LightSite from "./LightSite";

const wantedSans = localFont({
  src: "./fonts/WantedSansVariable.woff2",
  display: "swap",
  weight: "400 1000",
});

export const metadata: Metadata = {
  title: "HOBBYTAN AI | Light Edition",
  description: "AI 전환 컨설팅과 슈퍼AI워크샵으로 우리 팀의 AI 슈퍼유저를 키웁니다. 직접 개발하고 관리할 수 있도록 돕는 하비탄 AI.",
  robots: { index: false, follow: false },
};

export default function LightPreview() {
  return <div className={wantedSans.className}><LightSite /></div>;
}
