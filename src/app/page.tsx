import type { Metadata } from "next";
import localFont from "next/font/local";
import LightSite from "./light/LightSite";

const wantedSans = localFont({
  src: "./light/fonts/WantedSansVariable.woff2",
  display: "swap",
  weight: "400 1000",
});

export const metadata: Metadata = {
  title: "HOBBYTAN AI | AI 전환 컨설팅·슈퍼AI워크샵",
  description: "AI 전환 컨설팅과 슈퍼AI워크샵으로 우리 팀의 AI 슈퍼유저를 키웁니다. 팀이 직접 개발하고 관리할 수 있도록 돕는 하비탄 AI.",
  keywords: ["하비탄AI", "AI 전환 컨설팅", "개발·관리 내재화", "기업 AI 교육", "AX 컨설팅", "슈퍼AI워크샵"],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://hobbytan.com" },
  openGraph: {
    title: "HOBBYTAN AI | AI 전환 컨설팅·슈퍼AI워크샵",
    description: "AI로 업무를 바꾸고, 우리 팀의 역량을 키웁니다. AI 전환 전략부터 슈퍼유저 교육, 개발·관리 내재화까지.",
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
    title: "HOBBYTAN AI | AI 전환 컨설팅·슈퍼AI워크샵",
    description: "AI 전환 컨설팅과 슈퍼AI워크샵으로 팀이 직접 만들고 관리할 수 있도록 돕습니다.",
    images: ["https://hobbytan.com/light-assets/og/hobbytan-og-20261009.jpg"],
  },
};

export default function Home() {
  return <div className={wantedSans.className}><LightSite /></div>;
}
