"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Send } from "lucide-react";
import s from "../light/site.module.css";
import c from "./contact.module.css";

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

function validate(field: Field, values: Values, consent: boolean): string | undefined {
  switch (field) {
    case "name": {
      const value = values.name.trim();
      if (!value) return "이름을 입력해 주세요.";
      if (value.length < 2 || value.length > 50) return "이름은 2자 이상 50자 이하로 입력해 주세요.";
      return;
    }
    case "email": {
      const value = values.email.trim();
      if (!value) return "이메일을 입력해 주세요.";
      if (!EMAIL_PATTERN.test(value) || value.length > 254) return "올바른 이메일 형식을 입력해 주세요.";
      return;
    }
    case "phone": {
      const value = values.phone.trim();
      if (!value) return "연락처를 입력해 주세요.";
      if (!PHONE_PATTERN.test(value)) return "올바른 연락처를 입력해 주세요. 숫자와 -, +, 괄호를 써서 8~20자로 입력해 주세요.";
      return;
    }
    case "company":
      if (values.company.trim().length > COMPANY_MAX) return `회사/기관명은 ${COMPANY_MAX}자 이하로 입력해 주세요.`;
      return;
    case "message": {
      const value = values.message.trim();
      if (!value) return "문의 내용을 입력해 주세요.";
      if (value.length < 10 || value.length > MESSAGE_MAX) return `문의 내용은 10자 이상 ${MESSAGE_MAX}자 이하로 입력해 주세요.`;
      return;
    }
    case "consent":
      return consent ? undefined : "개인정보 수집·이용에 동의해 주세요.";
  }
}

function waitText(seconds: number) {
  return seconds < 60 ? `${Math.ceil(seconds)}초` : `${Math.ceil(seconds / 60)}분`;
}

