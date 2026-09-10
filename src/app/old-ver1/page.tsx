import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HOBBYTAN AI | 이전 홈페이지",
  description: "하비탄AI의 이전 홈페이지입니다. 기존 프로그램과 가격 안내를 보존합니다.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://hobbytan.com/old-ver1" },
  openGraph: { title: "HOBBYTAN AI | 이전 홈페이지", description: "기존 홈페이지 보관본", url: "https://hobbytan.com/old-ver1" },
  twitter: { card: "summary", title: "HOBBYTAN AI | 이전 홈페이지", description: "기존 홈페이지 보관본" },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WhyNow from "@/components/sections/WhyNow";
import Problem from "@/components/sections/Problem";
import Curriculum from "@/components/sections/Curriculum";
import Services from "@/components/sections/Services";
import Success from "@/components/sections/Success";
import WhyHobbytan from "@/components/sections/WhyHobbytan";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";

export default function ArchivedHome() {
  return (
    <main className="min-h-screen">
      <Header homeHref="/old-ver1" />
      <Hero />
      <WhyNow />
      <Problem />
      <Curriculum />
      <Services />
      <Success />
      <WhyHobbytan />
      <Pricing />
      <CTA />
      <Footer homeHref="/old-ver1" />
    </main>
  );
}
