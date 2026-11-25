"use client";

import { useEffect, type RefObject } from "react";

export default function usePageMotion(pageRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const ownership = root.querySelector<HTMLElement>("#ownership");
    const approach = root.querySelector<HTMLElement>("#approach");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute("data-visible", "true");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    sections.forEach(section => observer.observe(section));
    let frame = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const render = () => {
      const range = document.documentElement.scrollHeight - innerHeight;
      root.style.setProperty("--scroll-progress", String(range > 0 ? scrollY / range : 0));
      root.style.setProperty("--hero-offset", reduced.matches ? "0px" : `${Math.min(scrollY * 0.15, 110)}px`);
      root.style.setProperty("--hero-copy-offset", reduced.matches ? "0px" : `${Math.min(scrollY * 0.065, 45)}px`);
      if (ownership) {
        const rect = ownership.getBoundingClientRect();
        const progress = reduced.matches ? 1 : clamp((innerHeight * 1.15 - rect.top) / (innerHeight * 0.35));
        const eased = progress * progress * (3 - 2 * progress);
        const tone = Math.round(255 - 222 * eased);
        const ink = Math.round(36 + 210 * eased);
        const muted = Math.round(102 + 83 * eased);
        ownership.style.setProperty("--tone", `${tone},${tone},${Math.round(tone - eased)}`);
        ownership.style.setProperty("--tone-ink", `${ink},${ink},${Math.round(ink - 3 * eased)}`);
        ownership.style.setProperty("--tone-muted", `${muted},${muted},${Math.round(muted - 4 * eased)}`);
        ownership.style.setProperty("--ownership-progress", String(progress));
      }
      if (approach) {
        const rect = approach.getBoundingClientRect();
        const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
        approach.style.setProperty("--art-offset", reduced.matches ? "0px" : `${(progress - 0.5) * 65}px`);
      }
      frame = 0;
    };
    const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    reduced.addEventListener("change", requestRender);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reduced.removeEventListener("change", requestRender);
    };
  }, [pageRef]);
}
