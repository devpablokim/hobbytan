import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Locale } from "./i18n";
import { businessInfoByLocale, companyProfile } from "./siteData";
import s from "./site.module.css";

const copy = {
  ko: {
    download: "기업소개서 다운로드",
    navLabel: "정책과 바로가기",
    links: [["/shop", "강의 신청", true], ["/shop/terms", "이용약관", false], ["/shop/privacy", "개인정보처리방침", true], ["/shop/refund", "환불정책", false], ["/rebirth-farmer", "리벌스 파머", false]] as [string, string, boolean][],
    businessTitle: "사업자 정보",
    tagline: "AI 전환 전략 · 슈퍼AI워크샵 · 업무 도구 구현",
  },
  en: {
    download: "Company profile (Korean PDF)",
    navLabel: "Policies and links",
    links: [["/shop", "Courses", true], ["/shop/terms", "Terms of Use", false], ["/shop/privacy", "Privacy Policy", true], ["/shop/refund", "Refund Policy", false], ["/rebirth-farmer", "Rebirth Farmer", false]] as [string, string, boolean][],
    businessTitle: "Business information",
    tagline: "AI transformation strategy · Super AI Workshop · Workflow tools",
  },
};

// Footer shared by the home page (LightSite) and /contact. It has no hooks, so it renders
// the same markup from client and server components.
// nvidiaNotice: NVIDIA's required trademark line, for pages that show the NVIDIA Inception badge.
export default function SiteFooter({ nvidiaNotice = false, locale = "ko" }: { nvidiaNotice?: boolean; locale?: Locale }) {
  const t = copy[locale];
  // Linked policy pages exist in Korean only.
  const linkLang = locale === "en" ? "ko" : undefined;
  return <footer className={`${s.footer} ${s.container}`}><div className={s.footerMain}><Image src="/logo-black.svg" alt="HOBBYTAN AI" width={200} height={30}/><a href="mailto:pablo@hobbytan.com">pablo@hobbytan.com <ArrowUpRight size={18}/></a><a className={s.downloadLink} href={companyProfile.href} download={companyProfile.filename} hrefLang={linkLang}>{t.download} <ArrowDown size={17}/></a></div><nav className={s.policyNav} aria-label={t.navLabel}><ul>{t.links.map(([href, label, strong]) => <li key={href}><a href={href} hrefLang={linkLang}>{strong ? <strong>{label}</strong> : label}</a></li>)}</ul></nav><section className={s.businessInfo} aria-labelledby="business-info-title"><h2 id="business-info-title" className={s.srOnly}>{t.businessTitle}</h2><dl>{businessInfoByLocale[locale].map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd></div>)}</dl></section><div className={s.footerBottom}><span>© {new Date().getFullYear()} HOBBYTAN AI</span><span>{t.tagline}</span></div>{nvidiaNotice && <p className={s.legalNote}>© 2026 NVIDIA, the NVIDIA logo, and NVIDIA Inception are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries.</p>}</footer>;
}
