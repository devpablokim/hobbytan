import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { businessInfo, companyProfile } from "./siteData";
import s from "./site.module.css";

// Footer shared by the home page (LightSite) and /contact. It has no hooks, so it renders
// the same markup from client and server components.
// nvidiaNotice: NVIDIA's required trademark line, for pages that show the NVIDIA Inception badge.
export default function SiteFooter({ nvidiaNotice = false }: { nvidiaNotice?: boolean }) {
  return <footer className={`${s.footer} ${s.container}`}><div className={s.footerMain}><Image src="/logo-black.svg" alt="HOBBYTAN AI" width={200} height={30}/><a href="mailto:pablo@hobbytan.com">pablo@hobbytan.com <ArrowUpRight size={18}/></a><a className={s.downloadLink} href={companyProfile.href} download={companyProfile.filename}>기업소개서 다운로드 <ArrowDown size={17}/></a></div><nav className={s.policyNav} aria-label="정책과 바로가기"><ul><li><a href="/shop"><strong>강의 신청</strong></a></li><li><a href="/shop/terms">이용약관</a></li><li><a href="/shop/privacy"><strong>개인정보처리방침</strong></a></li><li><a href="/shop/refund">환불정책</a></li><li><a href="/rebirth-farmer">리벌스 파머</a></li></ul></nav><section className={s.businessInfo} aria-labelledby="business-info-title"><h2 id="business-info-title" className={s.srOnly}>사업자 정보</h2><dl>{businessInfo.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd></div>)}</dl></section><div className={s.footerBottom}><span>© {new Date().getFullYear()} HOBBYTAN AI</span><span>AI 전환 전략 · 슈퍼AI워크샵 · 업무 도구 구현</span></div>{nvidiaNotice && <p className={s.legalNote}>© 2026 NVIDIA, the NVIDIA logo, and NVIDIA Inception are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries.</p>}</footer>;
}
