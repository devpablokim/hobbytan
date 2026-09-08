"use client";

import { useEffect, useRef, useState } from 'react';
import s from './newtest.module.css';
import c from './WorkflowCarousel.module.css';

const examples = [
  { field: '물류', title: '출고·배송 관리', inputs: ['출고 요청', '배송 현황', '납기 정보'], steps: ['현황 수집', '지연 확인', '담당자 검토', '목록 생성'], output: '배송 관리 목록', progress: ['출고 요청과 배송 현황을 모으고 있습니다.', '예정일을 넘긴 배송과 미출고 건을 구분합니다.', '담당자가 지연 사유와 우선 처리 건을 확인합니다.', '확인한 건을 배송 관리 목록에 정리합니다.'] },
  { field: '구매', title: '견적 비교·발주', inputs: ['구매 요청', '견적서', '구매 조건'], steps: ['견적 수집', '조건 비교', '구매 승인', '발주서 생성'], output: '발주서 초안', progress: ['요청 품목과 거래처 견적을 모으고 있습니다.', '금액, 납기, 최소 주문 조건을 비교합니다.', '담당자가 거래처와 수량을 확인하고 승인합니다.', '승인한 조건으로 발주서 초안을 작성합니다.'] },
  { field: '재고', title: '부족 재고·보충 관리', inputs: ['입출고 기록', '현재 재고', '안전 재고'], steps: ['재고 취합', '부족 확인', '수량 검토', '보충안 생성'], output: '재고 보충 제안', progress: ['입출고 기록과 현재 재고를 모으고 있습니다.', '안전 재고 기준보다 부족한 품목을 찾습니다.', '담당자가 실제 재고와 보충 수량을 확인합니다.', '확인한 품목의 보충 제안을 정리합니다.'] },
  { field: '판매', title: '고객별 후속 영업', inputs: ['주문 내역', '거래 기록', '상담 메모'], steps: ['거래 수집', '고객별 정리', '담당자 검토', '목록 생성'], output: '후속 영업 목록', progress: ['주문 내역과 상담 기록을 모으고 있습니다.', '고객별 구매 이력과 남은 문의를 정리합니다.', '담당자가 연락 대상과 제안 내용을 확인합니다.', '확인한 내용을 후속 영업 목록으로 정리합니다.'] },
  { field: '마케팅', title: '캠페인 문안 작성', inputs: ['상품 정보', '기존 콘텐츠', '캠페인 조건'], steps: ['자료 수집', '문안 작성', '표현 검토', '초안 정리'], output: '캠페인 콘텐츠 초안', progress: ['상품 정보와 기존 콘텐츠를 확인합니다.', '채널과 대상에 맞는 문안 초안을 작성합니다.', '담당자가 상품 사실과 표현, 광고 기준을 검토합니다.', '수정한 문안을 채널별 초안으로 정리합니다.'] },
  { field: '분석', title: '매출·비용 분석', inputs: ['매출 자료', '비용 자료', '집계 기준'], steps: ['자료 취합', '변동 분석', '수치 검토', '보고서 작성'], output: '분석 보고서 초안', progress: ['기간별 매출과 비용을 모으고 있습니다.', '집계 기준에 따라 증감 항목을 정리합니다.', '담당자가 집계 수치와 변동 원인 해석을 확인합니다.', '확인한 표와 설명을 보고서 초안으로 정리합니다.'] },
  { field: '예측', title: '수요 예측·계획', inputs: ['과거 판매', '시즌 정보', '예정 행사'], steps: ['기록 취합', '수요 추정', '가정 검토', '계획안 생성'], output: '수요 예상 범위·계획안', progress: ['판매 이력과 시즌 정보를 확인합니다.', '데이터와 가정에 따라 예상 수요의 범위를 추정합니다.', '담당자가 행사 일정, 재고와 예측 가정을 확인합니다.', '예상 범위와 가정을 계획안에 함께 정리합니다.'] },
];

