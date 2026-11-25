"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Send } from "lucide-react";
import s from "../light/site.module.css";
import c from "./contact.module.css";
import { homeHref, type Locale } from "../light/i18n";

// The pinned backend (/api/contact) accepts exactly these six keys. The consent checkbox
// is checked on the client only and is never sent.
type Values = { name: string; email: string; phone: string; company: string; message: string; website: string };
type Field = "name" | "email" | "phone" | "company" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;
type Status = { title: string; text: string };

// Same rules as src/app/api/contact/route.ts.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\-\+\(\)\s]{8,20}$/;
const FIELD_ORDER: Field[] = ["name", "email", "phone", "company", "message", "consent"];
const COMPANY_MAX = 100;
const MESSAGE_MAX = 5000;
const CONTACT_EMAIL = "pablo@hobbytan.com";

const copy = {
  ko: {
    nameEmpty: "이름을 입력해 주세요.", nameLength: "이름은 2자 이상 50자 이하로 입력해 주세요.",
    emailEmpty: "이메일을 입력해 주세요.", emailInvalid: "올바른 이메일 형식을 입력해 주세요.",
    phoneEmpty: "연락처를 입력해 주세요.", phoneInvalid: "올바른 연락처를 입력해 주세요. 숫자와 -, +, 괄호를 써서 8~20자로 입력해 주세요.",
    companyLength: `회사/기관명은 ${COMPANY_MAX}자 이하로 입력해 주세요.`,
    messageEmpty: "문의 내용을 입력해 주세요.", messageLength: `문의 내용은 10자 이상 ${MESSAGE_MAX}자 이하로 입력해 주세요.`,
    consentMissing: "개인정보 수집·이용에 동의해 주세요.",
    wait: (seconds: number) => seconds < 60 ? `${Math.ceil(seconds)}초` : `${Math.ceil(seconds / 60)}분`,
    tooMany: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    retryIn: (wait: string) => `${wait} 뒤에 다시 보내 주세요. 작성하신 내용은 그대로 남아 있습니다.`,
    retryLater: "잠시 뒤에 다시 보내 주세요. 작성하신 내용은 그대로 남아 있습니다.",
    failed: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    failedText: `작성하신 내용은 그대로 남아 있습니다. 문제가 계속되면 ${CONTACT_EMAIL}으로 보내 주세요.`,
    network: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    networkText: `인터넷 연결을 확인한 뒤 다시 보내 주세요. 문제가 계속되면 ${CONTACT_EMAIL}으로 보내 주세요.`,
    successTitle: "문의가 접수되었습니다",
    successText: ["문의해 주셔서 감사합니다. 담당자가 내용을 확인한 뒤", "영업일 기준 48시간 이내", "에 회신드립니다."],
    home: "홈으로", programs: "프로그램 보기",
    formTitle: "상담 신청", required: " 표시는 필수 입력 항목입니다.",
    name: "이름", email: "이메일", phone: "연락처", company: "회사/기관명", optional: "(선택)", message: "문의 내용",
    namePlaceholder: "홍길동", phonePlaceholder: "010-1234-5678", companyPlaceholder: "(주)회사명",
    messagePlaceholder: "지금 바꾸고 싶은 업무, 팀 규모, 희망 일정 등을 자유롭게 적어 주세요.",
    messageHint: "10자 이상 입력해 주세요. ", counter: (n: number) => `(${n.toLocaleString("ko-KR")}/${MESSAGE_MAX.toLocaleString("ko-KR")}자)`,
    consent: "개인정보 수집·이용에 동의합니다 (필수)",
    consentItems: [["수집 항목", "이름·이메일·연락처·회사/기관명·문의 내용"], ["목적", "문의 확인과 회신"], ["보유 기간", "문의 처리 완료 후 1년 (관계 법령에 따라 보관이 필요한 경우 그 기간)"]],
    consentNote: ["부정 이용 방지를 위해 접속 IP와 브라우저 정보가 함께 기록됩니다. 동의하지 않을 수 있으며, 이 경우 문의를 접수할 수 없습니다. 자세한 내용은 ", "개인정보처리방침", "에서 확인할 수 있습니다."],
    sending: "보내는 중…", submit: "상담 신청 보내기 ", submitNote: "영업일 기준 48시간 이내에 회신드립니다.",
  },
  en: {
    nameEmpty: "Please enter your name.", nameLength: "Your name must be 2 to 50 characters.",
    emailEmpty: "Please enter your email.", emailInvalid: "Please enter a valid email address.",
    phoneEmpty: "Please enter your phone number.", phoneInvalid: "Please enter a valid phone number: 8 to 20 characters using digits, -, + and parentheses.",
    companyLength: `Company or organization must be ${COMPANY_MAX} characters or fewer.`,
    messageEmpty: "Please enter your message.", messageLength: `Your message must be 10 to ${MESSAGE_MAX.toLocaleString("en-US")} characters.`,
    consentMissing: "Please agree to the collection and use of your personal information.",
    wait: (seconds: number) => seconds < 60 ? `${Math.ceil(seconds)} seconds` : `${Math.ceil(seconds / 60)} minutes`,
    tooMany: "Too many requests. Please try again shortly.",
    retryIn: (wait: string) => `Please send it again in ${wait}. Your message is still here.`,
    retryLater: "Please send it again shortly. Your message is still here.",
    failed: "Something went wrong while sending your request. Please try again shortly.",
    failedText: `Your message is still here. If the problem continues, email us at ${CONTACT_EMAIL}.`,
    network: "A network error occurred. Please try again shortly.",
    networkText: `Check your internet connection and send it again. If the problem continues, email us at ${CONTACT_EMAIL}.`,
    successTitle: "Your request has been received",
    successText: ["Thank you for reaching out. We'll review your message and reply", "within 48 business hours", "."],
    home: "Back to home", programs: "View programs",
    formTitle: "Request a consultation", required: " Required field.",
    name: "Name", email: "Email", phone: "Phone", company: "Company / organization", optional: "(optional)", message: "Message",
    namePlaceholder: "Your name", phonePlaceholder: "+82 10-1234-5678", companyPlaceholder: "Company name",
    messagePlaceholder: "Tell us what you want to change, your team size, your preferred timeline, or anything else.",
    messageHint: "At least 10 characters. ", counter: (n: number) => `(${n.toLocaleString("en-US")}/${MESSAGE_MAX.toLocaleString("en-US")})`,
    consent: "I agree to the collection and use of my personal information (required)",
    consentItems: [["Collected", "Name, email, phone, company/organization and message"], ["Purpose", "To review and reply to your inquiry"], ["Retention", "1 year after your inquiry is resolved (or longer where the law requires)"]],
    consentNote: ["Your IP address and browser information are also recorded to prevent abuse. You may decline, but then we cannot accept your inquiry. For details, see our ", "Privacy Policy (in Korean)", "."],
    sending: "Sending…", submit: "Send request ", submitNote: "We reply within 48 business hours.",
  },
};
type Copy = (typeof copy)["ko"];

