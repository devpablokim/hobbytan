import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
  staticFile,
} from "remotion";

// === DESIGN TOKENS ===
const C = {
  bg: "#0a0a0a",
  accent: "#10b981",      // Emerald — 하비탄AI 메인 컬러
  accentDim: "#10b98133",
  white: "#ffffff",
  gray: "#a3a3a3",
  darkGray: "#1a1a1a",
  card: "#111111",
};

const FONT = "'Pretendard', system-ui, -apple-system, sans-serif";

// === FONT FACE (loaded via staticFile) ===
const FontLoader: React.FC = () => (
  <style>
    {`
      @font-face {
        font-family: 'Pretendard';
        src: url('${staticFile("fonts/Pretendard-Regular.woff2")}') format('woff2');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Pretendard';
        src: url('${staticFile("fonts/Pretendard-Bold.woff2")}') format('woff2');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Pretendard';
        src: url('${staticFile("fonts/Pretendard-ExtraBold.woff2")}') format('woff2');
        font-weight: 800;
        font-style: normal;
      }
    `}
  </style>
);

// === SUBTITLE COMPONENT ===
const Subtitle: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div style={{
      position: "absolute",
      bottom: 60,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      opacity,
      zIndex: 100,
    }}>
      <div style={{
        background: "rgba(0, 0, 0, 0.75)",
        padding: "12px 40px",
        borderRadius: 0,
        maxWidth: "80%",
      }}>
        <p style={{
          color: C.white,
          fontSize: 28,
          fontFamily: FONT,
          fontWeight: 400,
          textAlign: "center",
          lineHeight: 1.5,
          margin: 0,
        }}>
          {text}
        </p>
      </div>
    </div>
  );
};

// === FADE IN HELPER ===
const fadeIn = (frame: number, start: number, dur = 15) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

