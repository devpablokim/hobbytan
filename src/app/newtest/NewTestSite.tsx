"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./newtest.module.css";
import WorkshopProof from "./WorkshopProof";
import WorkflowCarousel from "./WorkflowCarousel";

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    const stop = () => { if (media.matches) animation?.finish(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (!media.matches) animation = node.animate([{ opacity: .25, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.65,.3,1)' });
      observer.disconnect();
    }, { threshold: .08 });
    observer.observe(node);
    media.addEventListener('change', stop);
    return () => { observer.disconnect(); animation?.cancel(); media.removeEventListener('change', stop); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

const applications = [
  { name: '발주·정산', title: '메일과 엑셀에 나뉜 주문을 모읍니다.', text: '같은 주문을 여러 파일에 옮겨 적고 있다면, 취합과 양식 정리부터 자동화할 수 있습니다. 금액과 수량이 다른 건은 따로 표시해 담당자가 확인하게 합니다.', input: '주문 메일 · 엑셀 파일', process: '항목 추출 / 중복 확인 / 양식 변환', output: '검토할 주문 목록 · 발주서 초안', review: '금액과 수량, 예외 주문 확인' },
  { name: '사내 문서 검색', title: '답을 찾을 때, 근거 문서도 같이 봅니다.', text: '매뉴얼과 업무 규정을 검색해 답변 초안을 만드는 도구입니다. 문서 접근 권한과 갱신 주기를 먼저 확인하고, 답변에는 참고한 자료를 함께 보여줍니다.', input: '업무 매뉴얼 · 사내 규정', process: '권한 확인 / 자료 검색 / 답변 작성', output: '답변 초안 · 참고 문서', review: '원문 확인, 근거 없는 답변 구분' },
  { name: '보고서 작성', title: '보고서에 쓸 자료부터 정리합니다.', text: '여러 시트의 데이터를 모으고, 정해진 항목에 맞춰 보고서 초안을 작성합니다. 숫자와 해석은 담당자가 확인하고 수정할 수 있게 구성합니다.', input: '업무 데이터 · 보고서 양식', process: '데이터 취합 / 집계 / 초안 작성', output: '집계표 · 보고서 초안', review: '집계 기준과 수치, 해석 확인' },
];
function Applications() {
  const [active, setActive] = useState(0);
  const selected = applications[active];
  return <div className={s.applications}><div className={s.usecaseButtons} aria-label="업무 예시 선택">{applications.map((item, i) => <button type="button" aria-pressed={active === i} aria-controls="application-detail" onClick={() => setActive(i)} key={item.name}><span>0{i + 1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div><div id="application-detail" className={s.applicationDetail}><div key={active} className={s.applicationCopy}><h3>{selected.title}</h3><p>{selected.text}</p><div className={s.reviewNote}><span>사람이 확인할 일</span><strong>{selected.review}</strong></div></div><div className={s.specification}><div><span>입력</span><p>{selected.input}</p></div><div><span>처리</span><p>{selected.process}</p></div><div><span>결과물</span><p>{selected.output}</p></div></div></div></div>;
}

export default function NewTestSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <main className={s.page} id="top">
    <a className={s.skip} href="#main-content">본문으로 건너뛰기</a>
    <div className={s.darkIntro}>
      <header className={s.header}><a href="#top" className={s.brand} aria-label="하비탄 AI 처음으로"><Image src="/logo-white.svg" width={200} height={30} alt="HOBBYTAN AI" priority /></a><nav className={s.desktopNav} aria-label="주요 메뉴"><a href="#services">서비스</a><a href="#applications">업무 예시</a><a href="#process">진행 방법</a></nav><a className={s.headerCta} href="/contact">도입 상담 <span aria-hidden="true">↗</span></a><button className={s.menuButton} type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '닫기' : '메뉴'}</button></header>
      <nav id="mobile-navigation" aria-label="모바일 메뉴" hidden={!menuOpen} className={s.mobileNav}>{[['#services','서비스'],['#applications','업무 예시'],['#process','진행 방법']].map(([href,label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label} ↗</a>)}</nav>
      <section className={s.hero} id="main-content"><div className={s.heroCopy}><span className={s.label}><i /> AI 구축 · 업무 자동화 · 기업 교육</span><h1>매일 반복하는 업무,<br /><span>AI로 줄여드립니다.</span></h1><p>메일을 옮겨 적고, 자료를 찾고, 보고서를 정리하는 일.<br className={s.desktopBreak} /> 하비탄은 지금 쓰는 도구에 AI를 연결해<br className={s.desktopBreak} /> 팀이 직접 쓰는 업무 시스템을 만듭니다.</p><div className={s.heroActions}><a className={s.primary} href="/contact">우리 업무 상담하기 <span aria-hidden="true">↗</span></a><a className={s.textLink} href="#applications">적용할 수 있는 업무 보기 <span aria-hidden="true">↓</span></a></div><div className={s.heroNote}>업무 범위와 사용 환경을 확인한 뒤 진행 방식과 견적을 안내합니다.</div></div><div className={s.heroVisual}><WorkflowCarousel /></div></section>
      <div className={s.introFoot}><span>HOBBYTAN AI</span><p>자동화할 업무를 고르는 단계부터, 팀이 사용하는 단계까지.</p><span>새 사이트 미리보기</span></div>
    </div>
    <WorkshopProof />
    <section className={s.services} id="services"><Reveal><div className={s.sectionTop}><span className={s.sectionLabel}>01 / 서비스</span><h2>지금 필요한 일부터<br />맡기실 수 있습니다.</h2><p>구축이 필요한 팀도, 교육부터 시작할 팀도 있습니다.<br />현재 업무와 팀의 경험에 맞춰 범위를 정합니다.</p></div></Reveal>
      <Reveal className={s.serviceFeature}><div className={s.serviceFeatureCopy}><span className={s.category}>AI SYSTEMS</span><h3>업무 자동화와<br />사내 AI 도구 구축</h3><p>메일·문서·시트를 연결해 반복 작업을 줄입니다. 사내 자료를 검색하거나 보고서 초안을 작성하는 도구도 만들 수 있습니다.</p><ul><li>주문·발주 데이터 취합과 문서 생성</li><li>사내 자료 검색과 출처가 있는 답변</li><li>검토·승인 단계를 포함한 업무 흐름</li></ul><a href="/contact" className={s.inlineLink}>구축 범위 상담하기 ↗</a></div><div className={s.architecture}><div className={s.archTop}><span>연결 구조 예시</span><span>WORKFLOW / 01</span></div><div className={s.archSources}><span>기존 문서</span><span>업무 도구</span><span>사내 데이터</span></div><div className={s.archLines} aria-hidden="true">↓<span>↓</span>↓</div><div className={s.archCore}><span>AI 처리</span><strong>업무에 맞춘 규칙과 연동</strong><small>접근 권한 · 처리 기록 · 예외 항목</small></div><div className={s.archLines} aria-hidden="true">↓</div><div className={s.archResult}><span>담당자 검토</span><i aria-hidden="true">→</i><strong>업무 시스템에 반영</strong></div><p>데이터 위치와 연동 가능 여부는 진단 과정에서 확인합니다.</p></div></Reveal>
      <Reveal className={s.otherServices}><article><span className={s.category}>TEAM TRAINING</span><h3>실무 중심 AI 교육</h3><p>팀에서 실제로 쓰는 문서와 업무를 과제로 삼습니다. 도구 사용법을 익힌 뒤, 각자 맡은 일에 적용하고 피드백을 받습니다.</p><a className={s.inlineLink} href="/contact">교육 상담하기 ↗</a></article><article><span className={s.category}>AX CONSULTING</span><h3>AI 도입 진단과 계획</h3><p>자동화할 만한 일이 무엇인지 함께 찾습니다. 필요한 데이터, 예상 범위, 구현 난이도를 확인해 먼저 해볼 업무를 정합니다.</p><a className={s.inlineLink} href="/contact">도입 진단 문의하기 ↗</a></article></Reveal>
    </section>
    <section className={s.usecases} id="applications"><Reveal><div className={s.sectionTop}><span className={s.sectionLabel}>02 / 업무 예시</span><h2>우리 팀에도<br />이런 일이 있나요?</h2><p>아래는 적용 방법을 설명하기 위한 예시입니다.<br />실제 고객 사례나 성과 수치가 아닙니다.</p></div><Applications /></Reveal></section>
    <section className={s.process} id="process"><Reveal><div className={s.sectionTop}><span className={s.sectionLabel}>03 / 진행 방법</span><h2>만들기 전에,<br />업무부터 확인합니다.</h2><p>기존 도구를 계속 쓸 수 있는지, 어디까지 자동화할지.<br />시작 전에 확인하고 합의할 내용입니다.</p></div><ol className={s.processList}>{[['업무를 살펴봅니다','담당자에게 작업 순서를 듣고, 사용하는 자료와 도구를 확인합니다.','업무 목록 · 데이터 환경'],['범위와 견적을 정합니다','먼저 만들 기능과 제외할 기능, 완료 기준을 정해 제안합니다.','구축 범위 · 일정 · 견적'],['실제 자료로 테스트합니다','시범 적용 과정에서 잘못 처리되는 항목과 예외 상황을 확인합니다.','테스트 결과 · 수정 항목'],['사용법을 정리해 전달합니다','담당자가 사용할 수 있도록 교육합니다. 운영 지원 범위도 함께 정합니다.','사용 안내 · 운영 기준']].map(([title,text,deliverable],i) => <li key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p><small>{deliverable}</small></li>)}</ol></Reveal></section>
    <section className={s.faq}><Reveal><div><span className={s.sectionLabel}>상담 전에 많이 묻는 내용</span><h2>아직 정해진 게 없어도<br />상담할 수 있습니다.</h2></div><div className={s.questions}>{[['무엇을 준비하면 되나요?','시간이 많이 드는 업무와 현재 사용하는 도구를 알려주세요. 처음부터 기획서를 준비할 필요는 없습니다. 민감한 원본 자료는 상담 전에 보내지 않으셔도 됩니다.'],['회사 데이터를 외부 AI에 보내야 하나요?','데이터 종류와 사내 보안 기준부터 확인합니다. 외부 서비스 이용 여부, 저장 위치와 접근 권한은 구축 범위를 정할 때 함께 검토합니다.'],['비용과 기간은 어떻게 정하나요?','처리할 업무, 연동할 시스템, 데이터 정리 수준에 따라 달라집니다. 상담 후 작업 범위와 일정을 정리해 견적을 안내합니다.']].map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></Reveal></section>
    <section className={s.contact}><Reveal><span className={s.sectionLabel}>CONTACT</span><h2>어떤 업무에<br />시간을 가장 많이 쓰시나요?</h2><div><p>매주 만드는 보고서, 매일 확인하는 주문 목록.<br />줄이고 싶은 일부터 알려주세요.</p><a className={s.primary} href="/contact">도입 상담하기 <span aria-hidden="true">↗</span></a></div></Reveal></section>
    <footer className={s.footer}><a href="#top" aria-label="하비탄 AI 처음으로"><Image src="/logo-white.svg" width={200} height={30} alt="HOBBYTAN AI" /></a><p>AI 구축 · 업무 자동화 · 기업 교육</p><a href="/">현재 홈페이지 ↗</a><small>HOBBYTAN AI · 새 사이트 디자인 미리보기</small></footer>
  </main>;
}
