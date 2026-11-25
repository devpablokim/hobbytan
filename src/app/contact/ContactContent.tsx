import { ArrowUpRight } from "lucide-react";
import ContactHeader from "./ContactHeader";
import ContactForm from "./ContactForm";
import SiteFooter from "../light/SiteFooter";
import type { Locale } from "../light/i18n";
import s from "../light/site.module.css";
import c from "./contact.module.css";

// Body of /contact and /en/contact; each page file keeps its own metadata and font.
const copy = {
  ko: {
    skip: "본문으로 건너뛰기",
    eyebrow: "AI 전환 상담",
    title: ["지금 바꾸고 싶은", "업무를 들려주세요."],
    leadStrong: "AI 전환 상담 · 슈퍼AI워크샵 · 맞춤 업무 도구",
    lead: ["조직의 상황과 바꾸고 싶은 업무를 남겨 주시면", "담당자가 확인한 뒤 회신드립니다."],
    info: [["이메일", null], ["상담 가능 시간", "평일 09:00–18:00"], ["회신 안내", "영업일 기준 48시간 이내"]] as [string, string | null][],
    programQuestion: "강의·워크샵을 바로 신청하려면",
    programLink: "프로그램 보기",
  },
  en: {
    skip: "Skip to content",
    eyebrow: "AI transformation consultation",
    title: ["Tell us about the work", "you want to change."],
    leadStrong: "AI transformation consulting · Super AI Workshop · Custom workflow tools",
    lead: ["Tell us about your organization and the work you want to change,", "and we'll get back to you once we've reviewed it."],
    info: [["Email", null], ["Hours", "Weekdays 09:00–18:00 (KST)"], ["Response time", "Within 48 business hours"]] as [string, string | null][],
    programQuestion: "Ready to sign up for a course or workshop?",
    programLink: "View programs (Korean)",
  },
};

export default function ContactContent({ locale = "ko" }: { locale?: Locale }) {
  const t = copy[locale];
  return <div className={`${s.page} ${c.root}`} data-theme="light" data-design="editorial-v6" data-page="contact" lang={locale === "en" ? "en" : undefined}>
    <a className={s.skip} href="#main-content">{t.skip}</a>
    <ContactHeader locale={locale}/>
    <main id="main-content">
      <div className={`${s.container} ${c.layout}`}>
        <section className={c.intro} aria-labelledby="contact-title">
          <p className={s.eyebrow}>{t.eyebrow}</p>
          <h1 id="contact-title">{t.title[0]}<br/>{" "}<span>{t.title[1]}</span></h1>
          <p className={c.lead}><strong>{t.leadStrong}</strong><br/>{" "}{t.lead[0]}<br/>{" "}{t.lead[1]}</p>
          <dl className={c.infoList}>
            {t.info.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value ?? <a href="mailto:pablo@hobbytan.com">pablo@hobbytan.com</a>}</dd></div>)}
          </dl>
          <div className={c.programLine}>
            <p>{t.programQuestion}</p>
            <a className={c.textLink} href="/shop" hrefLang={locale === "en" ? "ko" : undefined}>{t.programLink} <ArrowUpRight size={18}/></a>
          </div>
        </section>
        <ContactForm locale={locale}/>
      </div>
    </main>
    <SiteFooter locale={locale}/>
  </div>;
}
