"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { programLinkByLocale, sectionsByLocale } from "../light/siteData";
import { contactHref, homeHref, rememberLanguage, type Locale } from "../light/i18n";
import s from "../light/site.module.css";
import c from "./contact.module.css";

// Header for /contact: same look as the home header, but section links go back to the home
// page ("/#id") and the consultation CTA is marked as the current page.
const copy = {
  ko: { brandLabel: "하비탄 AI 홈으로", mainMenu: "주요 메뉴", cta: "상담 문의", openMenu: "전체 메뉴 열기", menu: "메뉴", closeMenu: "메뉴 닫기", mobileMenu: "모바일 메뉴", home: "홈", switchLabel: "View in English", switchText: "EN", switchMenuText: "English" },
  en: { brandLabel: "HOBBYTAN AI home", mainMenu: "Main menu", cta: "Contact", openMenu: "Open menu", menu: "Menu", closeMenu: "Close menu", mobileMenu: "Mobile menu", home: "Home", switchLabel: "한국어로 보기", switchText: "KO", switchMenuText: "한국어" },
};

export default function ContactHeader({ locale = "ko" }: { locale?: Locale }) {
  const t = copy[locale];
  const home = homeHref[locale];
  const sectionHref = (id: string) => home === "/" ? `/#${id}` : `${home}#${id}`; // "/#id", "/en#id"
  const homeSections = sectionsByLocale[locale].slice(1, 5);
  const menuSections = sectionsByLocale[locale].slice(1, 6);
  const programLink = programLinkByLocale[locale];
  const other: Locale = locale === "ko" ? "en" : "ko";
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.current?.open) dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1001px)");
    const closeOnDesktop = () => { if (desktop.matches && dialog.current?.open) { dialog.current.close(); setMenuOpen(false); } };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeMenu = () => { dialog.current?.close(); setMenuOpen(false); menuTrigger.current?.focus(); };

  return <>
    <header className={s.header}>
      <div className={s.headerInner}>
        <a className={s.brand} href={home} aria-label={t.brandLabel}><Image src="/logo-black.svg" alt="HOBBYTAN AI" width={200} height={30} priority /></a>
        <nav className={s.quickNav} aria-label={t.mainMenu}>{homeSections.map(item => <a key={item.id} href={sectionHref(item.id)}>{item.label}</a>)}<a href={programLink.href}>{programLink.label}</a></nav>
        <a className={s.langSwitch} href={contactHref[other]} hrefLang={other} lang={other} aria-label={t.switchLabel} onClick={() => rememberLanguage(other)}>{t.switchText}</a>
        <a className={`${s.headerCta} ${c.ctaCurrent}`} href={contactHref[locale]} aria-current="page">{t.cta} <ArrowUpRight size={18}/></a>
        <button ref={menuTrigger} type="button" className={s.menuButton} aria-label={t.openMenu} aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={24}/></button>
      </div>
    </header>
    <dialog ref={dialog} className={s.menuDialog} aria-labelledby="menu-title" onClose={() => setMenuOpen(false)} onCancel={event => { event.preventDefault(); closeMenu(); }}>
      <div className={s.menuHeading}><h2 id="menu-title">{t.menu}</h2><button type="button" aria-label={t.closeMenu} onClick={closeMenu}><X size={25}/></button></div>
      <nav aria-label={t.mobileMenu}>
        <a href={home}>{t.home}<ArrowUpRight size={20}/></a>
        {menuSections.map(item => <a key={item.id} href={sectionHref(item.id)}>{item.label}<ArrowUpRight size={20}/></a>)}
        <a href={programLink.href}>{programLink.label}<ArrowUpRight size={20}/></a>
        <a href={contactHref[locale]} aria-current="page" onClick={event => { event.preventDefault(); closeMenu(); }}>{t.cta}<ArrowUpRight size={20}/></a>
        <a href={contactHref[other]} hrefLang={other} lang={other} onClick={() => rememberLanguage(other)}>{t.switchMenuText}<ArrowUpRight size={20}/></a>
      </nav>
    </dialog>
  </>;
}
