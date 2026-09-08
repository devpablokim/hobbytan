"use client";

import { useState } from 'react';
import s from './DetailedApplications.module.css';

const applications = [
  {
    field: '물류', label: '출고·배송 관리', title: '늦어진 배송을 찾느라 여러 화면을 오가지 않도록.',
    description: '주문서와 출고 목록, 택배사 배송 현황을 따로 확인하는 팀에 적합합니다. 주문별 진행 상태를 모으고, 지연되거나 아직 출고하지 않은 건을 구분해 담당자가 처리할 목록을 만듭니다.',
    inputs: ['주문번호·출고 예정일이 있는 출고 요청서', '창고 출고 내역과 택배사 배송 현황'],
    tools: '주문 관리 시스템, 창고 관리 시스템(WMS), 택배사 조회 자료',
    steps: ['출고 요청과 배송 현황 취합', '주문번호·송장번호 연결', '지연·미출고 건 분류', '담당자 확인 후 관리 목록 작성'],
    reviews: ['주소 오류, 분할 배송처럼 별도 처리가 필요한 주문', '실제 지연 사유와 우선 출고·고객 안내 여부'],
    outputs: ['주문별 출고·배송 상태 목록', '지연·미출고 검토 목록과 처리 메모'],
    conditions: ['주문번호와 송장번호를 연결할 수 있는지 확인합니다.', '배송 현황을 가져오는 방식과 갱신 간격을 정합니다.'],
  },
  {
    field: '구매', label: '견적 비교·발주', title: '견적서를 같은 기준으로 놓고 비교합니다.',
    description: '거래처마다 다른 양식의 견적서를 받아 엑셀에 다시 입력하는 업무입니다. 품목과 조건을 정리하고, 담당자가 거래처·수량을 승인하면 발주서 초안을 작성합니다.',
    inputs: ['품목·규격·수량이 있는 구매 요청서', '거래처 견적서와 기존 구매 조건'],
    tools: '구매 요청 시트, 견적 메일, ERP의 품목·거래처 정보',
    steps: ['요청서와 견적서 항목 추출', '단가·납기·최소 주문량 비교', '거래처와 발주 수량 승인', '승인 조건으로 발주서 초안 작성'],
    reviews: ['부가세·배송비 포함 여부와 품목 규격 차이', '최종 거래처, 발주 금액과 결제 조건'],
    outputs: ['동일 기준으로 정리한 견적 비교표', '담당자 승인 내용을 반영한 발주서 초안'],
    conditions: ['품목 명칭과 규격을 통일할 기준이 필요합니다.', '구매 승인 권한과 ERP 반영 범위를 먼저 정합니다.'],
  },
  {
    field: '재고', label: '부족 재고·보충', title: '부족한 품목과 보충할 수량을 함께 확인합니다.',
    description: '현재 재고를 확인하고 발주 시점을 판단하는 업무에 적용할 수 있습니다. 입출고 기록과 안전 재고 기준을 비교하되, 실물 재고와 입고 예정 물량을 확인한 뒤 보충안을 확정합니다.',
    inputs: ['품목별 입출고 기록과 현재 재고', '안전 재고, 입고 예정량, 조달 기간'],
    tools: '재고 시트, ERP·WMS의 품목별 재고 자료',
    steps: ['품목별 재고·입고 예정량 취합', '안전 재고 기준과 비교', '예약·불량 재고와 실물 수량 검토', '확인한 기준으로 보충안 정리'],
    reviews: ['예약·불량·반품 재고를 가용 재고에서 빼야 하는지', '실물 재고 차이와 실제 발주할 수량'],
    outputs: ['부족 품목·입고 예정 물량 목록', '검토 근거를 함께 적은 재고 보충안'],
    conditions: ['재고 단위와 가용 재고의 정의를 맞춥니다.', '입출고 기록의 누락 여부와 안전 재고 기준을 확인합니다.'],
  },
  {
    field: '판매', label: '고객별 후속 영업', title: '지난 상담 이후 챙겨야 할 고객을 정리합니다.',
    description: '주문 내역은 시스템에, 상담 내용은 메모에 나뉘어 있는 경우입니다. 고객별 기록을 연결해 미답변 문의나 재구매 상담이 필요한 건을 모읍니다. 연락 대상과 내용은 영업 담당자가 정합니다.',
    inputs: ['고객별 주문·거래 내역', '상담 메모와 후속 연락 일정'],
    tools: 'CRM, 주문 관리 시스템, 영업 담당자의 업무 시트',
    steps: ['고객별 거래·상담 기록 취합', '중복 고객과 미처리 문의 정리', '연락 대상·제안 내용 검토', '담당자별 후속 영업 목록 작성'],
    reviews: ['동일 고객 여부와 상담 내용의 정확성', '연락 동의·수신 거부 상태와 실제 연락 시점'],
    outputs: ['고객별 최근 거래·상담 요약', '담당자·다음 할 일이 정리된 후속 영업 목록'],
    conditions: ['고객을 구분하는 기준과 열람 권한을 확인합니다.', '메시지 발송은 별도 승인 범위로 두고 수신 동의 기준을 검토합니다.'],
  },
  {
    field: '마케팅', label: '캠페인 콘텐츠', title: '상품 설명을 채널별 문안 초안으로 바꿉니다.',
    description: '하나의 상품을 소개하려고 광고·이메일·SNS 문안을 각각 쓰는 업무입니다. 상품 자료와 캠페인 조건을 바탕으로 초안을 만들고, 담당자가 사실 관계와 표현을 확인해 사용할 문안을 고릅니다.',
    inputs: ['검증된 상품 정보와 브랜드 표현 기준', '캠페인 대상·채널·기간과 기존 콘텐츠'],
    tools: '상품 소개서, 콘텐츠 시트, 기존 캠페인 자료',
    steps: ['상품 정보와 캠페인 조건 확인', '채널별 길이·형식에 맞춰 작성', '효능·가격·표현·권리 검토', '수정한 문안을 게시용 초안으로 정리'],
    reviews: ['근거 없는 효능·최상급 표현과 잘못된 가격·기간', '광고 표시 기준, 이미지·문구 사용 권리와 브랜드 톤'],
    outputs: ['광고·이메일·SNS용 문안 초안', '채널·대상별 콘텐츠 정리표'],
    conditions: ['사용할 수 있는 상품 정보와 표현 범위를 정합니다.', '자동 게시 여부는 별도 합의하며, 초안 생성과 공개 승인을 구분합니다.'],
  },
  {
    field: '분석', label: '매출·비용 보고', title: '집계표를 만드는 일과 숫자를 해석하는 일을 나눕니다.',
    description: '여러 파일에서 매출과 비용을 모아 정기 보고서를 만드는 업무입니다. 기간과 분류 기준을 맞춰 집계하고, 달라진 항목을 표시합니다. 변동 원인에 대한 설명은 담당자가 근거를 확인합니다.',
    inputs: ['기간별 매출·비용 자료와 분류표', '비교 기간과 기존 보고서 양식'],
    tools: 'ERP 내보내기 파일, 매출 시트, 회계·비용 자료',
    steps: ['자료 취합과 기간·분류 기준 통일', '매출·비용 집계 및 증감 계산', '원본 대조와 변동 원인 검토', '집계표와 설명을 보고서로 정리'],
    reviews: ['매출 인식 시점, 취소·환불·세금 처리 기준', '집계값과 원본 일치 여부, 변동 원인을 설명할 근거'],
    outputs: ['비교 기준과 출처가 있는 집계표', '주요 변동 항목을 정리한 분석 보고서 초안'],
    conditions: ['서로 다른 파일의 기간·통화·분류 기준을 먼저 맞춥니다.', '숫자는 계산·대조 절차로 검증하고, AI 설명과 구분해 보여줍니다.'],
  },
  {
    field: '예측', label: '수요·물량 계획', title: '수요를 한 숫자로 단정하지 않고 범위로 봅니다.',
    description: '과거 판매와 시즌 정보를 참고해 구매·생산 물량을 계획하는 업무입니다. 예측에 쓴 가정과 예상 범위를 함께 제시하고, 담당자가 행사 일정과 재고 여건을 고려해 계획을 정합니다.',
    inputs: ['품목별 과거 판매·품절·반품 기록', '시즌·행사 일정과 공급 제약'],
    tools: '판매 이력 자료, 행사 캘린더, 재고·생산 계획 시트',
    steps: ['판매 기록의 누락·품절 영향 확인', '시즌·행사 가정에 따른 수요 추정', '과거 구간 검증과 담당자 가정 검토', '예상 범위·가정·계획안을 함께 정리'],
    reviews: ['예정 행사·신상품처럼 과거 기록에 없는 변화', '오차 범위와 재고·예산 제약을 고려한 최종 물량'],
    outputs: ['예측 가정과 오차 검토가 포함된 수요 예상 범위', '담당자가 조정할 수 있는 구매·생산 계획안'],
    conditions: ['데이터 기간·품질을 보고 예측이 가능한지 먼저 판단합니다.', '과거 데이터로 오차를 검증합니다. 예측 정확도나 실제 수요를 보장하지 않습니다.'],
  },
];

