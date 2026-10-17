import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CONTACT_EMAIL } from "@/lib/site";
type PrivacySection = {
  id: string;
  title: string;
  description: string;
  details: string[];
};



const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "collection",
    title: "What We Collect",
    description: "Only the data you provide or choose to import is used.",
    details: [
      "Bank accounts, balances, expenses, and reminders you add inside the app",
      "Optional imported SMS transactions that you explicitly approve",
      "Preference settings such as themes and onboarding state",
    ],
  },
  {
    id: "storage",
    title: "Where Data Lives",
    description: "EverySpend follows a local-first storage model.",
    details: [
      "Transaction parsing runs on-device",
      "Data is stored locally using app-private storage",
      "No cloud account is required to use core features",
    ],
  },
  {
    id: "sms",
    title: "SMS Permission",
    description: "SMS access is optional and focused on transaction detection.",
    details: [
      "SMS content is parsed locally for financial entries only",
      "You review and confirm detected records before import",
      "Messages are not uploaded or sold",
    ],
  },
  {
    id: "tracking",
    title: "Tracking and Sharing",
    description: "Your activity is not monetized.",
    details: [
      "No ad network profiling",
      "No selling of personal data",
      "No hidden behavior tracking layer",
    ],
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description:
    "EverySpend privacy policy: local-first processing, optional SMS access, and no tracking.",
};

export default function DocumentPage() {
  return <><main id="main-content" className="document-page support-page">
    <div className="document-topbar">
      <Link className="text-link" href="/"><ArrowLeft size={16} aria-hidden="true" />EverySpend</Link>
      <ThemeToggle />
    </div>
    <header className="support-hero">
      <span className="document-eyebrow">Your trust, thoughtfully kept</span>
      <h1>Privacy Policy</h1>
      <p className="document-deck">Your data stays <em>yours.</em></p>
      <p>EverySpend is built as a local-first expense tracker. Records are processed on your device, with optional SMS access.</p>
      <span className="document-date">Last updated <time dateTime="2026-01-12">January 12, 2026</time></span>
    </header>
    <div className="privacy-layout">
      <nav className="policy-index" aria-label="On this page">
        <span className="document-eyebrow">On this page</span>
        {PRIVACY_SECTIONS.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>0{index + 1}</span>{section.title}</a>)}
        <a href="#questions"><span>05</span>Questions and updates</a>
      </nav>
      <div className="policy-content">
        {PRIVACY_SECTIONS.map((section) => <article key={section.id} id={section.id}>
          <h2>{section.title}</h2><p>{section.description}</p>
          <ul>{section.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        </article>)}
        <article id="questions" className="policy-note"><h2>Questions and updates</h2><p>Contact <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with questions. Updates are published on this page.</p><Link className="text-link" href="/contact">Visit our contact page</Link></article>
      </div>
    </div>
  </main><Footer /></>;
}
