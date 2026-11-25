import type { Metadata } from "next";
import localFont from "next/font/local";
import LightSite from "./light/LightSite";
import { EnglishRedirect, languageAlternates } from "./light/i18n";

const wantedSans = localFont({
  src: "./light/fonts/WantedSansVariable.woff2",
  display: "swap",
  weight: "400 1000",
});

export const metadata: Metadata = {
  title: "HOBBYTAN AI | AI 서비스 개발·AX 컨설팅·슈퍼AI워크샵",
  description: "하비탄AI는 AI 서비스를 연구하고 직접 만들어 운영하는 AI 회사입니다. 게임 리벌스 파머와 마케팅 AI Promha를 운영하며, 같은 기술로 AX 컨설팅과 슈퍼AI워크샵을 제공합니다.",
  keywords: ["하비탄AI", "AI 회사", "리벌스 파머", "Promha", "AI 전환 컨설팅", "AX 컨설팅", "기업 AI 교육", "슈퍼AI워크샵"],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://hobbytan.com", languages: languageAlternates("/", "/en") },
  openGraph: {
    title: "HOBBYTAN AI | AI 서비스 개발·AX 컨설팅·슈퍼AI워크샵",
    description: "AI 서비스를 연구하고 직접 만들어 운영합니다. 자체 서비스에서 쌓은 기술로 기업의 AI 전환(AX)을 설계하고 구현합니다.",
    url: "https://hobbytan.com",
    siteName: "HOBBYTAN AI",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://hobbytan.com/light-assets/og/hobbytan-og-20261009.jpg",
        width: 1200,
        height: 630,
        alt: "당신과 AI 사이, 하비탄AI · hobbytan.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOBBYTAN AI | AI 서비스 개발·AX 컨설팅·슈퍼AI워크샵",
    description: "자체 AI 서비스를 운영하며 쌓은 기술로 AX 컨설팅과 슈퍼AI워크샵을 제공합니다.",
    images: ["https://hobbytan.com/light-assets/og/hobbytan-og-20261009.jpg"],
  },
};

export default function Home() {
  return <div className={wantedSans.className}><EnglishRedirect target="/en"/><LightSite /></div>;
}
