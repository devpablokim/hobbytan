const icons={
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  box:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7 5.7l9 5.1"/>',
  cart:'<path d="M3 3h2l2.5 12h10.7L21 7H6M8 19h.01M18 19h.01"/><circle cx="8" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
  truck:'<path d="M2 5h12v12H2zM14 9h4l4 5v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M19 21v-2a6 6 0 0 0-3-5"/>',
  bars:'<path d="M4 21V11h4v10M10 21V3h4v18M16 21V7h4v14"/>',
  flag:'<path d="M5 22V3c4-4 9 4 15 0v11c-6 4-11-4-15 0"/>',
  trend:'<path d="m3 17 6-6 4 4 8-10M15 5h6v6"/>',
  arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  sparkle:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
};
const icon=(key)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]||icons.grid}</svg>`;
const definitions = {
  logistics:{name:'물류',english:'LOGISTICS',icon:'truck'}, purchasing:{name:'구매',english:'PURCHASING',icon:'cart'},
  inventory:{name:'재고',english:'INVENTORY',icon:'box'}, sales:{name:'판매',english:'SALES',icon:'bars'},
  marketing:{name:'마케팅',english:'MARKETING',icon:'flag'}, analysis:{name:'분석',english:'ANALYSIS',icon:'bars'}, forecast:{name:'예측',english:'FORECAST',icon:'trend'}
};
const esc=(s)=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const svg=(inner)=>`<svg viewBox="0 0 550 200" role="img" aria-label="${esc(data.chartTitle)}">${inner}</svg>`;
const grid=(labels)=>labels.map((label,i)=>`<line class="chart-grid" x1="37" y1="${15+i*36}" x2="530" y2="${15+i*36}"/><text class="axis-text" x="28" y="${19+i*36}" text-anchor="end">${label}</text>`).join('');
function verticalBars(values,labels,max,secondary,format){return svg(grid([max,max*.75,max*.5,max*.25,0].map(v=>String(v)))+values.map((v,i)=>{const x=56+i*(466/values.length),w=Math.min(52,320/values.length),h=v/max*144,y=159-h,sh=secondary?secondary[i]/max*144:0;return `${secondary?`<rect class="chart-secondary" x="${x}" y="${y-sh}" width="${w}" height="${sh}" rx="2"/>`:''}<rect class="${i===values.length-1?'chart-dark':'chart-primary'}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/><text class="chart-label" x="${x+w/2}" y="${y-sh-6}" text-anchor="middle">${format?format(v):v+(secondary?secondary[i]:0)}</text><text class="axis-text" x="${x+w/2}" y="195" text-anchor="middle">${labels[i]}</text>`}).join(''))}
function chart(){
  if(key==='logistics')return verticalBars([96,108,115,116],['화요일','수요일','목요일','금요일'],160,[2,4,5,12]);
  if(key==='purchasing')return verticalBars([3.1,3.5,3.7,4.2,3.8,4.1],['4월','5월','6월','7월','8월','9월'],6,null,v=>v.toFixed(1));
  if(key==='marketing')return verticalBars([31.5,22,18.5,12],['자연 검색','검색 광고','메타 광고','직접 방문'],40,null,v=>v.toFixed(1));
  if(key==='inventory')return svg([['드립백 패키지',22],['종이컵 12oz',28],['원두 블렌드 A',46],['택배 상자 M',72]].map(([label,value],i)=>{const y=11+i*43;return `<text class="axis-text" x="0" y="${y+12}">${label}</text><rect x="155" y="${y}" width="318" height="17" rx="3" fill="#eef0f3"/><rect x="155" y="${y}" width="${318*value/100}" height="17" rx="3" fill="${value<30?'#b98d68':'#6d7e93'}"/><text class="chart-label" x="535" y="${y+13}" text-anchor="end">${value}%</text>`}).join(''));
  if(key==='sales')return verticalBars([3.1,3.8,4.2,4.6,4.9,5.4],['4월','5월','6월','7월','8월','9월'],6,null,v=>v.toFixed(1));
  if(key==='analysis'){const rev=[11,14,13,16,17,21],cost=[8,9,9,11,12,14];const pts=(arr)=>arr.map((v,i)=>`${42+i*94},${159-v*6}`).join(' ');return svg(grid(['24','18','12','6','0'])+`<path d="M42 159 L${pts(rev)} L512 159Z" fill="#eef1f5"/><polyline points="${pts(cost)}" fill="none" stroke="#bac3cf" stroke-width="2"/><polyline points="${pts(rev)}" fill="none" stroke="#586c87" stroke-width="2.5"/>`+rev.map((v,i)=>`<circle cx="${42+i*94}" cy="${159-v*6}" r="3.5" fill="#586c87" stroke="white" stroke-width="2"/><text class="axis-text" x="${42+i*94}" y="195" text-anchor="middle">${['8/14','8/21','8/28','9/4','9/11','9/18'][i]}</text>`).join(''))}
  if(key==='forecast'){const real='42,96 136,83.4 230,70.8',future='230,70.8 324,47.4 418,40.2 512,29.4';return svg(grid(['16k','12k','8k','4k','0'])+`<rect x="275" y="4" width="255" height="155" fill="#f5f7fa"/><line x1="275" y1="4" x2="275" y2="159" stroke="#cdd4de" stroke-dasharray="3 4"/><path d="M230 70.8L324 36.2L418 28.3L512 16.4L512 42.4L418 52.1L324 58.6Z" fill="#e1e7f0"/><polyline points="${real}" fill="none" stroke="#445a76" stroke-width="2.5"/><polyline points="${future}" fill="none" stroke="#6c82a1" stroke-width="2.5" stroke-dasharray="5 4"/><text class="axis-text" x="286" y="151">예상 구간</text>`+[96,83.4,70.8,47.4,40.2,29.4].map((y,i)=>`<circle cx="${42+i*94}" cy="${y}" r="3.5" fill="${i<3?'#445a76':'#899bb4'}" stroke="white" stroke-width="2"/><text class="axis-text" x="${42+i*94}" y="195" text-anchor="middle">${i+7}월</text>`).join(''))}
}

