"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { programLink, sections } from "../light/siteData";
import s from "../light/site.module.css";
import c from "./contact.module.css";

// Header for /contact: same look as the home header, but section links go back to the home
// page ("/#id") and the consultation CTA is marked as the current page.
const homeSections = sections.slice(1, 5);
const menuSections = sections.slice(1, 6);

export default function ContactHeader() {
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
        <a className={s.brand} href="/" aria-label="하비탄 AI 홈으로"><Image src="/logo-black.svg" alt="HOBBYTAN AI" width={200} height={30} priority /></a>
        <nav className={s.quickNav} aria-label="주요 메뉴">{homeSections.map(item => <a key={item.id} href={`/#${item.id}`}>{item.label}</a>)}<a href={programLink.href}>{programLink.label}</a></nav>
        <a className={`${s.headerCta} ${c.ctaCurrent}`} href="/contact" aria-current="page">상담 문의 <ArrowUpRight size={18}/></a>
        <button ref={menuTrigger} type="button" className={s.menuButton} aria-label="전체 메뉴 열기" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={24}/></button>
      </div>
    </header>
    <dialog ref={dialog} className={s.menuDialog} aria-labelledby="menu-title" onClose={() => setMenuOpen(false)} onCancel={event => { event.preventDefault(); closeMenu(); }}>
      <div className={s.menuHeading}><h2 id="menu-title">메뉴</h2><button type="button" aria-label="메뉴 닫기" onClick={closeMenu}><X size={25}/></button></div>
      <nav aria-label="모바일 메뉴">
        <a href="/">홈<ArrowUpRight size={20}/></a>
        {menuSections.map(item => <a key={item.id} href={`/#${item.id}`}>{item.label}<ArrowUpRight size={20}/></a>)}
        <a href={programLink.href}>{programLink.label}<ArrowUpRight size={20}/></a>
        <a href="/contact" aria-current="page" onClick={event => { event.preventDefault(); closeMenu(); }}>상담 문의<ArrowUpRight size={20}/></a>
      </nav>
    </dialog>
  </>;
}
