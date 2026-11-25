"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Check, FileInput, Sparkles, UserRound, FileCheck2, Maximize2, X, ChevronDown } from "lucide-react";
import s from "./light.module.css";
import w from "./WorkflowExplorer.module.css";

const examples = [
  {field:"물류",slug:"logistics",title:"오늘 챙길 배송을 한눈에 확인합니다.",intro:"여러 화면을 오가며 찾던 배송 현황을 한곳에 모읍니다.",input:"주문서 · 출고 내역",ai:"지연·미출고 건 분류",human:"지연 사유와 처리 순서 결정",output:"오늘 처리할 배송 목록",learn:"팀이 분류 기준을 수정하고 예외 상황을 관리합니다."},
  {field:"구매",slug:"purchasing",title:"가격과 납기를 같은 기준으로 비교합니다.",intro:"제각각인 견적서에서 가격과 조건을 나란히 비교합니다.",input:"구매 요청 · 거래처 견적",ai:"단가·납기·조건 비교",human:"거래처와 발주 수량 승인",output:"견적 비교표 · 발주서 초안",learn:"팀이 비교 기준을 정하고 발주 승인 절차를 운영합니다."},
  {field:"재고",slug:"inventory",title:"어디에 얼마나 있는지, 재고 기준과 함께 봅니다.",intro:"창고의 보관 위치와 현재·적정·안전재고를 한 화면에서 확인합니다.",input:"재고 현황 · 입출고 기록",ai:"부족 품목·보충량 정리",human:"실물·예약 재고와 수량 확인",output:"재고 보충 제안 목록",learn:"팀이 안전 재고 기준과 가용 재고 계산을 관리합니다."},
  {field:"판매",slug:"sales",title:"매출의 흐름과 채널별 실적을 함께 확인합니다.",intro:"주문과 결제 내역을 모아 매출 추이, 상품별 실적과 목표 달성률을 살펴봅니다.",input:"채널별 주문 · 결제 내역",ai:"매출·환불·판매 실적 집계",human:"집계 기준과 거래 내역 확인",output:"매출·판매 현황 대시보드",learn:"팀이 매출 집계 기준과 채널별 운영 목표를 관리합니다."},
  {field:"마케팅",slug:"marketing",title:"고객 유입부터 구매까지, 채널 성과를 살펴봅니다.",intro:"회원·상품·리뷰와 유입·광고 데이터를 연결해 캠페인 성과를 확인합니다.",input:"회원·상품·광고 데이터",ai:"유입·전환·캠페인 성과 정리",human:"성과 원인과 운영 방향 검토",output:"마케팅 종합 대시보드",learn:"팀이 성과 지표와 광고 운영 기준을 직접 관리합니다."},
  {field:"분석",slug:"analysis",title:"숫자가 달라진 이유를 살펴봅니다.",intro:"매출과 비용을 같은 기준으로 모아 달라진 항목을 찾습니다.",input:"매출·비용 자료 · 집계 기준",ai:"증감 항목·보고서 초안 정리",human:"수치와 변동 원인 확인",output:"검토한 분석 보고서 초안",learn:"팀이 집계 기준을 이해하고 결과의 정확성을 검증합니다."},
  {field:"예측",slug:"forecast",title:"수요의 변화를 보고 다음 달을 준비합니다.",intro:"판매 이력과 행사 일정을 바탕으로 예상 범위를 살펴봅니다.",input:"판매 이력 · 시즌·행사 정보",ai:"예상 수요의 범위 추정",human:"가정·재고·변동 요인 검토",output:"가정이 명시된 수요 계획안",learn:"팀이 예측 가정을 바꾸고 실제 결과와 비교합니다."},
];
const stageLabels=["자료 입력","AI 정리","사람의 판단","결과 활용"];
const Icons=[FileInput,Sparkles,UserRound,FileCheck2];

