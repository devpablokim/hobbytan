"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import styles from "./WorkshopProof.module.css";
import type { Locale } from "../light/i18n";

// Company names and metrics supplied by the site owner; not independently audited.
// Logo files supplied by the owner: hobbytan-web-buildnew/public/assets/clients.
const companies = [
  { name: "에코아이티", logo: "01-echoit-black.webp", width: 1066, height: 240 },
  { name: "에스아이시티", logo: "02-sict-black.webp", width: 746, height: 240 },
  { name: "바이츠믹스", logo: "03-bytesmix-black.webp", width: 988, height: 240 },
  { name: "큰삼촌컴퍼니", logo: "04-big3-black.webp", width: 412, height: 100 },
  { name: "엔클루", logo: "05-enclu-black.webp", width: 346, height: 90 },
  { name: "빌사남", logo: "06-bsn-black.webp", width: 664, height: 240 },
  { name: "포피플", logo: "07-forpeople-black.webp", width: 491, height: 240 },
  { name: "하이유플", logo: "08-hiuplus-black.webp", width: 400, height: 118 },
  { name: "하이폰", logo: "09-hiphone-black.webp", width: 741, height: 240 },
  { name: "슈림컴퍼니", logo: "10-shurim-black.webp", width: 1016, height: 240 },
  { name: "매홍엘앤에프", logo: "11-maehong-black.webp", width: 467, height: 240 },
  { name: "비엘테크", logo: "12-bltech-black.webp", width: 362, height: 143 },
  { name: "넥스트바이오", logo: "13-nextbio-black.webp", width: 828, height: 240 },
  { name: "신정개발", logo: "14-shinjeong-black.webp", width: 986, height: 240 },
  { name: "디초이글로벌", logo: "15-dchoi-black.webp", width: 668, height: 240 },
  { name: "휴먼이즈", logo: "16-humanis-black.webp", width: 1299, height: 240 },
  { name: "더플렌티", logo: "17-plenty-black.webp", width: 434, height: 240 },
  { name: "bb5", logo: "18-bb5-black.webp", width: 414, height: 225 },
  { name: "율립", logo: "19-yulip-black.webp", width: 752, height: 240 },
  { name: "이지영디자인", logo: "20-leejiyoung-black.webp", width: 1148, height: 240 },
  { name: "독도문방구", logo: "21-dokdo-black.webp", width: 241, height: 240 },
  { name: "(주)키글", logo: "22-kigle-black.webp", width: 301, height: 142 },
];
type Company = (typeof companies)[number];
const rows = [companies.slice(0, 11), companies.slice(11)];

// Equal visual area: wide wordmarks get shorter, compact marks get taller (desktop px).
const logoHeight = ({ width, height }: Company) => Math.min(62, Math.max(32, Math.round(88 / Math.sqrt(width / height))));

function Logo({ company, className, decorative = false }: { company: Company; className: string; decorative?: boolean }) {
  return (
    <Image
      className={className}
      src={`/light-assets/graduate-logos/${company.logo}`}
      alt={decorative ? "" : company.name}
      width={company.width}
      height={company.height}
      style={{ "--logo-h": logoHeight(company) } as CSSProperties}
      loading="eager"
      fetchPriority="low"
      draggable={false}
      unoptimized
    />
  );
}

// Before hydration the CSS media query already stops the motion; afterwards one static list keeps the order intact.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

type WorkshopProofProps = {
  variant?: 'default' | 'editorial';
  locale?: Locale; // editorial variant only
};

const editorialCopy = {
  ko: {
    label: '슈퍼AI워크샵 수료 실적',
    metrics: [['누적 수료 인원', '80명 이상'], ['수료율', '80%'], ['강의 만족도', '90% 이상']],
    companies: '수료생 소속 기업',
    count: (n: number) => `${n}곳`,
    play: '기업 로고 움직임 재생',
    pause: '기업 로고 움직임 일시정지',
    playShort: '재생',
    pauseShort: '일시정지',
    list: '슈퍼AI워크샵 수료생 소속 기업',
  },
  en: {
    label: 'Super AI Workshop results',
    metrics: [['Graduates to date', '80+'], ['Completion rate', '80%'], ['Course satisfaction', '90%+']],
    companies: 'Where our graduates work',
    count: (n: number) => `${n} companies`,
    play: 'Play logo animation',
    pause: 'Pause logo animation',
    playShort: 'Play',
    pauseShort: 'Pause',
    list: 'Companies of Super AI Workshop graduates',
  },
};

export default function WorkshopProof({ variant = 'default', locale = 'ko' }: WorkshopProofProps) {
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  if (variant === 'editorial') {
    const t = editorialCopy[locale];
    return (
      <section className={styles.editorial} id="workshop-graduates" aria-label={t.label}>
        <dl className={styles.editorialMetrics}>
          {t.metrics.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}
        </dl>
        <div className={styles.clients} data-paused={paused}>
          <div className={styles.clientsHead}>
            <h3 id="graduate-companies-title">{t.companies} <span>{t.count(companies.length)}</span></h3>
            {!reducedMotion && (
              <button
                type="button"
                className={styles.clientsPause}
                aria-controls="graduate-logo-rows"
                aria-pressed={paused}
                aria-label={paused ? t.play : t.pause}
                onClick={() => setPaused(value => !value)}
              >
                {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                <span>{paused ? t.playShort : t.pauseShort}</span>
              </button>
            )}
          </div>
          {reducedMotion ? (
            <ul className={styles.clientGrid} aria-label={t.list}>
              {companies.map(company => (
                <li key={company.name} data-company-name={company.name}>
                  <Logo company={company} className={styles.clientLogo} />
                </li>
              ))}
            </ul>
          ) : (
            <div id="graduate-logo-rows" className={styles.clientRows}>
              {rows.map((row, index) => (
                <div className={styles.clientWindow} key={index}>
                  <div className={`${styles.clientTrack} ${index === 1 ? styles.clientTrackReverse : ''}`}>
                    <ul className={styles.clientList} aria-label={`${t.list} ${index + 1}/${rows.length}`}>
                      {row.map(company => (
                        <li key={company.name} data-company-name={company.name}>
                          <Logo company={company} className={styles.clientLogo} />
                        </li>
                      ))}
                    </ul>
                    <ul className={`${styles.clientList} ${styles.clientClone}`} aria-hidden="true">
                      {row.map(company => (
                        <li key={company.name}><Logo company={company} className={styles.clientLogo} decorative /></li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

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
        <button type="button" className={styles.pause} aria-controls="graduate-company-lists" aria-pressed={paused} aria-label={paused ? '기업 로고 애니메이션 재생' : '기업 로고 애니메이션 일시정지'} onClick={() => setPaused(value => !value)}>
          <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>{paused ? '재생' : '일시정지'}
        </button>
      </div>
      <div id="graduate-company-lists" className={styles.marquees}>
        {rows.map((row, index) => (
          <div className={styles.window} key={index}>
            <div className={`${styles.track} ${index === 1 ? styles.reverse : ''}`}>
              <ul className={styles.companyList} aria-label={`슈퍼AI워크샵 수료 기업 ${index + 1}`}>
                {row.map(company => <li key={company.name} data-company-name={company.name}><Logo company={company} className={styles.marqueeLogo} /></li>)}
              </ul>
              <ul className={`${styles.companyList} ${styles.clone}`} aria-hidden="true">
                {row.map(company => <li key={company.name}><Logo company={company} className={styles.marqueeLogo} decorative /></li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
