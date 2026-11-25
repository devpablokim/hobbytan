"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, Plus, X } from "lucide-react";
import WorkflowExplorer from "./WorkflowExplorer";
import WorkshopProof from "../newtest/WorkshopProof";
import SiteFooter from "./SiteFooter";
import { companyProfile, programLinkByLocale, sectionsByLocale } from "./siteData";
import { contactHref, homeHref, rememberLanguage, type Locale } from "./i18n";
import s from "./site.module.css";

const copy = {
  ko: {
    skip: "본문으로 건너뛰기", brandLabel: "하비탄 AI 처음으로", mainMenu: "주요 메뉴", cta: "상담 문의", openMenu: "전체 메뉴 열기",
    railLabel: "페이지 내 위치와 이동", railItem: (label: string) => `${label} 섹션으로 이동`,
    heroEyebrow: "AI 연구 · 자체 서비스 · AX 컨설팅", heroTitle: ["AI 서비스를 연구하고,", "직접 만들어 운영합니다."],
    heroDescription: ["게임과 마케팅 AI 같은 자체 서비스를 운영하며 쌓은 기술로,", "기업의 AI 전환(AX)을 설계하고 구현합니다."],
    consult: "AI 전환 상담하기", courses: "강의 종류 보기", profile: "기업소개서",
    inception: "하비탄AI는 NVIDIA Inception program의 공식 멤버 기업입니다.",
    productsEyebrow: "서비스", productsTitle: ["직접 운영하는 서비스부터", "기업의 AI 전환까지."],
    productsIntro: ["자체 서비스를 만들고 운영하며 쌓은 기술과 경험을", "기업 프로젝트와 교육에 그대로 가져옵니다."],
    productGroups: [
      { title: "자체 서비스", items: [
        { tag: "모바일 게임", status: "얼리 액세스", name: "리벌스 파머", sub: "Rebirth Farmer", description: "AI 코딩 에이전트로 개발하고, 게임 아트는 자체 모델로 만든 농장 RPG입니다. 시세가 바뀌는 거래소와 던전, 주간 랭킹을 운영합니다.", link: { href: "/rebirth-farmer", label: "게임 소개 보기" } },
        { tag: "마케팅 AI", status: "운영 중", name: "Promha", sub: "프롬프트 해커", description: "마케터를 위한 AI 서비스입니다. 제품 카드뉴스나 마케팅 소재의 링크를 넣으면 스토리라인과 구성, 생성 프롬프트를 분석해 우리 제품의 상세 정보에 맞춰 다시 설계합니다." },
        { tag: "모바일 게임", status: "개발 중", name: "위치 기반 매칭 게임", sub: "이름 공개 전", description: "배달 플랫폼이 고객과 공급자, 배달원을 연결하는 방식에서 착안한 위치 기반 모바일 게임입니다." },
      ] },
      { title: "기업 서비스와 연구", items: [
        { tag: "기업 서비스", name: "AX 컨설팅·개발", sub: "AI Transformation", description: "업무 진단부터 AI 기능 구현, 운영 이관까지 기업의 AI 전환을 함께합니다. 요약·분석·예측·수집·챗봇·자동 발주 기능이 고객사 업무에서 쓰이고 있습니다.", link: { href: "#services", label: "진행 단계 보기" } },
        { tag: "교육", name: "슈퍼AI워크샵", sub: "Super AI Workshop", description: "조직의 AI 활용을 이끌 사내 슈퍼유저를 키우는 실무 교육입니다. 직접 도구를 만들고 결과를 검증하며 배웁니다.", link: { href: "#education", label: "수료 실적 보기" } },
        { tag: "연구", name: "AI 연구", sub: "Research", description: "자체 GPU 장비로 모델 학습(LoRA)과 이미지 생성 파이프라인, 모델 실험을 진행합니다. 연구 결과는 자체 서비스와 고객 프로젝트에 함께 쓰입니다." },
      ] },
    ],
    servicesEyebrow: "AX 컨설팅", servicesTitle: ["우리 조직에 필요한", "단계부터 시작합니다."],
    servicesIntro: ["AI를 어디에 쓸지 정하는 일부터 내부 운영까지.", "현재의 업무와 역량에 맞춰 필요한 범위를 설계합니다."], more: "상세 보기",
    services: [
    { title: "AI 전환 전략", description: "AI를 적용할 업무와 우선순위를 정합니다.", items: ["현재 업무와 AI 활용 수준 진단", "우선 적용 과제와 기대 효과 정의", "실행 계획과 완료 기준 수립"] },
    { title: "슈퍼AI워크샵", description: "조직의 AI 활용을 이끌 사내 실무자를 키웁니다.", items: ["AI의 원리와 한계 이해", "우리 업무로 도구를 만들고 결과를 검증하는 실습", "동료에게 활용법을 전하는 슈퍼유저 교육"] },
    { title: "업무 도구 구현", description: "실제 문서와 데이터로 필요한 도구를 함께 만듭니다.", items: ["업무에 맞는 대시보드와 자동화 구현", "담당자가 참여하는 결과 검증과 예외 처리", "업무 변경에 맞춰 도구를 수정하는 실습"] },
    { title: "운영 내재화", description: "고객의 팀이 직접 운영하고 개선하도록 이관합니다.", items: ["내부 운영 담당자 교육", "문서·권한·관리 기준 정리", "운영 이관과 개선 역량 점검"] }
    ],
    experienceEyebrow: "업무 적용 예시", experienceTitle: ["반복하던 업무가", "하나의 화면으로."],
    experienceIntro: ["흩어진 자료를 모으고, 확인할 일을 빠르게 찾습니다.", "업무별 화면에서 우리 팀에 필요한 변화를 살펴보세요."],
    educationEyebrow: "슈퍼AI워크샵", educationTitle: ["동료의 AI 활용을 이끄는", "사내 슈퍼유저."],
    educationIntro: ["슈퍼유저는 AI로 자기 업무를 개선하고,", " 동료의 활용까지 이끄는 사내 실무자입니다.", "직접 도구를 만들고 결과를 검증하는 경험을 쌓습니다."],
    tracks: [["팀장과 리더", "AI에 맡길 업무를 고르고 결과를 판단합니다. 팀의 활용 기준을 세우고 동료의 시도를 지원합니다."], ["현업 실무자", "매일 하는 업무에 AI를 적용합니다. 도구를 만들고 고치며, 팀에서 활용할 수 있는 방법을 공유합니다."]],
    approachEyebrow: "진행 방식", approachTitle: ["첫 과제부터", "팀의 직접 운영까지."],
    approachIntro: ["작동하는 도구와 함께,", "그 도구를 운영할 사람과 기준을 남깁니다."],
    process: [
    ["진단", "첫 적용 과제를 정합니다", "현재 업무와 AI 활용 수준을 확인하고, 효과가 크고 실행 가능한 과제를 고릅니다."],
    ["교육", "담당자의 실력을 키웁니다", "실제 업무를 바탕으로 도구를 만들고 검증하며, 팀의 AI 활용을 이끌 담당자를 교육합니다."],
    ["구현", "현장에서 쓰며 다듬습니다", "업무 도구를 함께 구현하고 실제 사용 과정에서 발견한 오류와 예외를 보완합니다."],
    ["이관", "팀이 직접 운영합니다", "담당자와 관리 기준을 확정하고, 고객의 팀이 수정과 개선을 이어가도록 운영을 이관합니다."]
    ],
    ownershipTitle: "운영의 주도권은 고객의 팀에.",
    ownershipText: "업무가 바뀌면 무엇을 고칠지 판단하고 직접 개선할 수 있도록 교육합니다. 역할과 권한, 관리 문서까지 정리해 운영을 이관합니다.",
    questionsEyebrow: "자주 묻는 질문", questionsTitle: ["시작하기 전에", "궁금한 점."],
    questions: [
    ["개발 경험이 없어도 참여할 수 있나요?", "네. 현재의 AI 활용 수준부터 확인합니다. 슈퍼AI워크샵에서 기본을 익힌 뒤 자신의 업무에 적용하며 필요한 도구를 만드는 단계로 나아갑니다."],
    ["회사 데이터를 외부 AI에 보내야 하나요?", "먼저 데이터의 성격과 사내 보안 기준을 확인합니다. 그에 맞춰 사용할 도구, 데이터 저장 위치와 접근 권한을 정합니다."],
    ["내재화는 어느 수준까지 진행하나요?", "장기적으로 개발과 관리의 90% 이상을 내부에서 맡는 것이 목표입니다. 교육과 공동 개발을 거쳐 운영을 단계적으로 이관하며, 실제 범위와 속도는 조직의 인력·업무·보안 조건에 맞춰 정합니다."],
    ["외부 지원 없이 모두 운영해야 하나요?", "필요한 전문 영역에는 외부 도움을 받을 수 있습니다. 내부 담당자가 시스템의 구조와 운영을 이해하고 변경 사항을 판단하도록 교육하며, 외부 파트너와의 역할도 함께 정합니다."]
    ],
    consultationEyebrow: "첫 AI 전환 과제", consultationTitle: ["지금 바꾸고 싶은", "업무를 들려주세요."],
    consultationText: "우리 조직의 상황에 맞는 첫 실행 계획을 제안합니다.",
    toTop: "맨 위로 이동", menu: "메뉴", closeMenu: "메뉴 닫기", mobileMenu: "모바일 메뉴",
    switchLabel: "View in English", switchText: "EN", switchMenuText: "English",
  },
  en: {
    skip: "Skip to content", brandLabel: "HOBBYTAN AI home", mainMenu: "Main menu", cta: "Contact", openMenu: "Open menu",
    railLabel: "Page sections", railItem: (label: string) => `Go to ${label}`,
    heroEyebrow: "AI research · Our own products · AX consulting", heroTitle: ["We research AI services,", "then build and run them ourselves."],
    heroDescription: ["We run our own products, from a mobile game to an AI tool for marketers.", "With the same technology, we design and build AI transformation (AX) for companies."],
    consult: "Book an AI consultation", courses: "View courses", profile: "Company profile (KR)",
    inception: "HOBBYTAN AI is an official member of the NVIDIA Inception program.",
    productsEyebrow: "Services", productsTitle: ["From products we run ourselves", "to AI transformation for businesses."],
    productsIntro: ["What we learn building and running our own products", "goes straight into our client projects and training."],
    productGroups: [
      { title: "Our own products", items: [
        { tag: "Mobile game", status: "Early access", name: "Rebirth Farmer", sub: "Farming RPG", description: "A farming RPG built with AI coding agents, with game art made by our own models. Players trade on a live market, explore dungeons and compete in weekly rankings.", link: { href: "/rebirth-farmer", label: "Game page (Korean)" } },
        { tag: "Marketing AI", status: "Live", name: "Promha", sub: "Prompt Hacker", description: "An AI service for marketers. Paste a link to a product card news or marketing creative, and Promha studies its storyline, structure and generation prompts, then redesigns them around your own product's detail sheet." },
        { tag: "Mobile game", status: "In development", name: "Location-based matching game", sub: "Name coming soon", description: "A location-based mobile game inspired by how delivery platforms match customers, suppliers and couriers." },
      ] },
      { title: "For businesses, and research", items: [
        { tag: "Business service", name: "AX consulting & development", sub: "AI transformation", description: "We work with companies from workflow assessment to building AI functions and handing them over. Summarization, analysis, forecasting, data collection, chatbots and automated ordering are already part of our clients' daily work.", link: { href: "#services", label: "See the steps" } },
        { tag: "Training", name: "Super AI Workshop", sub: "Corporate AI training", description: "Hands-on training that grows the in-house super users who lead your organization's use of AI. Participants learn by building tools and checking the results.", link: { href: "#education", label: "See results" } },
        { tag: "Research", name: "AI research", sub: "Models and pipelines", description: "We train models (LoRA), build image-generation pipelines and run model experiments on our own GPUs. What we learn goes into our products and client projects alike." },
      ] },
    ],
    servicesEyebrow: "AX consulting", servicesTitle: ["Start with the step", "your organization needs."],
    servicesIntro: ["From deciding where to use AI to running it in-house.", "We scope the work around your current operations and skills."], more: "Details",
    services: [
      { title: "AI transformation strategy", description: "Decide which work to apply AI to, and in what order.", items: ["Assess current workflows and AI adoption", "Define priority projects and expected impact", "Set an execution plan and completion criteria"] },
      { title: "Super AI Workshop", description: "Train the in-house practitioners who will lead AI adoption.", items: ["Understand how AI works and where it falls short", "Build tools for your own work and check the results, hands-on", "Super-user training to pass the skills on to colleagues"] },
      { title: "Workflow tools", description: "Build the tools you need with your real documents and data.", items: ["Dashboards and automations fitted to your work", "Result checks and exception handling with the people who own the work", "Practice updating the tools as your work changes"] },
      { title: "In-house ownership", description: "Hand operations over so your team can run and improve them.", items: ["Training for in-house operators", "Documentation, access rights and management standards", "Handover and a check of your team's ability to improve"] },
    ],
    experienceEyebrow: "Use cases", experienceTitle: ["Repetitive work,", "brought into one view."],
    experienceIntro: ["Pull scattered data together and spot what needs attention, fast.", "Explore each area to see what could change for your team."],
    educationEyebrow: "Super AI Workshop", educationTitle: ["In-house super users who lead", "their colleagues' use of AI."],
    educationIntro: ["A super user is an in-house practitioner who improves their own work with AI", " and helps colleagues do the same.", "They gain hands-on experience building tools and checking the results."],
    tracks: [["Team leads and managers", "Choose which work to hand to AI and judge the results. Set your team's standards for using AI and support colleagues as they try it."], ["Practitioners", "Apply AI to everyday work. Build and fix tools, and share methods the whole team can use."]],
    approachEyebrow: "How we work", approachTitle: ["From your first project", "to your team running it."],
    approachIntro: ["Along with tools that work,", "we leave the people and standards to run them."],
    process: [
      ["Assess", "Choose the first project", "We review your current workflows and AI use, and pick a project with high impact that you can actually deliver."],
      ["Train", "Build your people's skills", "Your staff build and test tools on real work, and we train the people who will lead your team's use of AI."],
      ["Build", "Refine it in real use", "We build the tools together and fix the errors and exceptions found in day-to-day use."],
      ["Hand over", "Your team runs it", "We confirm owners and management standards, then hand over operations so your team can keep fixing and improving."],
    ],
    ownershipTitle: "Your team stays in control.",
    ownershipText: "We train your team to decide what to change when the work changes, and to make those improvements themselves. Roles, access rights and management documents are all in place before handover.",
    questionsEyebrow: "FAQ", questionsTitle: ["Questions before", "you start."],
    questions: [
      ["Can people with no development experience take part?", "Yes. We start by checking your current level of AI use. After learning the basics in the Super AI Workshop, participants apply them to their own work and move on to building the tools they need."],
      ["Do we have to send company data to an outside AI?", "First we look at the nature of your data and your internal security rules. Based on that, we decide which tools to use, where data is stored and who can access it."],
      ["How far does in-house ownership go?", "The long-term goal is for your team to handle over 90% of development and management in-house. Through training and joint development we hand over operations step by step, and the actual scope and pace depend on your staff, work and security requirements."],
      ["Do we have to run everything without outside help?", "No. You can still bring in outside help for specialist areas. We train your staff to understand how the system is built and run and to judge changes, and we define roles with outside partners too."],
    ],
    consultationEyebrow: "Your first AI project", consultationTitle: ["Tell us about the work", "you want to change."],
    consultationText: "We'll propose a first action plan that fits your organization.",
    toTop: "Back to top", menu: "Menu", closeMenu: "Close menu", mobileMenu: "Mobile menu",
    switchLabel: "한국어로 보기", switchText: "KO", switchMenuText: "한국어",
  },
};

