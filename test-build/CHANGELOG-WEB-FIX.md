# hobbytan.com 웹사이트 수정 내역

**작업일:** 2026-02-24
**작업자:** TAN-DEV
**작업 폴더:** `/test-build/` (기존 코드 미접촉)
**빌드:** ✅ `next build` 성공 (8페이지 정상 생성)
**검수:** ✅ PO-TAN 6건 전체 PASS

---

## 수정 사항 (6건)

### 1. 날짜 업데이트 (WEB-001)
- **파일:** `src/components/sections/CTA.tsx`
- **변경:** "다음 기수 시작: 2025년 2월 10일" → "다음 기수 모집 중 — 일정 문의"
- **사유:** 오래된 날짜 표시. CEO 확정 시 정확한 날짜로 교체 예정

### 2. ₩500만 문구 삭제 (WEB-002)
- **파일:** `src/components/sections/Curriculum.tsx` (195행)
- **변경:** "총 ₩500만원 상당의 프리미엄 혜택이 포함되어 있습니다" → "프리미엄 혜택이 모두 포함되어 있습니다"
- **사유:** 개별 항목 시장가 합산(₩730만)과 불일치하여 혼동 유발

### 3. 가격 표기 명확화 (WEB-002)
- **파일:** `src/components/sections/Curriculum.tsx` (241-242행)
- **변경:** ~~₩730만~~ → ₩160만/인 (취소선 앵커링 유지, "₩730만 상당"으로 맥락 보강)
- **사유:** DEO 지시 — 할인이 아닌 혜택 시장가임을 명확화. CEO 앵커링 최종 금액 확정 시 재반영 예정

### 4. 오타 수정 (WEB-009)
- **파일:** `src/components/sections/WhyNow.tsx` (64행)
- **변경:** "빼앗아가고" → "빼앗아 가고"
- **사유:** 맞춤법 오류

### 5. 팔로업 기간 통일 (WEB-010)
- **파일 4개:**
  - `src/components/sections/Pricing.tsx` — "1개월 팔로업" → "90일 팔로업"
  - `src/components/sections/Problem.tsx` — "1개월 지원" → "90일 지원"
  - `src/components/sections/WhyHobbytan.tsx` — "1개월 팔로업" → "90일 팔로업"
  - `src/components/sections/Curriculum.tsx` — 이미 90일 (변경 없음)
- **사유:** 사이트 내 팔로업 기간 표기 불일치 (90일 vs 1개월) 통일

### 6. 잔여 좌석 표기 정리 (WEB-011)
- **파일:** `src/components/sections/Curriculum.tsx` (274행)
- **변경:** "잔여 2자리" → "모집 중"
- **사유:** 하드코딩된 잔여 좌석 수 제거

---

## 추가 수정 (빌드 안정화)

### firebase-admin.ts 리팩토링
- **파일:** `src/lib/firebase-admin.ts`
- **변경:** `cert()` 호출을 모듈 스코프에서 함수 내부로 이동 (lazy init)
- **사유:** Firebase credential 없는 환경에서도 `next build` 성공하도록 개선. 런타임 동작 변경 없음.

---

## CEO 미결 사항 (3건)
1. **앵커링 가격** — PO 제안 ₩1,080만, CEO 결정 대기
2. **다음 기수 정확한 날짜** — 현재 "모집 중 — 일정 문의"로 처리
3. **팔로업 기간 최종 확정** — 현재 90일로 통일, CEO 확정 대기
