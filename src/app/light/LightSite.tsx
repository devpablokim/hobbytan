"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, Plus, X } from "lucide-react";
import WorkflowExplorer from "./WorkflowExplorer";
import WorkshopProof from "../newtest/WorkshopProof";
import SiteFooter from "./SiteFooter";
import { companyProfile, programLink, sections } from "./siteData";
import s from "./site.module.css";

const services = [
  { title: "AI 전환 전략", description: "AI를 적용할 업무와 우선순위를 정합니다.", items: ["현재 업무와 AI 활용 수준 진단", "우선 적용 과제와 기대 효과 정의", "실행 계획과 완료 기준 수립"] },
  { title: "슈퍼AI워크샵", description: "조직의 AI 활용을 이끌 사내 실무자를 키웁니다.", items: ["AI의 원리와 한계 이해", "우리 업무로 도구를 만들고 결과를 검증하는 실습", "동료에게 활용법을 전하는 슈퍼유저 교육"] },
  { title: "업무 도구 구현", description: "실제 문서와 데이터로 필요한 도구를 함께 만듭니다.", items: ["업무에 맞는 대시보드와 자동화 구현", "담당자가 참여하는 결과 검증과 예외 처리", "업무 변경에 맞춰 도구를 수정하는 실습"] },
  { title: "운영 내재화", description: "고객의 팀이 직접 운영하고 개선하도록 이관합니다.", items: ["내부 운영 담당자 교육", "문서·권한·관리 기준 정리", "운영 이관과 개선 역량 점검"] },
];
const process = [
  ["진단", "첫 적용 과제를 정합니다", "현재 업무와 AI 활용 수준을 확인하고, 효과가 크고 실행 가능한 과제를 고릅니다."],
  ["교육", "담당자의 실력을 키웁니다", "실제 업무를 바탕으로 도구를 만들고 검증하며, 팀의 AI 활용을 이끌 담당자를 교육합니다."],
  ["구현", "현장에서 쓰며 다듬습니다", "업무 도구를 함께 구현하고 실제 사용 과정에서 발견한 오류와 예외를 보완합니다."],
  ["이관", "팀이 직접 운영합니다", "담당자와 관리 기준을 확정하고, 고객의 팀이 수정과 개선을 이어가도록 운영을 이관합니다."],
];
const questions = [
  ["개발 경험이 없어도 참여할 수 있나요?", "네. 현재의 AI 활용 수준부터 확인합니다. 슈퍼AI워크샵에서 기본을 익힌 뒤 자신의 업무에 적용하며 필요한 도구를 만드는 단계로 나아갑니다."],
  ["회사 데이터를 외부 AI에 보내야 하나요?", "먼저 데이터의 성격과 사내 보안 기준을 확인합니다. 그에 맞춰 사용할 도구, 데이터 저장 위치와 접근 권한을 정합니다."],
  ["내재화는 어느 수준까지 진행하나요?", "장기적으로 개발과 관리의 90% 이상을 내부에서 맡는 것이 목표입니다. 교육과 공동 개발을 거쳐 운영을 단계적으로 이관하며, 실제 범위와 속도는 조직의 인력·업무·보안 조건에 맞춰 정합니다."],
  ["외부 지원 없이 모두 운영해야 하나요?", "필요한 전문 영역에는 외부 도움을 받을 수 있습니다. 내부 담당자가 시스템의 구조와 운영을 이해하고 변경 사항을 판단하도록 교육하며, 외부 파트너와의 역할도 함께 정합니다."],
];