export default function WorkflowCarousel() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const touch = useRef<{x:number; y:number} | null>(null);
  const item = examples[index];
  const running = step === 0 || step === 1 || step === 3;
  const autoRunning = !paused && !hovered && !focused && !reduced && step === -1;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!autoRunning) return;
    const timer = window.setTimeout(() => setIndex(value => (value + 1) % examples.length), 8000);
    return () => window.clearTimeout(timer);
  }, [autoRunning, index]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep(value => value + 1), 900);
    return () => window.clearTimeout(timer);
  }, [step, running, index]);
  function select(next: number) {
    setIndex((next + examples.length) % examples.length);
    setStep(-1);
    setPaused(true);
  }
  return <div className={`${s.demo} ${c.carousel}`} role="region" aria-roledescription="캐러셀" aria-label="분야별 업무 자동화 예시" data-testid="workflow-demo" data-step={step} data-example={item.field} data-auto-running={autoRunning}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className={c.categories} aria-label="예시 분야 선택">{examples.map((example,i) => <button key={example.field} type="button" aria-pressed={i===index} aria-controls="workflow-slide" onClick={() => select(i)}>{example.field}</button>)}</div>
    <div id="workflow-slide" className={c.slide} role="group" aria-roledescription="슬라이드" aria-label={`${index+1} / ${examples.length}: ${item.field}`}
      onTouchStart={event => {if(event.touches.length===1) touch.current={x:event.touches[0].clientX,y:event.touches[0].clientY};}}
      onTouchCancel={() => {touch.current=null;}}
      onTouchEnd={event => {const start=touch.current;touch.current=null;if(!start || !event.changedTouches.length)return; const dx=event.changedTouches[0].clientX-start.x;const dy=event.changedTouches[0].clientY-start.y;if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5)select(index+(dx<0?1:-1));}}>
      <div key={index} className={c.slideContent}>
        <div className={s.demoTop}><span><i /> {item.title}</span><span className={s.demoBadge}>인터랙티브 예시</span></div>
        <div className={s.diagram}>
          <div className={s.sourceRow}>{item.inputs.map((input,i)=><span key={input}><b aria-hidden="true">{['↙','▦','⌑'][i]}</b>{input}</span>)}</div>
          <div className={`${s.collector} ${running?s.transmitting:''}`} aria-hidden="true"><i/><i/><i/></div>
          <div className={s.processor}><span className={s.processorSymbol} aria-hidden="true">⌘</span><div><strong>{item.field} 업무 처리 흐름</strong><span>{item.steps.join(' · ')}</span></div><i className={running?s.runningDot:s.staticDot}/></div>
          <div className={s.pipeline}>{item.steps.map((title,i)=><div key={title} className={`${s.node} ${step===i?s.activeNode:''} ${step>i?s.doneNode:''}`}><span>{step>i?'✓':`0${i+1}`}</span><strong>{title}</strong><small>{step>i?'완료':step===i?(i===2?'확인 필요':'처리 중'):'대기'}</small></div>)}</div>
          <div className={`${s.output} ${step===4?s.readyOutput:''}`}><span aria-hidden="true">▤</span><div><strong>{item.output}</strong><small>{step===4?'검토 완료 · 결과물 예시':'담당자 확인 후 작성'}</small></div><span aria-hidden="true">{step===4?'✓':'↗'}</span></div>
        </div>
      </div>
      <div className={s.demoControls}><p role="status" aria-live="polite">{step<0?'실행을 눌러 처리 과정을 확인하세요.':step===4?'예시가 완료됐습니다. 실제 업무를 실행하거나 파일을 만들지는 않습니다.':item.progress[step]}</p><button type="button" disabled={running} onClick={() => {setPaused(true);setStep(step===2?3:0);}}>{running?'처리 중…':step===2?'확인하고 계속':step===4?'다시 실행':'예시 실행'} <span aria-hidden="true">{running?'·':'→'}</span></button></div>
    </div>
    <div className={c.navigation}><div><button type="button" aria-label="이전 예시" onClick={() => select(index-1)}>←</button><span aria-live={autoRunning?'off':'polite'}>{index+1} / {examples.length}</span><button type="button" aria-label="다음 예시" onClick={() => select(index+1)}>→</button></div><button type="button" className={c.autoToggle} disabled={reduced} aria-label={paused?'자동 전환 재생':'자동 전환 일시정지'} onClick={() => {setPaused(!paused);if(paused)setStep(-1);}}>{reduced?'모션 감소 · 수동 선택':paused?'▷ 자동 전환 재생':'Ⅱ 자동 전환 일시정지'}</button></div>
    <div className={s.demoDisclaimer}>설명용 시뮬레이션입니다. 실제 데이터·외부 서비스와 연결되지 않습니다.</div>
  </div>;
}
