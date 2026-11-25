import type { Metadata } from "next";
import localFont from "next/font/local";
import ContactContent from "./ContactContent";
import { EnglishRedirect, languageAlternates } from "../light/i18n";

const wantedSans = localFont({
  src: "../light/fonts/WantedSansVariable.woff2",
  display: "swap",
  weight: "400 1000",
});

const ogImage = "https://hobbytan.com/light-assets/og/hobbytan-og-20261009.jpg";
const title = "상담 문의 | HOBBYTAN AI";
const description = "AI 전환 상담, 슈퍼AI워크샵, 맞춤 업무 도구 문의를 남겨 주세요. 영업일 기준 48시간 이내에 회신드립니다.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: "https://hobbytan.com/contact", languages: languageAlternates("/contact", "/en/contact") },
  openGraph: {
    title,
    description,
    url: "https://hobbytan.com/contact",
    siteName: "HOBBYTAN AI",
    locale: "ko_KR",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "당신과 AI 사이, 하비탄AI · hobbytan.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function ContactPage() {
  return <div className={wantedSans.className}>
    <EnglishRedirect target="/en/contact"/>
    <ContactContent/>
  </div>;
}
