import type { Metadata } from "next";
import styles from "./newtest.module.css";

export const metadata: Metadata = {
  title: "HOBBYTAN — Work, reimagined. | 디자인 미리보기",
  description: "업무 자동화와 AI 시스템 구축, 그리고 팀의 내재화. 하비탄의 새로운 웹사이트 디자인 시안입니다.",
  robots: { index: false, follow: false },
  openGraph: { title: "HOBBYTAN — Work, reimagined.", description: "반복은 시스템에. 가능성은 사람에게.", url: "https://hobbytan.com/newtest" },
  twitter: { card: "summary", title: "HOBBYTAN — Work, reimagined.", description: "새로운 웹사이트 디자인 미리보기" },
};

export default function NewTestPage() {
  return (
    <main className={styles.page} id="top">
      <a className={styles.skip} href="#content">본문으로 건너뛰기</a>
      <header className={styles.header}>
        <a className={styles.logo} href="#top" aria-label="하비탄 처음으로"><span className={styles.mark} aria-hidden="true">h.</span>hobbytan<span className={styles.ai}>AI</span></a>
        <nav aria-label="주요 메뉴"><a href="#approach">우리의 관점</a><a href="#services">하는 일</a><a href="#workflow">적용 예시</a></nav>
        <a className={styles.navCta} href="/contact">프로젝트 이야기하기 <span aria-hidden="true">↗</span></a>
      </header>
      <section className={styles.hero} id="content">
        <div className={styles.eyebrow}><span className={styles.dot} /> AI IMPLEMENTATION PARTNER <span className={styles.edition}>NEW WEBSITE / DESIGN PREVIEW</span></div>
        <h1>반복은 시스템에.<br />가능성은 <span className={styles.serif}>사람에게.</span></h1>
        <div className={styles.heroBottom}><p>AI를 도입하는 것과, 일이 달라지는 것은 다릅니다.<br />하비탄은 기술을 실제 업무의 변화로 연결합니다.</p><a className={styles.primary} href="/contact">우리 팀의 변화 시작하기 <span aria-hidden="true">↗</span></a></div>
        <div className={styles.workCanvas} aria-label="업무를 연결하는 하비탄의 접근 방식">
          <div className={styles.canvasLabel}>FROM BUSYWORK<br /><span>TO BETTER WORK.</span></div>
          <div className={styles.before}><span className={styles.micro}>BEFORE / 흩어진 일</span><div>주문 메일 확인 <span>↗</span></div><div>시트에 다시 입력 <span>↗</span></div><div>첨부 파일 찾기 <span>↗</span></div></div>
          <div className={styles.connector} aria-hidden="true">⟶</div>
          <div className={styles.engine}><span>h.</span><small>CONNECT THE WORK</small></div>
          <div className={styles.connector} aria-hidden="true">⟶</div>
          <div className={styles.after}><span className={styles.micro}>AFTER / 연결된 흐름</span><strong>수집부터 실행까지,<br />하나의 업무 흐름.</strong><span className={styles.human}>사람은 중요한 판단에 집중 ↗</span></div>
          <div className={styles.canvasFoot}><span>수집 → 정리 → 담당자 검토 → 실행</span><span>업무 흐름 개념도 · 실제 운영 화면 아님</span></div>
        </div>
        <div className={styles.heroFoot}><span>STRATEGY. SYSTEMS. PEOPLE.</span><a href="#approach">더 알아보기 ↓</a></div>
      </section>
      <section className={styles.approach} id="approach"><div className={styles.sectionLabel}>01 / OUR POINT OF VIEW</div><div><h2>도구를 하나 더.<br />아니, <span>일하는 방식을 새로.</span></h2><p>새로운 AI 서비스에 가입해도, 복사하고 붙여 넣는 하루는 그대로일 수 있습니다. 필요한 것은 더 많은 도구가 아니라 우리 업무에 맞는 연결입니다.</p><p>하비탄은 현장의 일을 먼저 들여다봅니다. 자동화할 일과 사람이 판단할 일을 나누고, 팀이 직접 사용할 수 있는 시스템으로 만듭니다.</p></div></section>
      <section className={styles.services} id="services"><div className={styles.sectionLabel}>02 / WHAT WE DO</div><div className={styles.sectionHeading}><h2>설계하고. 만들고.<br /><span className={styles.serif}>우리 팀의 것으로.</span></h2><p>진단에서 끝나지 않도록.<br />구축이 또 다른 시작이 되도록.</p></div>
        <a className={styles.featureService} href="#workflow"><div><span className={styles.micro}>01 — SYSTEMS & AUTOMATION</span><h3>업무 자동화 &<br />맞춤형 AI 시스템</h3><p>반복 업무를 줄이고, 흩어진 도구와 데이터를 연결합니다. 실제 사용 환경에 맞춰 설계하고 검증합니다.</p><span className={styles.tags}>업무 흐름 설계 / 도구 연동 / 맞춤 개발</span></div><div className={styles.serviceGraphic} aria-hidden="true"><span>INPUT</span><i /><strong>MAKE<br />IT WORK<span>↗</span></strong><i /><span>OUTPUT</span></div><span className={styles.serviceArrow} aria-hidden="true">↗</span></a>
        <div className={styles.serviceRow}><span>02 / PEOPLE</span><h3>조직 AI 교육</h3><p>강의실의 이해를 넘어, 실제 업무 과제로 팀의 활용 역량을 만듭니다.</p><a href="/contact" aria-label="조직 AI 교육 상담">↗</a></div>
        <div className={styles.serviceRow}><span>03 / STRATEGY</span><h3>AI 도입 전략</h3><p>어디서 시작할지, 무엇을 먼저 바꿀지. 실행할 수 있는 순서를 정합니다.</p><a href="/contact" aria-label="AI 도입 전략 상담">↗</a></div>
      </section>
      <section className={styles.workflow} id="workflow"><div className={styles.sectionLabel}>03 / IN PRACTICE</div><div className={styles.sectionHeading}><h2>당신의 업무에 대입해 보세요.</h2><p>적용 예시 · 실제 고객 실적이 아닙니다.</p></div><div className={styles.example}><div><span className={styles.micro}>USE CASE / OPERATIONS</span><h3>매번 손으로 만들던<br />발주서가 있다면.</h3><p>주문을 모으고, 양식을 맞추고, 다시 확인하는 일. 단계별로 무엇을 연결할 수 있는지 살펴보세요.</p><span className={styles.exampleNote}>오른쪽 단계를 눌러 살펴보기 ↗<br />이 예시는 데이터를 전송하거나 실제 업무를 실행하지 않습니다.</span></div><div className={styles.steps}>
      {[['주문 수집', '메일·시트 등 주문이 들어오는 경로를 파악하고, 필요한 데이터만 한곳에 모읍니다.'], ['데이터 정리', '품목과 수량을 공통 형식으로 정리합니다. 누락되거나 중복된 항목은 검토 대상으로 분리합니다.'], ['담당자 검토', '가격·수량·예외 항목은 담당자가 확인합니다. 중요한 결정은 사람이 승인하도록 설계합니다.'], ['발주서 생성', '승인한 데이터를 바탕으로 정해진 양식의 발주서를 만듭니다. 전달 방식은 업무 환경에 맞춰 결정합니다.']].map(([title, text], index) => <details key={title} className={styles.step} open={index === 0 ? true : undefined}><summary><span>0{index + 1}</span><strong>{title}</strong><i aria-hidden="true">+</i></summary><p>{text}</p></details>)}
      </div></div></section>
      <section className={styles.process}><div className={styles.sectionLabel}>04 / HOW WE WORK</div><div className={styles.sectionHeading}><h2>작게 시작해도,<br />끝은 실제 변화로.</h2><p>업무의 복잡도와 조직의 상황에 맞춰<br />범위와 진행 방식을 함께 정합니다.</p></div><ol>{[['듣고, 살펴봅니다.', '현재 업무와 병목, 데이터 환경을 확인합니다.'], ['함께 범위를 정합니다.', '우선순위와 결과물, 검증 기준을 합의합니다.'], ['만들고, 검증합니다.', '실제 업무 환경에서 사용하며 개선합니다.'], ['팀 안에 남깁니다.', '사용 방법과 운영 기준을 정리해 전달합니다.']].map(([title, text], i) => <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
      <section className={styles.contact}><div className={styles.sectionLabel}>LET’S MAKE IT WORK.</div><div className={styles.contactHeading}><h2>그 일,<br /><span className={styles.serif}>다르게 해볼까요?</span></h2><a href="/contact" aria-label="프로젝트 상담 시작" className={styles.roundArrow}>↗</a></div><div className={styles.contactBottom}><p>반복되는 업무 하나부터 이야기해 주세요.<br />어디서 시작할지 함께 찾아보겠습니다.</p><a href="/contact">프로젝트 상담하기 ↗</a></div><p className={styles.quoteNote}>진행 방식과 견적은 업무 범위 및 조직의 상황에 맞춰 제안합니다.</p></section>
      <footer className={styles.footer}><a className={styles.logo} href="#top">hobbytan<span className={styles.ai}>AI</span></a><span>기술과 일 사이, 하비탄.</span><a href="/">현재 홈페이지 ↗</a><span className={styles.previewNote}>DESIGN PREVIEW / NOT THE MAIN SITE</span></footer>
    </main>
  );
}
