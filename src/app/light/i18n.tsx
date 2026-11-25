// Language plumbing for the light site: Korean lives at / and /contact, English at /en and /en/contact.
// Visitors whose browser's first language is not Korean are sent to English, unless they picked a
// language with the KO/EN switch (remembered in localStorage) or are a crawler or link-preview bot.

export type Locale = "ko" | "en";

export const homeHref: Record<Locale, string> = { ko: "/", en: "/en" };
export const contactHref: Record<Locale, string> = { ko: "/contact", en: "/en/contact" };

const LANGUAGE_KEY = "hobbytan-lang";

export function rememberLanguage(locale: Locale) {
  try { localStorage.setItem(LANGUAGE_KEY, locale); } catch { /* storage blocked: the browser language decides */ }
}

// hreflang links for a page that exists in both languages; the Korean URL is the x-default.
export function languageAlternates(koPath: string, enPath: string) {
  const ko = `https://hobbytan.com${koPath === "/" ? "" : koPath}`;
  const en = `https://hobbytan.com${enPath}`;
  return { ko, en, "x-default": ko };
}

// Runs inline at the top of <body>, before the page paints.
const redirectSource = (target: string) => `(function(){try{
var saved=null;try{saved=localStorage.getItem(${JSON.stringify(LANGUAGE_KEY)});}catch(e){}
if(saved==="ko")return;
if(/bot|crawl|spider|slurp|yeti|daum|facebookexternalhit|kakaotalk-scrap|lighthouse/i.test(navigator.userAgent||""))return;
var first=String((navigator.languages&&navigator.languages[0])||navigator.language||"").toLowerCase();
if(saved==="en"||(first&&first.indexOf("ko")!==0))location.replace(${JSON.stringify(target)}+location.search+location.hash);
}catch(e){}})();`;

export function EnglishRedirect({ target }: { target: string }) {
  return <script dangerouslySetInnerHTML={{ __html: redirectSource(target) }} />;
}

// The root layout is shared and says lang="ko"; English pages correct it before paint so screen
// readers and Chrome's translate prompt treat the page as English.
export function EnglishDocument() {
  return <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.lang="en";' }} />;
}