export default function ContactForm() {
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
    setErrors(previous => ({ ...previous, [field]: validate(field, values, consent) }));
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
      const message = validate(field, values, consent);
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
      const serverMessage = typeof data.error === "string" && data.error.trim() ? data.error.trim() : "";
      if (response.status === 429) {
        const seconds = [Number(data.retryAfter), Number(response.headers.get("Retry-After"))].find(value => Number.isFinite(value) && value > 0);
        setStatus({
          title: serverMessage || "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
          text: seconds ? `${waitText(seconds)} 뒤에 다시 보내 주세요. 작성하신 내용은 그대로 남아 있습니다.` : "잠시 뒤에 다시 보내 주세요. 작성하신 내용은 그대로 남아 있습니다.",
        });
      } else {
        setStatus({
          title: serverMessage || "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          text: `작성하신 내용은 그대로 남아 있습니다. 문제가 계속되면 ${CONTACT_EMAIL}으로 보내 주세요.`,
        });
      }
    } catch {
      setStatus({
        title: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        text: `인터넷 연결을 확인한 뒤 다시 보내 주세요. 문제가 계속되면 ${CONTACT_EMAIL}으로 보내 주세요.`,
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
      <h2 id="success-title" ref={successHeading} tabIndex={-1}>문의가 접수되었습니다</h2>
      <p>문의해 주셔서 감사합니다. 담당자가 내용을 확인한 뒤<br/>{" "}<strong>영업일 기준 48시간 이내</strong>에 회신드립니다.</p>
      <div className={c.successActions}>
        <a className={s.primaryLink} href="/">홈으로 <ArrowUpRight size={20}/></a>
        <a className={c.secondaryLink} href="/shop">프로그램 보기 <ArrowUpRight size={20}/></a>
      </div>
    </div> : <>
      <h2 id="form-title">상담 신청</h2>
      <p className={c.requiredNote} id="form-required-note"><b aria-hidden="true">*</b> 표시는 필수 입력 항목입니다.</p>
      <form className={c.form} noValidate onSubmit={handleSubmit} aria-busy={sending} aria-describedby="form-required-note">
        <div className={c.honeypot} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" value={values.website} onChange={handleChange} tabIndex={-1} autoComplete="off"/>
        </div>
        <div className={c.field}>
          <label htmlFor="name">이름<span className={c.required} aria-hidden="true">*</span></label>
          <input ref={register("name")} className={c.input} id="name" name="name" type="text" autoComplete="name" required maxLength={50} placeholder="홍길동" value={values.name} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.name ? true : undefined} aria-describedby={describedBy("name")}/>
          {error("name")}
        </div>
        <div className={c.field}>
          <label htmlFor="email">이메일<span className={c.required} aria-hidden="true">*</span></label>
          <input ref={register("email")} className={c.input} id="email" name="email" type="email" autoComplete="email" autoCapitalize="off" spellCheck={false} required maxLength={254} placeholder="example@company.com" value={values.email} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.email ? true : undefined} aria-describedby={describedBy("email")}/>
          {error("email")}
        </div>
        <div className={c.field}>
          <label htmlFor="phone">연락처<span className={c.required} aria-hidden="true">*</span></label>
          <input ref={register("phone")} className={c.input} id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={20} placeholder="010-1234-5678" value={values.phone} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.phone ? true : undefined} aria-describedby={describedBy("phone")}/>
          {error("phone")}
        </div>
        <div className={c.field}>
          <label htmlFor="company">회사/기관명<span className={c.optional}>(선택)</span></label>
          <input ref={register("company")} className={c.input} id="company" name="company" type="text" autoComplete="organization" maxLength={COMPANY_MAX} placeholder="(주)회사명" value={values.company} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.company ? true : undefined} aria-describedby={describedBy("company")}/>
          {error("company")}
        </div>
        <div className={`${c.field} ${c.wide}`}>
          <label htmlFor="message">문의 내용<span className={c.required} aria-hidden="true">*</span></label>
          <textarea ref={register("message")} className={c.input} id="message" name="message" required maxLength={MESSAGE_MAX} rows={7} placeholder="지금 바꾸고 싶은 업무, 팀 규모, 희망 일정 등을 자유롭게 적어 주세요." value={values.message} onChange={handleChange} onBlur={handleBlur} aria-invalid={errors.message ? true : undefined} aria-describedby={describedBy("message", "message-hint")}/>
          <p id="message-hint" className={c.hint}>10자 이상 입력해 주세요. <span className={c.counter}>({values.message.trim().length.toLocaleString("ko-KR")}/{MESSAGE_MAX.toLocaleString("ko-KR")}자)</span></p>
          {error("message")}
        </div>
        <div className={c.consent} data-invalid={errors.consent ? "true" : undefined}>
          <label className={c.checkLabel}>
            <input ref={register("consent")} type="checkbox" id="consent" checked={consent} onChange={handleConsent} required aria-invalid={errors.consent ? true : undefined} aria-describedby={describedBy("consent", "consent-notice")}/>
            <span>개인정보 수집·이용에 동의합니다 (필수)</span>
          </label>
          <div id="consent-notice">
            <dl className={c.consentList}>
              <div><dt>수집 항목</dt><dd>이름·이메일·연락처·회사/기관명·문의 내용</dd></div>
              <div><dt>목적</dt><dd>문의 확인과 회신</dd></div>
              <div><dt>보유 기간</dt><dd>문의 처리 완료 후 1년 (관계 법령에 따라 보관이 필요한 경우 그 기간)</dd></div>
            </dl>
            <p className={c.consentNote}>부정 이용 방지를 위해 접속 IP와 브라우저 정보가 함께 기록됩니다. 동의하지 않을 수 있으며, 이 경우 문의를 접수할 수 없습니다. 자세한 내용은 <a href="/shop/privacy">개인정보처리방침</a>에서 확인할 수 있습니다.</p>
          </div>
          {error("consent")}
        </div>
        <div className={c.actions}>
          <div className={c.status} role="alert" aria-atomic="true">
            {status && <div className={c.statusBox}><AlertCircle size={20} aria-hidden="true"/><p><strong>{status.title}</strong>{status.text}</p></div>}
          </div>
          <button ref={submitButton} className={c.submit} type="submit" disabled={sending}>
            {sending ? <><Loader2 className={c.spin} size={20} aria-hidden="true"/>보내는 중…</> : <>상담 신청 보내기 <Send size={19} aria-hidden="true"/></>}
          </button>
          <p className={c.submitNote}>영업일 기준 48시간 이내에 회신드립니다.</p>
        </div>
      </form>
    </>}
  </section>;
}
