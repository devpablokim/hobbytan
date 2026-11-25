import type { Metadata } from "next";
import localFont from "next/font/local";
import ContactContent from "../../contact/ContactContent";
import { EnglishDocument, languageAlternates } from "../../light/i18n";

const wantedSans = localFont({
  src: "../../light/fonts/WantedSansVariable.woff2",
  display: "swap",
  weight: "400 1000",
});

const ogImage = "https://hobbytan.com/light-assets/og/hobbytan-og-20261009.jpg";
const title = "Contact | HOBBYTAN AI";
const description = "Ask about AI transformation consulting, the Super AI Workshop or custom workflow tools. We reply within 48 business hours.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: "https://hobbytan.com/en/contact", languages: languageAlternates("/contact", "/en/contact") },
  openGraph: {
    title,
    description,
    url: "https://hobbytan.com/en/contact",
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

export default function EnglishContactPage() {
  return <div className={wantedSans.className}>
    <EnglishDocument/>
    <ContactContent locale="en"/>
  </div>;
}
