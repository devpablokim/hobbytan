import type { Metadata } from "next";
import localFont from "next/font/local";
import LightSite from "../light/LightSite";
import { EnglishDocument, languageAlternates } from "../light/i18n";

const wantedSans = localFont({
  src: "../light/fonts/WantedSansVariable.woff2",
  display: "swap",
  weight: "400 1000",
});

const ogImage = "https://hobbytan.com/light-assets/og/hobbytan-og-20261009.jpg";
const title = "HOBBYTAN AI | AI Products, AX Consulting & Super AI Workshop";
const description = "HOBBYTAN AI researches AI services and builds and runs its own, including the game Rebirth Farmer and Promha for marketers. With the same technology we offer AX consulting and the Super AI Workshop.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["HOBBYTAN AI", "AI company", "Rebirth Farmer", "Promha", "AI transformation consulting", "AX consulting", "corporate AI training", "Super AI Workshop"],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://hobbytan.com/en", languages: languageAlternates("/", "/en") },
  openGraph: {
    title,
    description,
    url: "https://hobbytan.com/en",
    siteName: "HOBBYTAN AI",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "HOBBYTAN AI · hobbytan.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function EnglishHome() {
  return <div className={wantedSans.className} lang="en"><EnglishDocument/><LightSite locale="en" /></div>;
}