export default function LightSite({ locale = "ko" }: { locale?: Locale }) {
  const t = copy[locale];
  const sections = sectionsByLocale[locale];
  const programLink = programLinkByLocale[locale];
  const other: Locale = locale === "ko" ? "en" : "ko";
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
  }, [sections]);

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
    <a className={s.skip} href="#main-content">{t.skip}</a>
    <header className={s.header}>
      <div className={s.headerInner}>
        <a className={s.brand} href="#top" aria-label={t.brandLabel}><Image src="/logo-black.svg" alt="HOBBYTAN AI" width={200} height={30} priority /></a>
        <nav className={s.quickNav} aria-label={t.mainMenu}>{sections.slice(1,5).map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>{item.label}</a>)}<a href={programLink.href}>{programLink.label}</a></nav>
        <a className={s.langSwitch} href={homeHref[other]} hrefLang={other} lang={other} aria-label={t.switchLabel} onClick={() => rememberLanguage(other)}>{t.switchText}</a>
        <a className={s.headerCta} href="#consultation">{t.cta} <ArrowUpRight size={18}/></a>
        <button ref={menuTrigger} className={s.menuButton} aria-label={t.openMenu} aria-haspopup="dialog" onClick={() => setMenuOpen(true)}><Menu size={24}/></button>
      </div>
    </header>
    <nav className={s.sectionRail} aria-label={t.railLabel}>{sections.map((item,i) => <a key={item.id} href={`#${item.id}`} aria-label={t.railItem(item.label)} aria-current={active===item.id?"location":undefined}><span>{item.label}</span><i aria-hidden="true"/><b aria-hidden="true">{String(i+1).padStart(2,"0")}</b></a>)}</nav>
    <main id="main-content">
      <section className={s.hero} id="top" aria-labelledby="hero-title">
        <Image className={s.heroImage} src="/light-assets/architecture.png" alt="" fill priority unoptimized sizes="100vw" />
        <div className={s.heroVeil} aria-hidden="true" />
        <div className={s.container}>
        <p className={s.eyebrow}>{t.heroEyebrow}</p>
        <h1 id="hero-title">{t.heroTitle[0]}<br/>{" "}<span>{t.heroTitle[1]}</span></h1>
        <p className={s.heroDescription}>{t.heroDescription[0]}<br/>{" "}{t.heroDescription[1]}</p>
        <div className={s.heroActions}><div className={s.heroButtons}><a className={s.primaryLink} href={contactHref[locale]}>{t.consult} <ArrowUpRight size={20}/></a><a className={s.primaryLink} href="/shop" hrefLang={locale === "en" ? "ko" : undefined}>{t.courses} <ArrowUpRight size={20}/></a></div><a className={s.downloadLink} href={companyProfile.href} download={companyProfile.filename}>{t.profile} <ArrowDown size={18}/></a></div>
        {/* NVIDIA brand rules: color badge unchanged, never wider than our header logo (184px desktop, 144px mobile); "program" lowercase in a sentence. */}
        <div className={s.inception}><Image src="/light-assets/nvidia-inception-program-badge.svg" alt="NVIDIA Inception Program" width={168} height={73} unoptimized /><p>{t.inception}</p></div>
        </div>
      </section>
      <section className={`${s.section} ${s.container}`} id="products" aria-labelledby="products-title">
        <div className={s.sectionHead}><p className={s.eyebrow}>{t.productsEyebrow}</p><h2 id="products-title">{t.productsTitle[0]}<br/>{" "}{t.productsTitle[1]}</h2><p className={s.sectionIntro}>{t.productsIntro[0]}<br/>{" "}{t.productsIntro[1]}</p></div>
        {t.productGroups.map(group => <div key={group.title} className={s.offerGroup}><h3>{group.title}</h3><div className={s.offerGrid}>{group.items.map(item => <article key={item.name} className={s.offer}>
          <div className={s.offerMeta}><span>{item.tag}</span>{"status" in item && <span className={s.offerStatus}>{item.status}</span>}</div>
          <h4>{item.name}<small>{item.sub}</small></h4>
          <p>{item.description}</p>
          {"link" in item && item.link && <a className={s.offerLink} href={item.link.href} hrefLang={locale === "en" && item.link.href.startsWith("/") ? "ko" : undefined}>{item.link.label} <ArrowUpRight size={17}/></a>}
        </article>)}</div></div>)}
      </section>
      <section className={`${s.section} ${s.container}`} id="services" aria-labelledby="services-title">
        <span id="featured" className={s.anchor}/>
        <div className={s.sectionHead}><p className={s.eyebrow}>{t.servicesEyebrow}</p><h2 id="services-title">{t.servicesTitle[0]}<br/>{" "}{t.servicesTitle[1]}</h2><p className={s.sectionIntro}>{t.servicesIntro[0]}<br/>{" "}{t.servicesIntro[1]}</p></div>
        <div className={s.serviceList}>{t.services.map((item,i) => <details key={item.title} className={s.service}><summary><span className={s.serviceNumber}>0{i+1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><span className={s.serviceMore}>{t.more}</span><Plus size={23}/></summary><ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul></details>)}</div>
      </section>
      <section className={`${s.section} ${s.experience}`} id="experience" aria-labelledby="experience-title"><div className={s.container}>
        <div className={s.sectionHead}><p className={s.eyebrow}>{t.experienceEyebrow}</p><h2 id="experience-title">{t.experienceTitle[0]}<br/>{" "}{t.experienceTitle[1]}</h2><p className={s.sectionIntro}>{t.experienceIntro[0]}<br/>{" "}{t.experienceIntro[1]}</p></div>
        <WorkflowExplorer locale={locale}/>
      </div></section>
      <section className={`${s.section} ${s.container}`} id="education" aria-labelledby="education-title">
        <div className={s.sectionHead}><p className={s.eyebrow}>{t.educationEyebrow}</p><h2 id="education-title">{t.educationTitle[0]}<br/>{" "}{t.educationTitle[1]}</h2><p className={s.sectionIntro}><strong>{t.educationIntro[0]}<br className={s.desktopBreak}/>{" "}{t.educationIntro[1]}</strong><br/>{" "}{t.educationIntro[2]}</p></div>
        <div className={s.learningTracks}>{t.tracks.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
        <WorkshopProof variant="editorial" locale={locale}/>
      </section>
      <section className={`${s.section} ${s.approach}`} id="approach" aria-labelledby="approach-title"><div className={s.container}>
        <div className={s.sectionHead}><p className={s.eyebrow}>{t.approachEyebrow}</p><h2 id="approach-title">{t.approachTitle[0]}<br/>{" "}{t.approachTitle[1]}</h2><p className={s.sectionIntro}>{t.approachIntro[0]}<br/>{" "}{t.approachIntro[1]}</p></div>
        <ol className={s.process}>{t.process.map(([label,title,description],i) => <li key={label}><span>0{i+1}<b>{label}</b></span><h3>{title}</h3><p>{description}</p></li>)}</ol>
        <div className={s.ownership} id="ownership"><h3>{t.ownershipTitle}</h3><p>{t.ownershipText}</p></div>
      </div></section>
      <section className={`${s.section} ${s.container} ${s.questions}`} id="questions" aria-labelledby="questions-title">
        <div className={s.sectionHead}><p className={s.eyebrow}>{t.questionsEyebrow}</p><h2 id="questions-title">{t.questionsTitle[0]}<br/>{" "}{t.questionsTitle[1]}</h2></div>
        <div>{t.questions.map(([q,a]) => <details key={q}><summary>{q}<Plus size={22}/></summary><p>{a}</p></details>)}</div>
      </section>
      <section className={s.consultation} id="consultation" aria-labelledby="consultation-title"><div className={s.container}><p className={s.eyebrow}>{t.consultationEyebrow}</p><h2 id="consultation-title">{t.consultationTitle[0]}<br/>{" "}{t.consultationTitle[1]}</h2><p>{t.consultationText}</p><a className={s.primaryLink} href={contactHref[locale]}>{t.consult} <ArrowUpRight size={22}/></a></div></section>
    </main>
    <SiteFooter nvidiaNotice locale={locale}/>
    {showTop && <a className={s.toTop} href="#top" aria-label={t.toTop}><ArrowUp size={20}/><span>TOP</span></a>}
    <dialog ref={dialog} className={s.menuDialog} aria-labelledby="menu-title" onClose={() => setMenuOpen(false)} onCancel={e => {e.preventDefault(); closeMenu();}}><div className={s.menuHeading}><h2 id="menu-title">{t.menu}</h2><button aria-label={t.closeMenu} onClick={closeMenu}><X size={25}/></button></div><nav aria-label={t.mobileMenu}>{sections.map(item => <a key={item.id} href={`#${item.id}`} onClick={event => {event.preventDefault();navigate(item.id);}} aria-current={active===item.id?"location":undefined}>{item.label}<ArrowUpRight size={20}/></a>)}<a href={programLink.href}>{programLink.label}<ArrowUpRight size={20}/></a><a href={homeHref[other]} hrefLang={other} lang={other} onClick={() => rememberLanguage(other)}>{t.switchMenuText}<ArrowUpRight size={20}/></a></nav></dialog>
  </div>;
}
