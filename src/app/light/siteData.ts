// Shared data for the light (consulting) site: the home page and /contact use the same
// section ids, program link, company profile download and business information.
import type { Locale } from "./i18n";

type Section = { id: string; label: string };

export const sectionsByLocale: Record<Locale, Section[]> = {
  ko: [
    { id: "top", label: "소개" },
    { id: "products", label: "서비스" },
    { id: "services", label: "AX 컨설팅" },
    { id: "experience", label: "업무 예시" },
    { id: "education", label: "교육 성과" },
    { id: "approach", label: "진행 방식" },
    { id: "questions", label: "자주 묻는 질문" },
    { id: "consultation", label: "상담" },
  ],
  en: [
    { id: "top", label: "About" },
    { id: "products", label: "Services" },
    { id: "services", label: "AX consulting" },
    { id: "experience", label: "Use cases" },
    { id: "education", label: "Results" },
    { id: "approach", label: "How we work" },
    { id: "questions", label: "FAQ" },
    { id: "consultation", label: "Contact" },
  ],
};

// /shop (courses and payment) exists in Korean only.
export const programLinkByLocale: Record<Locale, { href: string; label: string }> = {
  ko: { href: "/shop", label: "프로그램" },
  en: { href: "/shop", label: "Programs" },
};

// The PDF itself is in Korean.
export const companyProfile = { href: "/downloads/HOBBYTAN_AI_Company_Profile_2026.pdf", filename: "HOBBYTAN_AI_기업소개서_2026.pdf" };

type BusinessItem = { label: string; value: string; href?: string };

export const businessInfoByLocale: Record<Locale, BusinessItem[]> = {
  ko: [
    { label: "상호", value: "하비탄에이아이 주식회사" },
    { label: "대표자명", value: "김탄휴" },
    { label: "사업자등록번호", value: "248-87-03842" },
    { label: "사업장 주소", value: "서울특별시 송파구 송이로26길 16-27, 2,3층(가락동)" },
    { label: "전화", value: "010-9394-9848", href: "tel:010-9394-9848" },
    { label: "이메일", value: "pablo@hobbytan.com", href: "mailto:pablo@hobbytan.com" },
    { label: "통신판매업 신고", value: "제2026-서울송파-2804호" },
    { label: "호스팅 서비스 제공자", value: "Google LLC" },
  ],
  en: [
    { label: "Company", value: "HOBBYTAN AI (하비탄에이아이 주식회사)" },
    { label: "CEO", value: "Tanhyu Kim" },
    { label: "Business registration no.", value: "248-87-03842" },
    { label: "Address", value: "2F–3F, 16-27 Songi-ro 26-gil, Songpa-gu, Seoul, Republic of Korea" },
    { label: "Phone", value: "+82 10-9394-9848", href: "tel:+821093949848" },
    { label: "Email", value: "pablo@hobbytan.com", href: "mailto:pablo@hobbytan.com" },
    { label: "Mail-order business registration", value: "제2026-서울송파-2804호" },
    { label: "Hosting provider", value: "Google LLC" },
  ],
};
