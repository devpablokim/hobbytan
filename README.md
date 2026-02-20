# 하비탄 AI 웹사이트

하비탄 AI의 공식 웹사이트입니다. AI 파워워크샵 및 컨설팅 서비스를 소개합니다.

## 기술 스택

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Database**: Firebase Firestore
- **Email**: Nodemailer (Gmail SMTP)
- **Hosting**: Firebase Hosting

## 주요 기능

- 서비스 소개 랜딩 페이지
- 문의하기 폼 (`/contact`)
- 문의 관리 어드민 (`/admin`)
- 이메일 알림 시스템 (관리자/문의자)

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 환경 변수

`.env.local` 파일에 다음 환경변수를 설정하세요:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
ADMIN_EMAIL=
```

## 배포

```bash
# Firebase 배포
firebase deploy
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 랜딩 페이지
│   ├── contact/          # 문의하기 페이지
│   ├── admin/            # 문의 관리 페이지
│   └── api/contact/      # 문의 API
├── components/
│   ├── layout/           # Header, Footer
│   ├── sections/         # 페이지 섹션들
│   └── ui/               # 공통 UI 컴포넌트
└── lib/
    ├── firebase-admin.ts # Firebase Admin SDK
    ├── hooks.ts          # Custom hooks
    └── utils.ts          # 유틸리티 함수
```

## 라이선스

Copyright 2024 HOBBYTAN AI. All rights reserved.