function validate(field: Field, values: Values, consent: boolean, t: Copy): string | undefined {
  switch (field) {
    case "name": {
      const value = values.name.trim();
      if (!value) return t.nameEmpty;
      if (value.length < 2 || value.length > 50) return t.nameLength;
      return;
    }
    case "email": {
      const value = values.email.trim();
      if (!value) return t.emailEmpty;
      if (!EMAIL_PATTERN.test(value) || value.length > 254) return t.emailInvalid;
      return;
    }
    case "phone": {
      const value = values.phone.trim();
      if (!value) return t.phoneEmpty;
      if (!PHONE_PATTERN.test(value)) return t.phoneInvalid;
      return;
    }
    case "company":
      if (values.company.trim().length > COMPANY_MAX) return t.companyLength;
      return;
    case "message": {
      const value = values.message.trim();
      if (!value) return t.messageEmpty;
      if (value.length < 10 || value.length > MESSAGE_MAX) return t.messageLength;
      return;
    }
    case "consent":
      return consent ? undefined : t.consentMissing;
  }
}

export default function ContactForm({ locale = "ko" }: { locale?: Locale }) {
  const t = copy[locale];
  // The pinned API answers in Korean; on the English page show our own wording instead.
  const useServerMessage = locale === "ko";
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", company: "", message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const fields = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const submitButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const inFlight = useRef(false); // blocks a second submit before React re-renders with sending=true
  const panel = useRef<HTMLElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (sending || !restoreFocus.current) return;
    restoreFocus.current = false;
    if (!document.activeElement || document.activeElement === document.body) submitButton.current?.focus();
  }, [sending]);

  useEffect(() => {
    if (!done) return;
    successHeading.current?.focus({ preventScroll: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [done]);

  const describedBy = (field: Field, hint?: string) => [hint, errors[field] ? `${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues(previous => ({ ...previous, [name]: value }));
    if (errors[name as Field]) setErrors(previous => ({ ...previous, [name]: undefined }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as Field;
    if (!event.target.value.trim()) return; // do not nag while someone is just tabbing through
    setErrors(previous => ({ ...previous, [field]: validate(field, values, consent, t) }));
  };

  const handleConsent = (event: ChangeEvent<HTMLInputElement>) => {
    setConsent(event.target.checked);
    if (event.target.checked) setErrors(previous => ({ ...previous, consent: undefined }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || inFlight.current) return;
    setStatus(null);
    const next: Errors = {};
    for (const field of FIELD_ORDER) {
      const message = validate(field, values, consent, t);
      if (message) next[field] = message;
    }
    setErrors(next);
    const firstInvalid = FIELD_ORDER.find(field => next[field]);
    if (firstInvalid) {
      fields.current[firstInvalid]?.focus();
      return;
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      message: values.message.trim(),
      website: values.website,
    };
    inFlight.current = true;
    setSending(true);
    restoreFocus.current = true;
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (response.ok) {
        restoreFocus.current = false;
        setDone(true);
        return;
      }
      let data: { error?: unknown; retryAfter?: unknown } = {};
      try { data = await response.json(); } catch { /* non-JSON error page */ }
      const serverMessage = useServerMessage && typeof data.error === "string" && data.error.trim() ? data.error.trim() : "";
      if (response.status === 429) {
        const seconds = [Number(data.retryAfter), Number(response.headers.get("Retry-After"))].find(value => Number.isFinite(value) && value > 0);
        setStatus({
          title: serverMessage || t.tooMany,
          text: seconds ? t.retryIn(t.wait(seconds)) : t.retryLater,
        });
      } else {
        setStatus({
          title: serverMessage || t.failed,
          text: t.failedText,
        });
      }
    } catch {
      setStatus({
        title: t.network,
        text: t.networkText,
      });
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  const error = (field: Field) => errors[field] ? <p id={`${field}-error`} className={c.error}><AlertCircle size={16} aria-hidden="true"/><span>{errors[field]}</span></p> : null;
  const register = (field: Field) => (element: HTMLInputElement | HTMLTextAreaElement | null) => { fields.current[field] = element; };

  return <section ref={panel} className={c.panel} aria-labelledby={done ? "success-title" : "form-title"}>
    {done ? <div className={c.success}>
      <span className={c.successIcon} aria-hidden="true"><CheckCircle2 size={30}/></span>
      <h2 id="success-title" ref={successHeading} tabIndex={-1}>{t.successTitle}</h2>
      <p>{t.successText[0]}<br/>{" "}<strong>{t.successText[1]}</strong>{t.successText[2]}</p>
      <div className={c.successActions}>
        <a className={s.primaryLink} href={homeHref[locale]}>{t.home} <ArrowUpRight size={20}/></a>
        <a className={c.secondaryLink} href="/shop" hrefLang={locale === "en" ? "ko" : undefined}>{t.programs} <ArrowUpRight size={20}/></a>
      </div>
    </div> : <>
      <h2 id="form-title">{t.formTitle}</h2>
      <p className={c.requiredNote} id="form-required-note"><b aria-hidden="true">*</b>{t.required}</p>
      <form className={c.form} noValidate onSubmit={handleSubmit} aria-busy={sending} aria-describedby="form-required-note">
        <div className={c.honeypot} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" value={values.website} onChange={handleChange} tabIndex={-1} autoComplete="off"/>
        </div>
        <div className={c.field}>
          <label htmlFor="name">{t.name}<span className={c.required} aria-hidden="true">*</span></label>
          <input ref={register("name")} className={c.input} id="name" name="name" type="text" autoComplete="name" required maxLength={50} placeholder={t.namePlaceholder} value={values.name} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.name ? true : undefined} aria-describedby={describedBy("name")}/>
          {error("name")}
        </div>
        <div className={c.field}>
          <label htmlFor="email">{t.email}<span className={c.required} aria-hidden="true">*</span></label>
          <input ref={register("email")} className={c.input} id="email" name="email" type="email" autoComplete="email" autoCapitalize="off" spellCheck={false} required maxLength={254} placeholder="example@company.com" value={values.email} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.email ? true : undefined} aria-describedby={describedBy("email")}/>
          {error("email")}
        </div>
        <div className={c.field}>
          <label htmlFor="phone">{t.phone}<span className={c.required} aria-hidden="true">*</span></label>
          <input ref={register("phone")} className={c.input} id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={20} placeholder={t.phonePlaceholder} value={values.phone} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.phone ? true : undefined} aria-describedby={describedBy("phone")}/>
          {error("phone")}
        </div>
        <div className={c.field}>
          <label htmlFor="company">{t.company}<span className={c.optional}>{t.optional}</span></label>
          <input ref={register("company")} className={c.input} id="company" name="company" type="text" autoComplete="organization" maxLength={COMPANY_MAX} placeholder={t.companyPlaceholder} value={values.company} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.company ? true : undefined} aria-describedby={describedBy("company")}/>
          {error("company")}
        </div>
        <div className={`${c.field} ${c.wide}`}>
          <label htmlFor="message">{t.message}<span className={c.required} aria-hidden="true">*</span></label>
          <textarea ref={register("message")} className={c.input} id="message" name="message" required maxLength={MESSAGE_MAX} rows={7} placeholder={t.messagePlaceholder} value={values.message} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.message ? true : undefined} aria-describedby={describedBy("message", "message-hint")}/>
          <p id="message-hint" className={c.hint}>{t.messageHint}<span className={c.counter}>{t.counter(values.message.trim().length)}</span></p>
          {error("message")}
        </div>
        <div className={c.consent} data-invalid={errors.consent ? "true" : undefined}>
          <label className={c.checkLabel}>
            <input ref={register("consent")} type="checkbox" id="consent" checked={consent} onChange={handleConsent} required aria-invalid={errors.consent ? true : undefined} aria-describedby={describedBy("consent", "consent-notice")}/>
            <span>{t.consent}</span>
          </label>
          <div id="consent-notice">
            <dl className={c.consentList}>
              {t.consentItems.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
            </dl>
            <p className={c.consentNote}>{t.consentNote[0]}<a href="/shop/privacy" hrefLang={locale === "en" ? "ko" : undefined}>{t.consentNote[1]}</a>{t.consentNote[2]}</p>
          </div>
          {error("consent")}
        </div>
        <div className={c.actions}>
          <div className={c.status} role="alert" aria-atomic="true">
            {status && <div className={c.statusBox}><AlertCircle size={20} aria-hidden="true"/><p><strong>{status.title}</strong>{status.text}</p></div>}
          </div>
          <button ref={submitButton} className={c.submit} type="submit" disabled={sending}>
            {sending ? <><Loader2 className={c.spin} size={20} aria-hidden="true"/>{t.sending}</> : <>{t.submit}<Send size={19} aria-hidden="true"/></>}
          </button>
          <p className={c.submitNote}>{t.submitNote}</p>
        </div>
      </form>
    </>}
  </section>;
}