const requested = new URLSearchParams(location.search).get('domain') || 'logistics';
const key = definitions[requested] ? requested : 'logistics';
const data = {...definitions[key], ...window.DASHBOARD_DETAILS[key]};
document.title = `${data.name} 종합 대시보드 · HOBBYTAN`;
const stockRows = [
  {name:'원두 블렌드 A',location:'A-01',current:180,target:300,safe:150,unit:'kg',state:'보충 검토'},
  {name:'드립백 패키지',location:'B-02',current:440,target:1000,safe:500,unit:'개',state:'안전재고 미달'},
  {name:'종이컵 12oz',location:'C-01',current:1400,target:1200,safe:600,unit:'개',state:'적정'},
];
const fmt=n=>Number(n).toLocaleString('ko-KR');
function navigation(mobile=false){return `<nav class="${mobile?'mobile-navigation':'domain-navigation'}" aria-label="${data.name} 하위 메뉴">${data.sectionGroups.map(group=>`<div class="nav-group"><h2>${esc(group.label)}</h2><div class="nav-items">${group.items.map(item=>`<div class="nav-item ${item.active?'active':''}" ${item.active?'aria-current="page"':''}>${icon(item.icon)}<span>${esc(item.label)}</span>${item.badge?`<small>${esc(item.badge)}</small>`:''}</div>`).join('')}</div></div>`).join('')}</nav>`;}
function warehouse(){const fills=[68,74,81,70,83,55,72,79,69,76,71,66];return `<div class="warehouse"><div class="warehouse-meta"><span>김포센터 · 1층</span><span>구역별 적재율</span></div><div class="rack-grid">${fills.map((v,i)=>{const id=`${['A','B','C'][Math.floor(i/4)]}-${String(i%4+1).padStart(2,'0')}`;const warning=id==='A-01'||id==='B-02';return `<div class="rack ${warning?'rack-warning':''}"><div><strong>${id}</strong><span>${v}%</span></div><div class="rack-fill"><i style="width:${v}%"></i></div><small>${['원재료','패키지','부자재'][Math.floor(i/4)]}</small></div>`}).join('')}</div><div class="warehouse-dock"><span>↑ 입고 검수</span><span>작업 통로</span><span>출고 대기 ↓</span></div><div class="warehouse-legend"><span><i></i>일반 보관</span><span><i class="amber"></i>보충 검토 품목 보관</span></div></div>`;}
function miniRows(items){return `<div class="metric-list">${items.map(([label,value,sub])=>`<div><span>${label}<small>${sub||''}</small></span><strong>${value}</strong></div>`).join('')}</div>`;}
function sidePanel(){
  if(key==='inventory')return `<div class="side-title"><span>STOCK HEALTH</span><h2>적정재고 점검</h2></div><div class="stock-health">${stockRows.map(r=>`<div><header><strong>${r.name}</strong><span>${Math.round(r.current/r.target*100)}%</span></header><div class="stock-track"><i style="width:${Math.min(100,r.current/r.target*100)}%" class="${r.current<r.target?'amber':''}"></i></div><small>현재 ${fmt(r.current)} / 적정 ${fmt(r.target)} ${r.unit}</small></div>`).join('')}</div><div class="side-foot">안전재고 미달 <strong>8개 품목</strong></div>`;
  if(key==='logistics')return `<div class="side-title"><span>TODAY’S FLOW</span><h2>오늘 주문의 처리 단계</h2></div><div class="delivery-flow">${[['피킹 대기',8],['포장 중',4],['배송 중',84],['배송 완료',32]].map(([label,value],i)=>`<div><i>${i+1}</i><span>${label}</span><strong>${value}<small>건</small></strong></div>`).join('')}</div><div class="side-foot">출고 완료 <strong>116 / 128건</strong></div>`;
  if(key==='purchasing')return `<div class="side-title"><span>QUOTE COMPARISON</span><h2>포장 상자 A형 견적 비교</h2></div>${miniRows([['거래처 A','980원','납기 5일 · 배송비 별도'],['거래처 B','1,050원','납기 3일 · 배송비 포함'],['거래처 C','1,120원','납기 4일 · 배송비 포함']])}<div class="side-foot">동일 규격 · 1,000개 기준 <strong>승인 대기</strong></div>`;
  if(key==='sales')return `<div class="side-title"><span>MONTHLY SALES TARGET</span><h2>9월 매출 목표 달성률</h2></div><div class="goal-ring"><div><strong>90<span>%</span></strong><small>목표 6억 원</small></div></div><div class="goal-numbers"><span>현재 매출<strong>5.4억 원</strong></span><span>목표까지<strong>6천만 원</strong></span></div><div class="side-foot">9월 18일 기준 <strong>월 목표 대비 실적</strong></div>`;
  if(key==='marketing')return `<div class="side-title"><span>CONVERSION FUNNEL</span><h2>방문에서 구매까지</h2></div><div class="conversion-funnel">${[['방문',84000,100],['상품 조회',33600,40],['장바구니',6720,8],['구매',2688,3.2]].map(([label,n,w])=>`<div><span>${label}</span><div><i style="width:${w}%"></i></div><strong>${fmt(n)}</strong></div>`).join('')}</div><div class="side-foot">방문 대비 구매 전환율 <strong>3.2%</strong></div>`;
  if(key==='analysis')return `<div class="side-title"><span>PROFIT STRUCTURE</span><h2>매출에서 이익까지</h2></div>${miniRows([['매출','5.4억 원','9월 1–18일'],['매입·운영 비용','−3.7억 원','같은 기간 집계'],['영업이익','1.7억 원','매출 − 비용']])}<div class="side-foot">영업이익률 <strong>31.5%</strong></div>`;
  return `<div class="side-title"><span>DEMAND SCENARIOS</span><h2>10월 수요 시나리오</h2></div>${miniRows([['보수적 수요','11,200개','프로모션 반응이 낮을 때'],['기준 수요','12,400개','현재 계획을 적용했을 때'],['적극적 수요','13,600개','프로모션 반응이 높을 때']])}<div class="side-foot">가용 8,200 + 입고 2,000 <strong>2,200개 추가 검토</strong></div>`;
}
function inventoryTable(){return `<section class="panel table-panel inventory-table"><div class="panel-heading"><div><h2>품목별 위치와 재고 기준</h2><p>현재 수량과 팀이 정한 적정·안전재고를 함께 확인합니다.</p></div><span class="panel-meta">전체 248품목 중 3품목</span></div><div class="table-wrap"><table><thead><tr><th>품목</th><th>보관 위치</th><th>현재 재고</th><th>적정재고</th><th>안전재고</th><th>상태</th></tr></thead><tbody>${stockRows.map(r=>`<tr><td>${r.name}<small>단위: ${r.unit}</small></td><td><span class="location-code">${r.location}</span></td><td>${fmt(r.current)}</td><td>${fmt(r.target)}</td><td>${fmt(r.safe)}</td><td><span class="status ${r.current<r.target?'warning':''}">${r.state}</span></td></tr>`).join('')}</tbody></table></div><div class="mobile-stock-cards">${stockRows.slice(0,2).map(r=>`<article><header><strong>${r.name}</strong><span class="location-code">${r.location}</span><span class="status warning">${r.state}</span></header><dl>${[['현재',r.current],['적정',r.target],['안전',r.safe]].map(([label,n])=>`<div><dt>${label} (${r.unit})</dt><dd>${fmt(n)}</dd></div>`).join('')}</dl></article>`).join('')}</div></section>`;}
function generalTable(){return `<section class="panel table-panel"><div class="panel-heading"><h2>${data.tableTitle}</h2><span class="table-more">최근 현황 ${icon('chevron')}</span></div><div class="table-wrap"><table><thead><tr>${data.headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${data.rows.map(([a,b,c,status,type])=>`<tr><td>${a}</td><td>${b}</td><td>${c}</td><td><span class="status ${type||''}">${status}</span></td></tr>`).join('')}</tbody></table></div></section>`;}
document.getElementById('dashboard').innerHTML=`
<div class="shell" data-domain="${key}">
  <aside class="sidebar"><img class="wordmark" src="/logo-black.svg" alt="HOBBYTAN AI"/><div class="workspace"><span>${data.english} WORKSPACE</span><strong>${data.workspace}</strong></div>${navigation()}<div class="sidebar-bottom"><span class="avatar">HT</span><div><strong>${data.name} 운영팀</strong><span>우리 팀이 직접 관리합니다</span></div></div></aside>
  <main class="main"><header class="topbar"><div class="breadcrumb"><span>${data.workspace}</span><span>/</span><strong>종합 현황</strong></div><div class="mobile-brand"><img src="/logo-black.svg" alt="HOBBYTAN AI"/><span>${data.name} 워크스페이스</span></div><div class="top-actions"><span class="sample-badge">가상 데이터</span>${icon('bell')}<span class="avatar">HT</span></div></header>
    <div class="content"><div class="page-heading"><div><span class="page-eyebrow">${data.english} OVERVIEW</span><h1>${data.title}</h1><p>${data.description}</p></div><div class="date-control">${icon('calendar')}<span>2026. 09. 18 기준</span></div></div>${navigation(true)}
      <section class="kpi-grid">${data.kpis.map(([label,value,unit,detail,ic,attention])=>`<article class="kpi ${attention?'attention':''}"><div class="kpi-top"><span>${label}</span>${icon(ic)}</div><div class="kpi-value ${value.length>8?'compact':''}">${value}<small>${unit}</small></div><div class="kpi-detail">${detail}</div></article>`).join('')}</section>
      <div class="middle-grid"><section class="panel chart-panel ${key==='inventory'?'warehouse-panel':''}"><div class="panel-heading"><div><h2>${data.chartTitle}</h2><p>${data.chartSub}</p></div>${key!=='inventory'?`<div class="chart-legend">${data.chartLegend.map(l=>`<span><i></i>${l}</span>`).join('')}</div>`:''}</div>${key==='inventory'?warehouse():`<div class="chart">${chart()}</div>`}</section><section class="panel domain-detail">${sidePanel()}</section></div>
      ${key==='inventory'?inventoryTable():generalTable()}
      <div class="footer-note"><span>업무 이해를 돕기 위한 목업입니다. 모든 수치는 가상 데이터입니다.</span><b>${data.english} · OVERVIEW</b></div>
    </div>
  </main>
</div>`;
