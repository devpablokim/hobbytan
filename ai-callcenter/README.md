# 🤖 HOBBYTAN AI 콜센터 (CALLBOT-001)

ElevenLabs Conversational AI + Twilio 기반 AI 콜센터 자동화 시스템

## Architecture

```
고객 전화 → Twilio → TwiML WebSocket → ElevenLabs Conversational AI
                                              ↕
브라우저 UI → WebSocket → ElevenLabs Conversational AI
```

## 구조

```
callcenter-ai/
├── src/                    # Next.js 14 앱 (음성 통화 UI + API)
│   ├── app/
│   │   ├── page.tsx        # 브라우저 음성 통화 UI
│   │   ├── api/conversation/  # ElevenLabs signed URL API
│   │   └── api/twilio/     # Twilio 수신 전화 웹훅
│   └── lib/
│       └── elevenlabs.ts   # ElevenLabs 클라이언트 라이브러리
├── dashboard/
│   └── index.html          # 관리 대시보드 프리뷰
├── agent-config/
│   ├── rules.json          # 응답 룰 + 에스컬레이션 트리거
│   └── system-prompt.md    # AI 음성봇 시스템 프롬프트
├── SETUP_GUIDE_KR.md       # 한국 기준 상세 셋업 가이드
└── package.json
```

## Setup

```bash
cd callcenter-ai
npm install

# .env.local 설정
ELEVENLABS_API_KEY=your_key
ELEVENLABS_AGENT_ID=your_agent_id
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token

npm run dev  # localhost:3001
```

## 셋업 가이드

한국 기준 전체 셋업 절차는 [SETUP_GUIDE_KR.md](./SETUP_GUIDE_KR.md) 참조.

## Project: CALLBOT-001
HOBBYTAN-COUNCIL 의회 프로젝트
