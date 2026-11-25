import type { Metadata } from "next";
import localFont from "next/font/local";
import { ArrowUpRight } from "lucide-react";
import ContactHeader from "./ContactHeader";
import ContactForm from "./ContactForm";
import SiteFooter from "../light/SiteFooter";
import s from "../light/site.module.css";
import c from "./contact.module.css";

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
  alternates: { canonical: "https://hobbytan.com/contact" },
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
    <div className={`${s.page} ${c.root}`} data-theme="light" data-design="editorial-v6" data-page="contact">
      <a className={s.skip} href="#main-content">본문으로 건너뛰기</a>
      <ContactHeader/>
      <main id="main-content">
        <div className={`${s.container} ${c.layout}`}>
          <section className={c.intro} aria-labelledby="contact-title">
            <p className={s.eyebrow}>AI 전환 상담</p>
            <h1 id="contact-title">지금 바꾸고 싶은<br/>{" "}<span>업무를 들려주세요.</span></h1>
            <p className={c.lead}><strong>AI 전환 상담 · 슈퍼AI워크샵 · 맞춤 업무 도구</strong><br/>{" "}조직의 상황과 바꾸고 싶은 업무를 남겨 주시면<br/>{" "}담당자가 확인한 뒤 회신드립니다.</p>
            <dl className={c.infoList}>
              <div><dt>이메일</dt><dd><a href="mailto:pablo@hobbytan.com">pablo@hobbytan.com</a></dd></div>
              <div><dt>상담 가능 시간</dt><dd>평일 09:00–18:00</dd></div>
              <div><dt>회신 안내</dt><dd>영업일 기준 48시간 이내</dd></div>
            </dl>
            <div className={c.programLine}>
              <p>강의·워크샵을 바로 신청하려면</p>
              <a className={c.textLink} href="/shop">프로그램 보기 <ArrowUpRight size={18}/></a>
            </div>
          </section>
          <ContactForm/>
        </div>
      </main>
      <SiteFooter/>
    </div>
  </div>;
}