export default function WorkflowExplorer(){
  const [selected,setSelected]=useState(0);
  const [step,setStep]=useState(-1);
  const [previewOpen,setPreviewOpen]=useState(false);
  const [desktopView,setDesktopView]=useState(true);
  const previewDialog=useRef<HTMLDialogElement>(null);
  const tabList=useRef<HTMLDivElement>(null);
  const panel=useRef<HTMLDivElement>(null);
  const tabRefs=useRef<(HTMLButtonElement|null)[]>([]);
  const example=examples[selected];
  useEffect(()=>{if(step!==0&&step!==1&&step!==3)return;const timer=setTimeout(()=>setStep(v=>v+1),900);return()=>clearTimeout(timer);},[step]);
  useEffect(()=>{
    if(!previewOpen)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    previewDialog.current?.showModal();
    return()=>{document.body.style.overflow=previous;};
  },[previewOpen]);
  function showPreview(){setDesktopView(!window.matchMedia("(max-width:600px)").matches);setPreviewOpen(true);}
  function closePreview(){previewDialog.current?.close();setPreviewOpen(false);}
  function select(i:number){
    setSelected(i);
    setStep(-1);
    if(!window.matchMedia("(max-width:800px)").matches)return;
    requestAnimationFrame(()=>{
      const tabs=tabList.current;
      const active=tabRefs.current[i];
      const content=panel.current;
      if(!tabs||!active||!content)return;
      const behavior=window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth";
      const bounds=tabs.getBoundingClientRect();
      const button=active.getBoundingClientRect();
      const left=button.left-bounds.left+tabs.scrollLeft;
      if(button.left<bounds.left+8)tabs.scrollTo({left:Math.max(0,left-8),behavior});
      else if(button.right>bounds.right-8)tabs.scrollTo({left:left+button.width-tabs.clientWidth+8,behavior});
      const headerHeight=parseFloat(getComputedStyle(tabs).top)||72;
      window.scrollTo({top:Math.max(0,content.getBoundingClientRect().top+window.scrollY-headerHeight-tabs.offsetHeight-12),behavior});
    });
  }
  function onKey(e:KeyboardEvent<HTMLButtonElement>,i:number){let next=i;if(e.key==='ArrowRight')next=(i+1)%7;else if(e.key==='ArrowLeft')next=(i+6)%7;else if(e.key==='Home')next=0;else if(e.key==='End')next=6;else return;e.preventDefault();select(next);tabRefs.current[next]?.focus({preventScroll:true});}
  const values=[example.input,example.ai,example.human,example.output];
  return <div className={`${s.workflow} ${w.workflow}`} data-testid="workflow-demo" data-step={step} data-example={example.field}>
    <div ref={tabList} role="tablist" aria-label="업무 분야 선택" className={`${s.workflowTabs} ${w.tabs}`}>{examples.map((ex,i)=><button key={ex.field} role="tab" ref={el=>{tabRefs.current[i]=el;}} id={`work-tab-${i}`} aria-selected={selected===i} aria-controls="work-panel" tabIndex={selected===i?0:-1} onKeyDown={e=>onKey(e,i)} onClick={()=>select(i)}>{ex.field}</button>)}</div>
    <div ref={panel} id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${selected}`} tabIndex={0} className={`${s.workflowPanel} ${w.panel}`}>
      <div className={`${s.workflowIntro} ${w.intro}`}><div><h3>{example.title}</h3><p>{example.intro}</p></div></div>
      <figure className={s.dashboardPreview} key={example.slug}>
        <div className={`${s.previewBar} ${w.previewBar}`}><span>{example.field} 업무 화면</span><button onClick={showPreview} aria-label={`${example.field} 대시보드 화면 확대`} aria-haspopup="dialog"><Maximize2 size={18}/>화면 확대</button></div>
        <button className={s.previewImageButton} onClick={showPreview} aria-label={`${example.field} 대시보드 화면 확대`} aria-haspopup="dialog">
          <picture><source media="(max-width:600px)" srcSet={`/light-assets/dashboards-v2/${example.slug}-mobile.jpg`} />
            {/* Browser-rendered captures keep illustrative data separate from the real service. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.dashboardCapture} src={`/light-assets/dashboards-v2/${example.slug}-desktop.jpg`} alt={`${example.field} 업무의 전용 하위 메뉴와 핵심 지표를 보여주는 독립 대시보드 예시`} width={1280} height={900} loading="lazy" decoding="async" />
          </picture>
        </button>
      </figure>
      <details className={`${s.workflowTour} ${w.tour}`} key={`flow-${example.slug}`}><summary><span>AI와 담당자는 어떻게 함께 일할까요?</span><ChevronDown size={19}/></summary>
      <ol className={`${s.workflowSteps} ${w.steps}`}>{values.map((value,i)=>{const Icon=Icons[i];return <li key={i} data-active={step===i} data-done={step>i} className={i===2?s.humanStep:''}><div className={`${s.stepTop} ${w.stepTop}`}>{step>i?<Check size={23}/>:<Icon size={23} strokeWidth={1.4}/>}<span className={w.stageLabel}>{stageLabels[i]}</span></div><strong>{value}</strong><span className={`${s.stepState} ${w.stepState}`}>{step>i?'확인 완료':step===i?(i===2?'담당자 확인 대기':'처리 중'):(i===2?'팀의 기준으로 결정':'')}</span>{i<3&&<ArrowRight className={s.stepArrow} size={21} aria-hidden="true"/>}</li>;})}</ol>
      <div className={`${s.workflowControl} ${w.control}`}><p role="status" aria-live="polite">{step<0?'예시 실행을 눌러 업무 흐름을 확인해보세요.':step===2?'AI가 정리한 내용을 사람이 확인해야 다음 단계로 넘어갑니다.':step===4?'흐름 확인 완료. 판단 기준과 운영은 우리 팀이 관리합니다.':`${stageLabels[Math.min(step,3)]} 과정을 보여드리고 있습니다.`}</p><button disabled={step===0||step===1||step===3} onClick={()=>setStep(step===2?3:0)}>{step<0?'예시 실행':step===2?'확인하고 계속':step===4?'다시 실행':'처리 중'}<ArrowRight size={17}/></button></div>
      </details>
      <div className={`${s.ownership} ${w.ownership}`}><span>우리 팀에 남는 역량</span><p>{example.learn}</p></div>
    </div><p className={`${s.workflowNote} ${w.note}`}>가상 데이터로 구성한 업무 예시이며, 실제 발주나 발송으로 이어지지 않습니다.</p>
    <dialog ref={previewDialog} className={`${s.previewDialog} ${w.dialog}`} aria-label={`${example.field} 대시보드 확대 보기`} onClose={()=>setPreviewOpen(false)} onCancel={e=>{e.preventDefault();closePreview();}} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();closePreview();}}}>
      <div className={`${s.previewDialogHead} ${w.dialogHead}`}><div><h2>{example.field} 업무 화면</h2></div><div className={`${s.previewViewToggle} ${w.viewToggle}`}><button aria-pressed={desktopView} onClick={()=>setDesktopView(true)}>PC</button><button aria-pressed={!desktopView} onClick={()=>setDesktopView(false)}>모바일</button></div><button className={s.previewClose} onClick={closePreview} aria-label="확대 화면 닫기"><X size={23}/></button></div>
      <div className={`${s.previewViewport} ${w.viewport}`} data-desktop={desktopView} tabIndex={0} role="region" aria-label="대시보드 확대 화면. 방향키로 이동할 수 있습니다.">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" decoding="async" src={`/light-assets/dashboards-v2/${example.slug}-${desktopView?'desktop':'mobile'}.jpg`} alt={`${example.field} 대시보드 전체 화면. 가상 데이터로 구성한 예시입니다.`}/>
      </div><p className={`${s.previewDialogNote} ${w.dialogNote}`}>{desktopView?'좌우로 밀어 전체 화면을 확인하세요.':'아래로 내려 전체 화면을 확인하세요.'}</p>
    </dialog>
  </div>;
}
