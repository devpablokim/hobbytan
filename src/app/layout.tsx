import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HOBBYTAN AI | AI Transformation Partner",
  description:
    "당신과 AI 기술 사이, 하비탄 AI. AI 도입의 모든 단계를 책임지는 유일한 파트너. 5주 만에 조직 내 AI 슈퍼유저를 만듭니다.",
  keywords: [
    "AI 컨설팅",
    "AI 교육",
    "AI 워크샵",
    "ChatGPT 교육",
    "AI 자동화",
    "기업 AI 도입",
    "하비탄 AI",
  ],
  authors: [{ name: "HOBBYTAN AI" }],
  openGraph: {
    title: "HOBBYTAN AI | AI Transformation Partner",
    description:
      "당신과 AI 기술 사이, 하비탄 AI. AI 도입의 모든 단계를 책임지는 유일한 파트너.",
    url: "https://hobbytan.com",
    siteName: "HOBBYTAN AI",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOBBYTAN AI | AI Transformation Partner",
    description:
      "당신과 AI 기술 사이, 하비탄 AI. AI 도입의 모든 단계를 책임지는 유일한 파트너.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