export default function DetailedApplications() {
  const [active, setActive] = useState(0);
  const item = applications[active];
  return <div className={s.explorer}>
    <nav className={s.fields} aria-label="상세 업무 분야 선택">
      <span className={s.navLabel}>분야를 선택하세요</span>
      {applications.map((entry, index) => <button type="button" key={entry.field} id={`application-field-${index}`} data-application-field={entry.field} aria-pressed={active===index} aria-controls="application-detail" onClick={() => setActive(index)}><span className={s.number}>0{index+1}</span><span><strong>{entry.field}</strong><small>{entry.label}</small></span><span className={s.arrow} aria-hidden="true">↗</span></button>)}
      <p>적용 방법을 설명하기 위한 예시입니다.<br />실제 고객 사례나 성과 수치가 아닙니다.</p>
    </nav>
    <article id="application-detail" className={s.detail} aria-labelledby="application-title" data-active-field={item.field}>
      <div key={item.field} className={s.content}>
        <header className={s.intro}><span className={s.eyebrow}>{item.field} / {item.label}</span><h3 id="application-title">{item.title}</h3><p>{item.description}</p></header>
        <div className={s.ioGrid}>
          <section aria-label="필요한 자료와 도구"><h4>필요한 자료와 도구</h4><ul>{item.inputs.map(text=><li key={text}>{text}</li>)}</ul><p className={s.tools}>{item.tools}</p></section>
          <section aria-label="결과물" className={s.outputs}><h4>결과물</h4><ul>{item.outputs.map(text=><li key={text}>{text}</li>)}</ul><span className={s.draft}>업무 환경에 맞춰 양식과 제공 범위를 정합니다.</span></section>
        </div>
        <section className={s.workflow} aria-label="처리 과정"><h4>처리 과정</h4><ol>{item.steps.map((text,index)=><li key={text}><span>0{index+1}</span><p>{text}</p></li>)}</ol></section>
        <div className={s.checks}>
          <section aria-label="담당자가 확인할 내용"><h4>담당자가 확인할 내용</h4><ul>{item.reviews.map(text=><li key={text}>{text}</li>)}</ul></section>
          <section aria-label="도입 전에 확인할 조건"><h4>도입 전에 확인할 조건</h4><ul>{item.conditions.map(text=><li key={text}>{text}</li>)}</ul></section>
        </div>
        <footer className={s.bottom}><p>비슷한 업무가 있다면 현재 작업 순서부터 알려주세요.</p><a href="/contact">{item.field} 업무 상담하기 <span aria-hidden="true">↗</span></a></footer>
      </div>
    </article>
  </div>;
}
