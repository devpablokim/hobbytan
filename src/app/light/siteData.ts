// Shared data for the light (consulting) site: the home page and /contact use the same
// section ids, program link, company profile download and business information.

export const sections = [
  { id: "top", label: "소개" },
  { id: "services", label: "서비스" },
  { id: "experience", label: "업무 예시" },
  { id: "education", label: "교육 성과" },
  { id: "approach", label: "진행 방식" },
  { id: "questions", label: "자주 묻는 질문" },
  { id: "consultation", label: "상담" },
];

export const programLink = { href: "/shop", label: "프로그램" };

export const companyProfile = { href: "/downloads/HOBBYTAN_AI_Company_Profile_2026.pdf", filename: "HOBBYTAN_AI_기업소개서_2026.pdf" };

export const businessInfo: { label: string; value: string; href?: string }[] = [
  { label: "상호", value: "하비탄에이아이 주식회사" },
  { label: "대표자명", value: "김탄휴" },
  { label: "사업자등록번호", value: "248-87-03842" },
  { label: "사업장 주소", value: "서울특별시 송파구 송이로26길 16-27, 2,3층(가락동)" },
  { label: "전화", value: "010-9394-9848", href: "tel:010-9394-9848" },
  { label: "이메일", value: "pablo@hobbytan.com", href: "mailto:pablo@hobbytan.com" },
  { label: "통신판매업 신고", value: "제2026-서울송파-2804호" },
  { label: "호스팅 서비스 제공자", value: "Google LLC" },
];
