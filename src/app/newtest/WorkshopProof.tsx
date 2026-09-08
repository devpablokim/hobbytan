"use client";

import { useState } from "react";
import styles from "./WorkshopProof.module.css";

// Company names and metrics supplied by the site owner; not independently audited.
const companies = [
  '에코아이티', '에스아이시티', '바이츠믹스', '큰삼촌컴퍼니', '엔클루',
  '빌사남', '포피플', '하이유플', '더퓨처랩', '슈림컴퍼니', '매홍엘앤에프',
  '비엘테크', '넥스트바이오', '신정개발', '디초이글로벌', '휴먼이즈',
  '더플렌티', 'bb5', '율립', '이지영디자인', '독도문방구', '(주)키글',
];
const rows = [companies.slice(0, 11), companies.slice(11)];

export default function WorkshopProof() {
  const [paused, setPaused] = useState(false);
  return (
    <section className={styles.proof} id="workshop-graduates" aria-labelledby="workshop-heading" data-paused={paused}>
      <div className={styles.heading}>
        <div>
          <span className={styles.label}>하비탄AI 슈퍼AI워크샵</span>
          <h2 id="workshop-heading">이 기업의 구성원들이<br />슈퍼AI워크샵을 수료했습니다.</h2>
        </div>
        <dl className={styles.metrics}>
          <div><dt>누적 수료 인원</dt><dd>80명 이상</dd></div>
          <div><dt>수료율</dt><dd>80%</dd></div>
          <div><dt>강의 만족도</dt><dd>90% 이상</dd></div>
        </dl>
      </div>
      <div className={styles.controls}>
        <span>수료 기업</span>
        <button type="button" className={styles.pause} aria-controls="graduate-company-lists" aria-pressed={paused} aria-label={paused ? '기업명 애니메이션 재생' : '기업명 애니메이션 일시정지'} onClick={() => setPaused(value => !value)}>
          <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>{paused ? '재생' : '일시정지'}
        </button>
      </div>
      <div id="graduate-company-lists" className={styles.marquees}>
        {rows.map((row, index) => (
          <div className={styles.window} key={index}>
            <div className={`${styles.track} ${index === 1 ? styles.reverse : ''}`}>
              <ul className={styles.companyList} aria-label={`슈퍼AI워크샵 수료 기업 ${index + 1}`}>
                {row.map(name => <li key={name} data-company-name={name}><span>{name}</span></li>)}
              </ul>
              <ul className={`${styles.companyList} ${styles.clone}`} aria-hidden="true">
                {row.map(name => <li key={name}><span>{name}</span></li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