const slideUp = (frame: number, start: number, dur = 15) =>
  interpolate(frame, [start, start + dur], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

// ============================================================
// SCENE 1: Hook (0~5초 = 150프레임)
// ============================================================
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Opacity = fadeIn(frame, 10);
  const line1Y = slideUp(frame, 10);
  const line2Opacity = fadeIn(frame, 50);
  const numberScale = spring({ frame: frame - 70, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 1200 }}>
        <h1 style={{
          color: C.white,
          fontSize: 64,
          fontWeight: 800,
          fontFamily: FONT,
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          lineHeight: 1.3,
        }}>
          18개월 후,<br />
          <span style={{ color: C.accent }}>따라잡을 수 없습니다</span>
        </h1>
        <p style={{
          color: C.gray,
          fontSize: 32,
          fontFamily: FONT,
          fontWeight: 400,
          marginTop: 30,
          opacity: line2Opacity,
        }}>
          AI를 도입하지 않은 기업의 미래
        </p>
        <div style={{
          marginTop: 40,
          opacity: fadeIn(frame, 70),
          transform: `scale(${Math.min(numberScale, 1)})`,
        }}>
          <span style={{
            color: C.accent,
            fontSize: 100,
            fontWeight: 800,
            fontFamily: FONT,
          }}>
            3.2배
          </span>
          <p style={{ color: C.gray, fontSize: 24, fontFamily: FONT, marginTop: 8 }}>
            AI 도입 기업과 비도입 기업의 성장률 차이
          </p>
        </div>
      </div>
      <Subtitle text="18개월 후, 따라잡을 수 없습니다. AI 도입이 성장의 분수령이 됩니다." delay={10} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 2: 문제 제기 (5~15초 = 300프레임)
// ============================================================
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "₩2.4억", label: "AI 미도입 시 연간 기회비용", delay: 10 },
    { value: "67%", label: "AI 전환 실패율 (자체 도입 시)", delay: 40 },
    { value: "₩3,000만+", label: "평균 컨설팅 비용 (대기업 기준)", delay: 70 },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        color: C.white,
        fontSize: 44,
        fontWeight: 700,
        fontFamily: FONT,
        marginBottom: 60,
        opacity: fadeIn(frame, 0),
        textAlign: "center",
      }}>
        당신의 기업은 <span style={{ color: C.accent }}>준비되어 있습니까?</span>
      </h2>
      <div style={{ display: "flex", gap: 60 }}>
        {stats.map((s, i) => {
          const scale = spring({ frame: frame - s.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{
              textAlign: "center",
              opacity: fadeIn(frame, s.delay),
              transform: `scale(${Math.min(scale, 1)})`,
            }}>
              <div style={{
                color: C.accent,
                fontSize: 72,
                fontWeight: 800,
                fontFamily: FONT,
              }}>
                {s.value}
              </div>
              <p style={{
                color: C.gray,
                fontSize: 20,
                fontFamily: FONT,
                marginTop: 12,
                maxWidth: 280,
              }}>
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
      <Subtitle text="연간 2.4억 원의 기회비용, 67%의 자체 도입 실패율. 전문 파트너가 필요합니다." delay={10} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 3: 브랜드 등장 (15~20초 = 150프레임)
// ============================================================
const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const taglineOpacity = fadeIn(frame, 30);

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${Math.min(logoScale, 1)})` }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🔥</div>
        <h1 style={{
          color: C.white,
          fontSize: 80,
          fontWeight: 800,
          fontFamily: FONT,
          letterSpacing: -2,
        }}>
          HOBBYTAN<span style={{ color: C.accent }}> AI</span>
        </h1>
      </div>
      <p style={{
        color: C.accent,
        fontSize: 32,
        fontFamily: FONT,
        fontWeight: 700,
        marginTop: 24,
        opacity: taglineOpacity,
        textAlign: "center",
      }}>
        가장 뛰어난 AX 혁신 파트너
      </p>
      <p style={{
        color: C.gray,
        fontSize: 22,
        fontFamily: FONT,
        marginTop: 12,
        opacity: taglineOpacity,
        textAlign: "center",
      }}>
        Thinking Assembly Network — AI 집단 지성 의회
      </p>
      <Subtitle text="하비탄AI — 가장 뛰어난 AI 트랜스포메이션(AX) 혁신 파트너" delay={20} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 4: 파워워크샵 5주 타임라인 (20~35초 = 450프레임)
// ============================================================
const WorkshopScene: React.FC = () => {
  const frame = useCurrentFrame();

  const weeks = [
    { week: "1주차", title: "AI 기초 & 전략", desc: "비즈니스 맞춤 AI 전략 수립" },
    { week: "2주차", title: "실전 도구 마스터", desc: "ChatGPT, Claude, Midjourney 등 핵심 도구" },
    { week: "3주차", title: "업무 자동화", desc: "반복 업무 80% 자동화 설계" },
    { week: "4주차", title: "AI 에이전트 구축", desc: "나만의 AI 비서/봇 제작" },
    { week: "5주차", title: "실전 프로젝트", desc: "실제 업무에 AI 적용 + 발표" },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center", padding: 80 }}>
      <h2 style={{
        color: C.white,
        fontSize: 48,
        fontWeight: 700,
        fontFamily: FONT,
        marginBottom: 16,
        opacity: fadeIn(frame, 0),
        textAlign: "center",
      }}>
        <span style={{ color: C.accent }}>파워워크샵</span> 5주 커리큘럼
      </h2>
      <p style={{
        color: C.gray,
        fontSize: 22,
        fontFamily: FONT,
        marginBottom: 50,
        opacity: fadeIn(frame, 10),
        textAlign: "center",
      }}>
        이론이 아닌 실전. 5주 만에 AI 실무 역량을 완성합니다.
      </p>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {weeks.map((w, i) => {
          const delay = i * 20 + 20;
          return (
            <div key={i} style={{
              opacity: fadeIn(frame, delay),
              transform: `translateY(${slideUp(frame, delay)}px)`,
              textAlign: "center",
              flex: 1,
            }}>
              {/* Timeline dot + line */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: 0,
                  background: C.accent,
                  boxShadow: `0 0 12px ${C.accent}`,
                }} />
              </div>
              <div style={{
                background: C.card,
                border: `1px solid ${C.accentDim}`,
                padding: "24px 16px",
                borderRadius: 0,
                minHeight: 160,
              }}>
                <div style={{ color: C.accent, fontSize: 16, fontWeight: 700, fontFamily: FONT }}>{w.week}</div>
                <h3 style={{ color: C.white, fontSize: 22, fontWeight: 700, fontFamily: FONT, margin: "8px 0" }}>{w.title}</h3>
                <p style={{ color: C.gray, fontSize: 16, fontFamily: FONT }}>{w.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Subtitle text="5주 파워워크샵 — 이론이 아닌 실전. AI 실무 역량을 완성합니다." delay={10} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 5: 실적 숫자 (35~45초 = 300프레임)
// ============================================================
const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const metrics = [
    { value: "11", unit: "기업", label: "파트너 기업" },
    { value: "82", unit: "명", label: "수료 인원" },
    { value: "100", unit: "%", label: "수료율" },
    { value: "12", unit: "배", label: "ROI" },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        color: C.white,
        fontSize: 44,
        fontWeight: 700,
        fontFamily: FONT,
        marginBottom: 60,
        opacity: fadeIn(frame, 0),
        textAlign: "center",
      }}>
        숫자가 <span style={{ color: C.accent }}>증명합니다</span>
      </h2>
      <div style={{ display: "flex", gap: 80 }}>
        {metrics.map((m, i) => {
          const delay = i * 15 + 15;
          const scale = spring({ frame: frame - delay, fps, config: { damping: 10 } });
          return (
            <div key={i} style={{
              textAlign: "center",
              opacity: fadeIn(frame, delay),
              transform: `scale(${Math.min(scale, 1)})`,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
                <span style={{
                  color: C.accent,
                  fontSize: 96,
                  fontWeight: 800,
                  fontFamily: FONT,
                }}>
                  {m.value}
                </span>
                <span style={{
                  color: C.accent,
                  fontSize: 36,
                  fontWeight: 700,
                  fontFamily: FONT,
                  marginLeft: 4,
                }}>
                  {m.unit}
                </span>
              </div>
              <p style={{ color: C.gray, fontSize: 22, fontFamily: FONT, marginTop: 8 }}>{m.label}</p>
            </div>
          );
        })}
      </div>
      <Subtitle text="11개 기업, 82명 수료, 수료율 100%, 투자 대비 12배 ROI" delay={15} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 6: 프리미엄 혜택 (45~55초 = 300프레임)
// ============================================================
const PremiumScene: React.FC = () => {
  const frame = useCurrentFrame();

  const benefits = [
    { icon: "🏨", title: "1박 2일 집중 워크샵", desc: "오프라인 몰입 교육" },
    { icon: "🎤", title: "AI 전문가 특강", desc: "현업 전문가 초청 세미나" },
    { icon: "🧑‍💼", title: "1:1 전문 코칭", desc: "개인 맞춤 AI 전환 컨설팅" },
    { icon: "📋", title: "90일 사후 관리", desc: "수료 후 3개월 밀착 지원" },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        color: C.white,
        fontSize: 44,
        fontWeight: 700,
        fontFamily: FONT,
        marginBottom: 60,
        opacity: fadeIn(frame, 0),
        textAlign: "center",
      }}>
        <span style={{ color: C.accent }}>프리미엄</span> 혜택
      </h2>
      <div style={{ display: "flex", gap: 36 }}>
        {benefits.map((b, i) => {
          const delay = i * 15 + 15;
          return (
            <div key={i} style={{
              background: C.card,
              border: `1px solid ${C.accentDim}`,
              borderRadius: 0,
              padding: "36px 28px",
              width: 260,
              textAlign: "center",
              opacity: fadeIn(frame, delay),
              transform: `translateY(${slideUp(frame, delay)}px)`,
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ color: C.white, fontSize: 24, fontWeight: 700, fontFamily: FONT, marginBottom: 8 }}>{b.title}</h3>
              <p style={{ color: C.gray, fontSize: 17, fontFamily: FONT }}>{b.desc}</p>
            </div>
          );
        })}
      </div>
      <Subtitle text="1박2일 워크샵, 전문가 특강, 1:1 코칭, 그리고 90일 사후 관리까지" delay={15} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 7: 서비스 라인업 (55~63초 = 240프레임)
// ============================================================
const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();

  const services = [
    "AI 파워워크샵 (기업/개인)",
    "AI 시스템 설정 · 대행",
    "AI 비즈니스 웹사이트 구축",
    "AI 역량 강화 교육",
    "맞춤형 컨설팅",
    "하비탄 AI 클럽",
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        color: C.white,
        fontSize: 44,
        fontWeight: 700,
        fontFamily: FONT,
        marginBottom: 50,
        opacity: fadeIn(frame, 0),
        textAlign: "center",
      }}>
        서비스 <span style={{ color: C.accent }}>라인업</span>
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        maxWidth: 900,
      }}>
        {services.map((s, i) => {
          const delay = i * 10 + 15;
          return (
            <div key={i} style={{
              background: C.card,
              border: `1px solid ${C.accentDim}`,
              borderRadius: 0,
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: fadeIn(frame, delay),
              transform: `translateX(${interpolate(frame, [delay, delay + 15], [-30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}px)`,
            }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: 0,
                background: C.accent,
                flexShrink: 0,
              }} />
              <span style={{ color: C.white, fontSize: 24, fontFamily: FONT, fontWeight: 700 }}>{s}</span>
            </div>
          );
        })}
      </div>
      <Subtitle text="워크샵부터 AI 콜센터, 챗봇, 맞춤형 에이전트 개발까지 — 풀스택 AI 서비스" delay={10} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 8: 투자 가치 비교 (63~73초 = 300프레임)
// ============================================================
const ValueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftOpacity = fadeIn(frame, 20);
  const rightScale = spring({ frame: frame - 40, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        color: C.white,
        fontSize: 44,
        fontWeight: 700,
        fontFamily: FONT,
        marginBottom: 60,
        opacity: fadeIn(frame, 0),
        textAlign: "center",
      }}>
        투자 <span style={{ color: C.accent }}>가치</span>
      </h2>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        {/* 경쟁사 */}
        <div style={{
          background: C.darkGray,
          border: "1px solid #333",
          borderRadius: 0,
          padding: "40px 48px",
          textAlign: "center",
          opacity: leftOpacity,
        }}>
          <p style={{ color: C.gray, fontSize: 20, fontFamily: FONT, marginBottom: 12 }}>대기업 컨설팅</p>
          <div style={{ color: "#666", fontSize: 64, fontWeight: 800, fontFamily: FONT, textDecoration: "line-through" }}>₩3,000만+</div>
          <p style={{ color: "#555", fontSize: 16, fontFamily: FONT, marginTop: 8 }}>이론 중심 / 장기 프로젝트</p>
        </div>

        <div style={{ color: C.accent, fontSize: 48, fontWeight: 800, fontFamily: FONT }}>VS</div>

        {/* 하비탄AI */}
        <div style={{
          background: `${C.accent}11`,
          border: `2px solid ${C.accent}`,
          borderRadius: 0,
          padding: "40px 48px",
          textAlign: "center",
          transform: `scale(${Math.min(rightScale, 1)})`,
          boxShadow: `0 0 40px ${C.accent}22`,
        }}>
          <p style={{ color: C.accent, fontSize: 20, fontFamily: FONT, fontWeight: 700, marginBottom: 12 }}>하비탄AI 파워워크샵</p>
          <div style={{ color: C.white, fontSize: 64, fontWeight: 800, fontFamily: FONT }}>₩800만</div>
          <p style={{ color: C.accent, fontSize: 16, fontFamily: FONT, marginTop: 8 }}>실전 중심 / 5주 완성 / 90일 관리</p>
        </div>
      </div>
      <Subtitle text="일반 컨설팅 3,000만 원 이상 vs 하비탄AI 800만 원 — 4배 더 효율적인 투자" delay={20} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 9: CTA (73~83초 = 300프레임)
// ============================================================
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonScale = spring({ frame: frame - 40, fps, config: { damping: 8, stiffness: 100 } });
  const pulse = Math.sin(frame * 0.08) * 0.03 + 1;

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{
          color: C.white,
          fontSize: 52,
          fontWeight: 800,
          fontFamily: FONT,
          opacity: fadeIn(frame, 0),
          lineHeight: 1.4,
        }}>
          지금 시작하세요
        </h2>
        <p style={{
          color: C.gray,
          fontSize: 28,
          fontFamily: FONT,
          marginTop: 20,
          opacity: fadeIn(frame, 15),
        }}>
          AI 전환, 늦으면 뒤처집니다
        </p>
        {/* CTA Button */}
        <div style={{
          marginTop: 50,
          transform: `scale(${Math.min(buttonScale, 1) * pulse})`,
          opacity: fadeIn(frame, 30),
        }}>
          <div style={{
            background: C.accent,
            color: C.bg,
            fontSize: 36,
            fontWeight: 800,
            fontFamily: FONT,
            padding: "24px 60px",
            borderRadius: 0,
            display: "inline-block",
            boxShadow: `0 0 40px ${C.accent}66`,
          }}>
            30분 무료 진단 받기
          </div>
        </div>
        <p style={{
          color: C.gray,
          fontSize: 20,
          fontFamily: FONT,
          marginTop: 24,
          opacity: fadeIn(frame, 50),
        }}>
          hobbytan-ai.web.app
        </p>
      </div>
      <Subtitle text="30분 무료 AI 진단 — 지금 바로 신청하세요" delay={30} />
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 10: TAN Council + Closing (83~90초 = 210프레임)
// ============================================================
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const agents = [
    { role: "CEO", name: "HOBBY" },
    { role: "DEO", name: "운영총괄" },
    { role: "DEV", name: "개발" },
    { role: "PO", name: "제품기획" },
    { role: "PM", name: "프로젝트" },
    { role: "UX", name: "디자인" },
    { role: "BA", name: "분석" },
    { role: "QA", name: "품질관리" },
    { role: "RES", name: "연구" },
    { role: "MKT", name: "마케팅" },
    { role: "HR", name: "인사" },
    { role: "CS", name: "고객지원" },
    { role: "LEGAL", name: "법무" },
  ];

  const logoScale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <h2 style={{
        color: C.white,
        fontSize: 36,
        fontWeight: 700,
        fontFamily: FONT,
        marginBottom: 30,
        opacity: fadeIn(frame, 0),
        textAlign: "center",
      }}>
        Powered by <span style={{ color: C.accent }}>13 TAN Council</span>
      </h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
        maxWidth: 1300,
        marginBottom: 40,
      }}>
        {agents.map((a, i) => {
          const delay = i * 2 + 5;
          return (
            <div key={i} style={{
              background: i === 0 ? `${C.accent}22` : C.card,
              border: i === 0 ? `2px solid ${C.accent}` : "1px solid #222",
              padding: "10px 18px",
              borderRadius: 0,
              textAlign: "center",
              opacity: fadeIn(frame, delay),
              minWidth: 110,
            }}>
              <div style={{ color: i === 0 ? C.accent : C.white, fontSize: 15, fontWeight: 700, fontFamily: FONT }}>TAN-{a.role}</div>
              <div style={{ color: C.gray, fontSize: 12, fontFamily: FONT }}>{a.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{
        opacity: fadeIn(frame, 40),
        transform: `scale(${Math.min(logoScale, 1)})`,
        textAlign: "center",
      }}>
        <h1 style={{
          color: C.white,
          fontSize: 52,
          fontWeight: 800,
          fontFamily: FONT,
          letterSpacing: -2,
        }}>
          HOBBYTAN<span style={{ color: C.accent }}> AI</span>
        </h1>
        <p style={{
          color: C.accent,
          fontSize: 22,
          fontFamily: FONT,
          marginTop: 8,
        }}>
          AI와 함께 성장하는 미래
        </p>
        <p style={{
          color: C.gray,
          fontSize: 16,
          fontFamily: FONT,
          marginTop: 12,
        }}>
          hobbytan-ai.web.app · @aijossi
        </p>
      </div>
      <Subtitle text="13명의 AI 전문 에이전트가 당신의 AI 전환을 함께합니다" delay={5} />
    </AbsoluteFill>
  );
};

// ============================================================
// MAIN COMPOSITION — 10 Scenes, 90초 (2700 frames @ 30fps)
// ============================================================
export const HobbyTANIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <FontLoader />

      {/* Scene 1: Hook (0~5s) */}
      <Sequence from={0} durationInFrames={150}>
        <HookScene />
      </Sequence>

      {/* Scene 2: 문제 제기 (5~15s) */}
      <Sequence from={150} durationInFrames={300}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: 브랜드 등장 (15~20s) */}
      <Sequence from={450} durationInFrames={150}>
        <BrandScene />
      </Sequence>

      {/* Scene 4: 파워워크샵 (20~35s) */}
      <Sequence from={600} durationInFrames={450}>
        <WorkshopScene />
      </Sequence>

      {/* Scene 5: 실적 숫자 (35~45s) */}
      <Sequence from={1050} durationInFrames={300}>
        <ResultsScene />
      </Sequence>

      {/* Scene 6: 프리미엄 혜택 (45~55s) */}
      <Sequence from={1350} durationInFrames={300}>
        <PremiumScene />
      </Sequence>

      {/* Scene 7: 서비스 라인업 (55~63s) */}
      <Sequence from={1650} durationInFrames={240}>
        <ServicesScene />
      </Sequence>

      {/* Scene 8: 투자 가치 (63~73s) */}
      <Sequence from={1890} durationInFrames={300}>
        <ValueScene />
      </Sequence>

      {/* Scene 9: CTA (73~83s) */}
      <Sequence from={2190} durationInFrames={300}>
        <CTAScene />
      </Sequence>

      {/* Scene 10: Council + Closing (83~90s) */}
      <Sequence from={2490} durationInFrames={210}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
