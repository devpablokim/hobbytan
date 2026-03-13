# 🇰🇷 한국 기준 AI 콜센터 셋업 가이드

> 기준일: 2026-03-13 | 작성: HOBBYTAN COUNCIL DEO-TAN

---

## 📋 목차
1. [전체 구조 이해](#1-전체-구조-이해)
2. [필요한 서비스 가입](#2-필요한-서비스-가입)
3. [ElevenLabs 에이전트 생성](#3-elevenlabs-에이전트-생성)
4. [Twilio 한국 전화번호 발급](#4-twilio-한국-전화번호-발급)
5. [ElevenLabs ↔ Twilio 연동](#5-elevenlabs--twilio-연동)
6. [응답 룰 설정](#6-응답-룰-설정)
7. [상담원 연결 플로우](#7-상담원-연결-플로우)
8. [테스트 및 운영](#8-테스트-및-운영)
9. [비용 구조](#9-비용-구조)
10. [한국 법률 주의사항](#10-한국-법률-주의사항)

---

## 1. 전체 구조 이해

```
[고객] --전화--> [한국 전화번호 070/02 등]
                        |
                   [Twilio SIP]
                        |
              [ElevenLabs Agent]
                   /          \
    [룰 매칭 → 즉시 답변]   [룰 미매칭 → 상담원 연결]
                                    |
                           [Twilio 착신전환]
                                    |
                              [실제 상담원]
```

### 핵심 구성요소
| 구성요소 | 역할 | 서비스 |
|---------|------|--------|
| 전화번호 | 고객이 전화하는 번호 | Twilio (한국 번호) |
| 음성 AI | 고객과 대화하는 AI | ElevenLabs Conversational AI |
| 라우팅 | 전화 연결/전환 관리 | Twilio Programmable Voice |
| 관리 대시보드 | 룰 관리, 통화 로그 | 자체 구축 (Next.js) |

---

## 2. 필요한 서비스 가입

### 2-1. ElevenLabs 가입
1. https://elevenlabs.io 접속
2. 회원가입 (Google 계정 가능)
3. **플랜 선택**:
   - Starter ($5/월): 테스트용, 월 30분 대화
   - Creator ($22/월): 소규모, 월 100분
   - Pro ($99/월): 중규모, 월 500분
   - Scale ($330/월): 대규모, 월 2,000분
   - **Conversational AI 기능은 Creator 이상부터 사용 가능**
4. API Key 발급: Profile → API Keys → Create

### 2-2. Twilio 가입
1. https://www.twilio.com 접속
2. 회원가입 (이메일 인증 필요)
3. **한국 번호 발급 조건**:
   - 사업자 등록증 필요 (개인은 불가)
   - 한국 주소 증명 필요
   - Regulatory Bundle 제출 (신원 확인)
4. **계정 SID + Auth Token** 확인: Console → Account Info

#### ⚠️ 한국 번호 발급이 어려운 경우 대안
- **방법 A**: Twilio US 번호($1/월) + 국제전화 착신 (테스트용)
- **방법 B**: 한국 VoIP 사업자 (KT 클라우드, LGU+ 등) + SIP 트렁크로 ElevenLabs 직접 연동
- **방법 C**: 050 인터넷전화 번호 발급 (상대적으로 규제가 덜함)

### 2-3. 한국 VoIP 대안 사업자 (Twilio 대안)
| 사업자 | 번호 유형 | SIP 지원 | 비용 |
|--------|----------|---------|------|
| KT 클라우드 콜센터 | 070/1588 | ✅ | 문의 필요 |
| LGU+ AI 콜센터 | 070/1544 | ✅ | 문의 필요 |
| SK브로드밴드 | 070 | ✅ | 문의 필요 |
| 가비아 인터넷전화 | 070 | ✅ | 월 3,300원~ |
| 세중텔레콤 | 050 | ✅ | 월 5,000원~ |

> **권장**: 테스트 단계에서는 Twilio US 번호로 시작하고, 실 운영 시 한국 VoIP 사업자 + SIP 트렁크로 전환

---

## 3. ElevenLabs 에이전트 생성

### 3-1. 대시보드에서 생성
1. https://elevenlabs.io/app/conversational-ai 접속
2. "Create Agent" 클릭
3. **기본 설정**:
   - Agent Name: `HOBBYTAN 고객센터`
   - Language: `Korean` (한국어)
   - Voice: 한국어 지원 음성 선택 (예: "Rachel" 또는 커스텀 음성)
   - LLM: GPT-4o 또는 Claude (ElevenLabs 제공)

### 3-2. 시스템 프롬프트 설정
```
당신은 하비탄AI 고객센터 AI 상담원입니다.

역할:
- 고객의 질문에 친절하고 정확하게 답변합니다
- 정해진 룰(FAQ)에 있는 질문에는 즉시 답변합니다
- 룰에 없는 질문이나 복잡한 요청은 상담원에게 연결합니다

말투:
- 존댓말을 사용합니다
- 간결하고 명확하게 답변합니다
- "안녕하세요, 하비탄AI 고객센터입니다. 무엇을 도와드릴까요?"로 시작합니다

상담원 연결 기준:
- 환불/결제 관련 요청
- 불만/컴플레인
- 기술적 문제 (로그인 불가 등)
- 룰에 없는 질문
- 고객이 "상담원 연결해주세요"라고 말한 경우

상담원 연결 시:
- "네, 전문 상담원에게 연결해 드리겠습니다. 잠시만 기다려 주세요."
- transfer_to_agent 도구를 호출합니다
```

### 3-3. Knowledge Base 설정
- FAQ 문서 업로드 (PDF, TXT, URL)
- 상품/서비스 안내 문서 업로드
- RAG(검색 기반 응답)으로 정확한 답변 가능

### 3-4. Tools 설정
- `transfer_to_agent`: 상담원 연결 도구
- `check_order_status`: 주문 상태 조회 (API 연동)
- `book_appointment`: 예약 등록 (Calendar API 연동)

---

## 4. Twilio 한국 전화번호 발급

### 4-1. Regulatory Bundle 제출 (한국 번호용)
1. Twilio Console → Phone Numbers → Regulatory Compliance
2. Create Bundle → South Korea
3. 제출 서류:
   - 사업자등록증 사본
   - 대표자 신분증 사본
   - 한국 주소 증명 (사업자 등록 주소)
4. 승인까지 2~5 영업일 소요

### 4-2. 전화번호 구매
1. Console → Phone Numbers → Buy a Number
2. Country: South Korea (+82)
3. 번호 유형 선택:
   - Local (지역번호 02, 031 등)
   - Mobile (010) — 한국은 제한적
   - Toll-free (080) — 수신자 부담
4. 월 비용: 약 $4~15/번호

### 4-3. 대안: US 번호로 테스트
1. Buy a Number → US → Voice 지원 번호 선택
2. 월 $1.15
3. 한국에서 국제전화로 테스트 가능

---

## 5. ElevenLabs ↔ Twilio 연동

### 방법 A: Native Integration (권장)
1. ElevenLabs 대시보드 → Agent → Phone Numbers
2. "Connect Twilio" 클릭
3. Twilio Account SID + Auth Token 입력
4. 연동할 전화번호 선택
5. ElevenLabs가 자동으로 Webhook 설정
6. 완료! 해당 번호로 전화하면 AI가 응답

### 방법 B: SIP Trunking (한국 VoIP 사용 시)
1. ElevenLabs 대시보드 → Agent → Phone Numbers → SIP Trunking
2. SIP URI 확인 (예: `sip:agent-id@sip.elevenlabs.io`)
3. 한국 VoIP 사업자의 SIP 트렁크 설정에서:
   - Outbound URI: ElevenLabs SIP URI 입력
   - Codec: PCMU (G.711)
   - Authentication: ElevenLabs 제공 credentials 입력
4. 테스트 통화 실행

---

## 6. 응답 룰 설정

### rules.json 예시
```json
{
  "greeting": "안녕하세요, 하비탄AI 고객센터입니다. 무엇을 도와드릴까요?",
  "rules": [
    {
      "id": "R001",
      "category": "서비스 안내",
      "keywords": ["워크샵", "프로그램", "과정", "커리큘럼"],
      "response": "AI 슈퍼워크샵은 6주 과정으로, AI를 업무에 활용하는 방법을 배우는 프로그램입니다. 자세한 내용은 hobbytan.com에서 확인하실 수 있습니다."
    },
    {
      "id": "R002",
      "category": "가격",
      "keywords": ["가격", "비용", "얼마", "수강료"],
      "response": "AI 슈퍼워크샵 정가는 800만원이며, 현재 얼리버드 할인을 진행 중입니다. 정확한 할인 금액은 홈페이지를 참고해 주세요."
    },
    {
      "id": "R003",
      "category": "일정",
      "keywords": ["일정", "시작", "기수", "모집"],
      "response": "다음 기수 일정은 확정되는 대로 홈페이지와 이메일로 안내해 드리겠습니다. 사전 등록을 원하시면 홈페이지에서 신청해 주세요."
    },
    {
      "id": "R004",
      "category": "운영 시간",
      "keywords": ["운영", "시간", "영업", "상담"],
      "response": "고객센터 운영 시간은 평일 오전 9시부터 오후 6시까지입니다. AI 상담은 24시간 가능합니다."
    }
  ],
  "escalation_triggers": [
    "환불", "결제", "취소", "불만", "컴플레인", "오류", "에러",
    "상담원", "사람", "담당자", "매니저"
  ],
  "escalation_message": "네, 전문 상담원에게 연결해 드리겠습니다. 잠시만 기다려 주세요.",
  "fallback_message": "죄송합니다, 해당 문의는 전문 상담원이 더 정확하게 안내해 드릴 수 있습니다. 상담원에게 연결해 드릴까요?"
}
```

---

## 7. 상담원 연결 플로우

### ElevenLabs Agent Tools 설정
```json
{
  "name": "transfer_to_agent",
  "description": "고객을 실제 상담원에게 연결합니다",
  "type": "webhook",
  "webhook_url": "https://your-server.com/api/transfer",
  "method": "POST"
}
```

### Twilio 착신전환 구현 (서버 측)
```javascript
// /api/transfer - 상담원 연결 API
app.post('/api/transfer', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // 대기 음악 재생
  twiml.play({ loop: 0 }, 'https://your-server.com/hold-music.mp3');
  
  // 상담원 번호로 전환
  const dial = twiml.dial({
    callerId: '+8270XXXXXXXX', // 콜센터 번호
    timeout: 30,
    action: '/api/transfer-complete'
  });
  dial.number('+82010XXXXXXXX'); // 상담원 번호
  
  // 상담원 부재 시
  twiml.say({ language: 'ko-KR' }, 
    '현재 모든 상담원이 통화 중입니다. 잠시 후 다시 연결하겠습니다.');
  
  res.type('text/xml');
  res.send(twiml.toString());
});
```

---

## 8. 테스트 및 운영

### 테스트 체크리스트
- [ ] 전화 연결 → AI 인사말 정상 출력
- [ ] FAQ 질문 → 룰 기반 답변 정상
- [ ] 알 수 없는 질문 → "상담원 연결할까요?" 응답
- [ ] "상담원 연결해줘" → 상담원 전환 정상
- [ ] 상담원 부재 → 부재 안내 멘트 출력
- [ ] 통화 종료 → 로그 정상 기록
- [ ] 한국어 음성 품질 확인

### 운영 모니터링
- ElevenLabs 대시보드: 대화 로그, 성공률, 평균 통화 시간
- Twilio 대시보드: 통화 건수, 비용, 실패율
- 자체 대시보드: 룰 매칭률, 상담원 연결 비율

---

## 9. 비용 구조

### 월간 예상 비용 (소규모 100건/월 기준)
| 항목 | 비용 | 비고 |
|------|------|------|
| ElevenLabs Pro | $99/월 | 500분 대화 포함 |
| Twilio 번호 | $4~15/월 | 한국 번호 1개 |
| Twilio 통화료 | ~$0.015/분 | 수신 기준 |
| 서버 (Firebase) | $0~25/월 | 사용량 기반 |
| **합계** | **~$120~140/월** | **약 16~19만원** |

### 대규모 1,000건/월 기준
| 항목 | 비용 |
|------|------|
| ElevenLabs Scale | $330/월 |
| Twilio 통화료 | ~$15/월 |
| 서버 | ~$25/월 |
| **합계** | **~$370/월 (약 50만원)** |

---

## 10. 한국 법률 주의사항

### 통신사업 관련
- **별정통신사업 등록**: 부가통신서비스를 제공하므로, 규모에 따라 미래창조과학부에 등록 필요할 수 있음
- **070 번호 사용 시**: 인터넷전화 사업자를 통해 정식 발급 필요

### 개인정보보호
- **통화 녹음 시**: 반드시 사전 고지 필요 ("이 통화는 서비스 향상을 위해 녹음됩니다")
- **개인정보 수집**: 통화 중 수집하는 개인정보에 대해 동의 필요
- **데이터 보관**: 통화 로그 보관 기간 및 파기 정책 수립

### AI 관련
- **AI 상담원임을 고지**: "AI 상담원이 응대합니다" 사전 안내 필수
- **EU AI Act 참고**: 한국도 AI 기본법 제정 추진 중, 동향 주시

---

## 다음 단계
1. ✅ ElevenLabs 계정 확인 + 에이전트 생성
2. ✅ Twilio 가입 + 번호 발급 (또는 테스트 번호)
3. ✅ 연동 테스트
4. ⬜ FAQ 룰 확정 (CEO 결정)
5. ⬜ 상담원 연결 번호 확정
6. ⬜ 실 운영 번호 전환
