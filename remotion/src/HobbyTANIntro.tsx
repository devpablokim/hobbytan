import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from "remotion";

// === STYLES ===
const colors = {
  bg: "#0a0a0a",
  accent: "#f472b6",
  white: "#ffffff",
  gray: "#a3a3a3",
  darkGray: "#1a1a1a",
};

// === SCENES ===

// Scene 1: Opening — Logo + Company Name
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 120,
          transform: `scale(${logoScale})`,
          marginBottom: 20,
        }}>
          🔥
        </div>
        <h1 style={{
          color: colors.white,
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -2,
          opacity: textOpacity,
          fontFamily: "system-ui, sans-serif",
        }}>
          HOBBYTAN<span style={{ color: colors.accent }}> AI</span>
        </h1>
        <p style={{
          color: colors.gray,
          fontSize: 28,
          opacity: subtitleOpacity,
          marginTop: 16,
          fontFamily: "system-ui, sans-serif",
        }}>
          Thinking Assembly Network — AI 집단 지성 의회
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Services Overview
const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const services = [
    { icon: "📚", title: "교육 프로그램", desc: "AI 시대의 실전 교육 커리큘럼" },
    { icon: "🧠", title: "스터디 그룹", desc: "함께 성장하는 학습 커뮤니티" },
    { icon: "🛠️", title: "워크샵", desc: "실습 중심의 핸즈온 워크샵" },
    { icon: "🤝", title: "소셜클럽", desc: "AI 전문가 네트워킹" },
  ];

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        color: colors.white,
        fontSize: 48,
        fontWeight: 700,
        marginBottom: 60,
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}>
        Our <span style={{ color: colors.accent }}>Services</span>
      </h2>
      <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
        {services.map((s, i) => {
          const delay = i * 10;
          const scale = spring({ frame: frame - delay, fps, config: { damping: 12 } });
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

          return (
            <div key={i} style={{
              background: colors.darkGray,
              border: `1px solid ${colors.accent}22`,
              padding: "40px 32px",
              width: 280,
              textAlign: "center",
              transform: `scale(${Math.min(scale, 1)})`,
              opacity,
            }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ color: colors.white, fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>{s.title}</h3>
              <p style={{ color: colors.gray, fontSize: 16, fontFamily: "system-ui, sans-serif" }}>{s.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: TAN Council — 13 Agents
const CouncilScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const agents = [
    { role: "CEO", emoji: "👑", name: "HOBBY" },
    { role: "DEO", emoji: "⚡", name: "운영총괄" },
    { role: "DEV", emoji: "🔥", name: "개발자" },
    { role: "PO", emoji: "🧭", name: "품질관리" },
    { role: "PM", emoji: "⏱️", name: "프로젝트" },
    { role: "UX", emoji: "🎨", name: "디자인" },
    { role: "BA", emoji: "📊", name: "분석" },
    { role: "QA", emoji: "🔍", name: "테스트" },
    { role: "RES", emoji: "🔬", name: "연구" },
    { role: "MKT", emoji: "📢", name: "마케팅" },
    { role: "HR", emoji: "👥", name: "인사" },
    { role: "CS", emoji: "💬", name: "고객지원" },
    { role: "LEGAL", emoji: "⚖️", name: "법무" },
  ];

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: "center", alignItems: "center", padding: 80 }}>
      <h2 style={{
        color: colors.white,
        fontSize: 44,
        fontWeight: 700,
        marginBottom: 50,
        opacity: titleOpacity,
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}>
        13-Node <span style={{ color: colors.accent }}>TAN Council</span>
      </h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        justifyContent: "center",
        maxWidth: 1400,
      }}>
        {agents.map((a, i) => {
          const delay = i * 3;
          const opacity = interpolate(frame, [delay + 10, delay + 25], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const y = interpolate(frame, [delay + 10, delay + 25], [30, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });

          return (
            <div key={i} style={{
              background: i === 0 ? `${colors.accent}22` : colors.darkGray,
              border: i === 0 ? `2px solid ${colors.accent}` : `1px solid #333`,
              padding: "16px 24px",
              minWidth: 150,
              textAlign: "center",
              opacity,
              transform: `translateY(${y}px)`,
            }}>
              <div style={{ fontSize: 32 }}>{a.emoji}</div>
              <div style={{ color: colors.white, fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>TAN-{a.role}</div>
              <div style={{ color: colors.gray, fontSize: 13, fontFamily: "system-ui, sans-serif" }}>{a.name}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: AIJOSSI Channels
const AijossiScene: React.FC = () => {
  const frame = useCurrentFrame();

  const channels = [
    { icon: "📝", name: "Blog", url: "aijossi.tistory.com" },
    { icon: "🎬", name: "YouTube", url: "youtube.com/aijossi" },
    { icon: "🧵", name: "Threads", url: "threads.net/@aijossi" },
    { icon: "📸", name: "Instagram", url: "instagram.com/aijossi" },
  ];

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: "center", alignItems: "center" }}>
      <h2 style={{
        color: colors.white,
        fontSize: 48,
        fontWeight: 700,
        marginBottom: 16,
        opacity: titleOpacity,
        fontFamily: "system-ui, sans-serif",
      }}>
        AI조씨 <span style={{ color: colors.accent }}>AIJOSSI</span>
      </h2>
      <p style={{
        color: colors.gray,
        fontSize: 22,
        marginBottom: 60,
        opacity: titleOpacity,
        fontFamily: "system-ui, sans-serif",
      }}>
        AI 콘텐츠 채널 관리
      </p>
      <div style={{ display: "flex", gap: 48 }}>
        {channels.map((c, i) => {
          const delay = i * 12;
          const opacity = interpolate(frame, [delay + 20, delay + 35], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });

          return (
            <div key={i} style={{
              textAlign: "center",
              opacity,
            }}>
              <div style={{
                fontSize: 64,
                marginBottom: 16,
                background: colors.darkGray,
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${colors.accent}33`,
              }}>
                {c.icon}
              </div>
              <div style={{ color: colors.white, fontSize: 22, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{c.name}</div>
              <div style={{ color: colors.accent, fontSize: 14, fontFamily: "system-ui, sans-serif", marginTop: 4 }}>{c.url}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Closing
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 15 } });
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${Math.min(scale, 1)})` }}>
        <h1 style={{
          color: colors.white,
          fontSize: 64,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}>
          HOBBYTAN<span style={{ color: colors.accent }}> AI</span>
        </h1>
        <p style={{
          color: colors.accent,
          fontSize: 28,
          marginTop: 20,
          opacity: taglineOpacity,
          fontFamily: "system-ui, sans-serif",
        }}>
          AI와 함께 성장하는 미래
        </p>
        <p style={{
          color: colors.gray,
          fontSize: 18,
          marginTop: 40,
          opacity: taglineOpacity,
          fontFamily: "system-ui, sans-serif",
        }}>
          hobbytan-ai.web.app · @aijossi
        </p>
      </div>
    </AbsoluteFill>
  );
};

// === MAIN COMPOSITION ===
export const HobbyTANIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Scene 1: Opening (0-4s) */}
      <Sequence from={0} durationInFrames={120}>
        <OpeningScene />
      </Sequence>

      {/* Scene 2: Services (4-16s) */}
      <Sequence from={120} durationInFrames={360}>
        <ServicesScene />
      </Sequence>

      {/* Scene 3: TAN Council (16-32s) */}
      <Sequence from={480} durationInFrames={480}>
        <CouncilScene />
      </Sequence>

      {/* Scene 4: AIJOSSI Channels (32-46s) */}
      <Sequence from={960} durationInFrames={420}>
        <AijossiScene />
      </Sequence>

      {/* Scene 5: Closing (46-60s) */}
      <Sequence from={1380} durationInFrames={420}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