export default function LightSite() {
  const [active, setActive] = useState("top");
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const marker = Math.min(window.innerHeight * .32, 240);
      let current = "top";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= marker) current = section.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) current = "consultation";
      setActive(current);
      setShowTop(window.scrollY > 500);
      frame = 0;
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => { window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  const closeMenu = () => { dialog.current?.close(); setMenuOpen(false); menuTrigger.current?.focus(); };
  function navigate(id: string) {
    closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  return <div ref={pageRef} className={s.page} data-theme="light" data-design="editorial-v6">
    <a className={s.skip} href="#main-content">본문으로 건너뛰기</a>
    <header className={s.header}>
      <div className={s.headerInner}>
        <a className={s.brand} href="#top" aria-label="하비탄 AI 처음으로"><Image src="/logo-black.svg" alt="HOBBYTAN AI" width={200} height={30} priority /></a>
        <nav className={s.quickNav} aria-label="주요 메뉴">{sections.slice(1,5).map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>{item.label}</a>)}<a href={programLink.href}>{programLink.label}</a></nav>
        <a className={s.headerCta} href="#consultation">상담 문의 <ArrowUpRight size={18}/></a>
        <button ref={menuTrigger} className={s.menuButton} aria-label="전체 메뉴 열기" aria-haspopup="dialog" onClick={() => setMenuOpen(true)}><Menu size={24}/></button>
      </div>
    </header>
    <nav className={s.sectionRail} aria-label="페이지 내 위치와 이동">{sections.map((item,i) => <a key={item.id} href={`#${item.id}`} aria-label={`${item.label} 섹션으로 이동`} aria-current={active===item.id?"location":undefined}><span>{item.label}</span><i aria-hidden="true"/><b aria-hidden="true">{String(i+1).padStart(2,"0")}</b></a>)}</nav>
    <main id="main-content">
      <section className={s.hero} id="top" aria-labelledby="hero-title">
        <Image className={s.heroImage} src="/light-assets/architecture.png" alt="" fill priority unoptimized sizes="100vw" />
        <div className={s.heroVeil} aria-hidden="true" />
        <div className={s.container}>
        <p className={s.eyebrow}>AI 전환 컨설팅과 기업 실무 교육</p>
        <h1 id="hero-title">기업의 AI 전환을 설계하고,<br/>{" "}<span>현장에서 완성합니다.</span></h1>
        <p className={s.heroDescription}>AI 전환 전략을 실제 업무 도구로 구현합니다.<br/>{" "}고객의 팀이 직접 운영하고 개선하도록 교육합니다.</p>
        <div className={s.heroActions}><div className={s.heroButtons}><a className={s.primaryLink} href="/contact">AI 전환 상담하기 <ArrowUpRight size={20}/></a><a className={s.primaryLink} href="/shop">강의 종류 보기 <ArrowUpRight size={20}/></a></div><a className={s.downloadLink} href={companyProfile.href} download={companyProfile.filename}>기업소개서 <ArrowDown size={18}/></a></div>
        {/* NVIDIA brand rules: color badge unchanged, never wider than our header logo (184px desktop, 144px mobile); "program" lowercase in a sentence. */}
        <div className={s.inception}><Image src="/light-assets/nvidia-inception-program-badge.svg" alt="NVIDIA Inception Program" width={168} height={73} unoptimized /><p>하비탄AI는 NVIDIA Inception program의 공식 멤버 기업입니다.</p></div>
        </div>
      </section>
      <section className={`${s.section} ${s.container}`} id="services" aria-labelledby="services-title">
        <span id="featured" className={s.anchor}/>
        <div className={s.sectionHead}><p className={s.eyebrow}>서비스</p><h2 id="services-title">우리 조직에 필요한<br/>{" "}단계부터 시작합니다.</h2><p className={s.sectionIntro}>AI를 어디에 쓸지 정하는 일부터 내부 운영까지.<br/>{" "}현재의 업무와 역량에 맞춰 필요한 범위를 설계합니다.</p></div>
        <div className={s.serviceList}>{services.map((item,i) => <details key={item.title} className={s.service}><summary><span className={s.serviceNumber}>0{i+1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><span className={s.serviceMore}>상세 보기</span><Plus size={23}/></summary><ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul></details>)}</div>
      </section>
      <section className={`${s.section} ${s.experience}`} id="experience" aria-labelledby="experience-title"><div className={s.container}>
        <div className={s.sectionHead}><p className={s.eyebrow}>업무 적용 예시</p><h2 id="experience-title">반복하던 업무가<br/>{" "}하나의 화면으로.</h2><p className={s.sectionIntro}>흩어진 자료를 모으고, 확인할 일을 빠르게 찾습니다.<br/>{" "}업무별 화면에서 우리 팀에 필요한 변화를 살펴보세요.</p></div>
        <WorkflowExplorer/>
      </div></section>
      <section className={`${s.section} ${s.container}`} id="education" aria-labelledby="education-title">
        <div className={s.sectionHead}><p className={s.eyebrow}>슈퍼AI워크샵</p><h2 id="education-title">동료의 AI 활용을 이끄는<br/>{" "}사내 슈퍼유저.</h2><p className={s.sectionIntro}><strong>슈퍼유저는 AI로 자기 업무를 개선하고,<br className={s.desktopBreak}/>{" "} 동료의 활용까지 이끄는 사내 실무자입니다.</strong><br/>{" "}직접 도구를 만들고 결과를 검증하는 경험을 쌓습니다.</p></div>
        <div className={s.learningTracks}><article><h3>팀장과 리더</h3><p>AI에 맡길 업무를 고르고 결과를 판단합니다. 팀의 활용 기준을 세우고 동료의 시도를 지원합니다.</p></article><article><h3>현업 실무자</h3><p>매일 하는 업무에 AI를 적용합니다. 도구를 만들고 고치며, 팀에서 활용할 수 있는 방법을 공유합니다.</p></article></div>
        <WorkshopProof variant="editorial"/>
      </section>
      <section className={`${s.section} ${s.approach}`} id="approach" aria-labelledby="approach-title"><div className={s.container}>
        <div className={s.sectionHead}><p className={s.eyebrow}>진행 방식</p><h2 id="approach-title">첫 과제부터<br/>{" "}팀의 직접 운영까지.</h2><p className={s.sectionIntro}>작동하는 도구와 함께,<br/>{" "}그 도구를 운영할 사람과 기준을 남깁니다.</p></div>
        <ol className={s.process}>{process.map(([label,title,description],i) => <li key={label}><span>0{i+1}<b>{label}</b></span><h3>{title}</h3><p>{description}</p></li>)}</ol>
        <div className={s.ownership} id="ownership"><h3>운영의 주도권은 고객의 팀에.</h3><p>업무가 바뀌면 무엇을 고칠지 판단하고 직접 개선할 수 있도록 교육합니다. 역할과 권한, 관리 문서까지 정리해 운영을 이관합니다.</p></div>
      </div></section>
      <section className={`${s.section} ${s.container} ${s.questions}`} id="questions" aria-labelledby="questions-title">
        <div className={s.sectionHead}><p className={s.eyebrow}>자주 묻는 질문</p><h2 id="questions-title">시작하기 전에<br/>{" "}궁금한 점.</h2></div>
        <div>{questions.map(([q,a]) => <details key={q}><summary>{q}<Plus size={22}/></summary><p>{a}</p></details>)}</div>
      </section>
      <section className={s.consultation} id="consultation" aria-labelledby="consultation-title"><div className={s.container}><p className={s.eyebrow}>첫 AI 전환 과제</p><h2 id="consultation-title">지금 바꾸고 싶은<br/>{" "}업무를 들려주세요.</h2><p>우리 조직의 상황에 맞는 첫 실행 계획을 제안합니다.</p><a className={s.primaryLink} href="/contact">AI 전환 상담하기 <ArrowUpRight size={22}/></a></div></section>
    </main>
    <SiteFooter nvidiaNotice/>
    {showTop && <a className={s.toTop} href="#top" aria-label="맨 위로 이동"><ArrowUp size={20}/><span>TOP</span></a>}
    <dialog ref={dialog} className={s.menuDialog} aria-labelledby="menu-title" onClose={() => setMenuOpen(false)} onCancel={e => {e.preventDefault(); closeMenu();}}><div className={s.menuHeading}><h2 id="menu-title">메뉴</h2><button aria-label="메뉴 닫기" onClick={closeMenu}><X size={25}/></button></div><nav aria-label="모바일 메뉴">{sections.map(item => <a key={item.id} href={`#${item.id}`} onClick={event => {event.preventDefault();navigate(item.id);}} aria-current={active===item.id?"location":undefined}>{item.label}<ArrowUpRight size={20}/></a>)}<a href={programLink.href}>{programLink.label}<ArrowUpRight size={20}/></a></nav></dialog>
  </div>;
}
