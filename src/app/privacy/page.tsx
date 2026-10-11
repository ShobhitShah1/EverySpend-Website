import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, EyeOff, LockKeyhole, MessageSquareText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/site";
type PrivacySection = {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: LucideIcon;
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
    icon: Database,
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
    icon: LockKeyhole,
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
    icon: MessageSquareText,
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
    icon: EyeOff,
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy | EverySpend",
  description:
    "EverySpend privacy policy: local-first processing, optional SMS access, and no tracking.",
};

export default function DocumentPage() {
  return <><main className="document-page">
    <Link className="text-link" href="/"><ArrowLeft size={16} aria-hidden="true" />Back to EverySpend</Link>
    <header><h1>Your data stays yours.</h1><p>EverySpend is built as a local-first expense tracker. Records are processed on your device, with optional SMS access.</p></header>
    <section aria-label="Privacy policy">
      {PRIVACY_SECTIONS.map((section) => <article key={section.id} id={section.id}>
        <h2>{section.title}</h2><p>{section.description}</p>
        <ul>{section.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </article>)}
    </section>
    <article><h2>Questions and updates</h2><p>Contact <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with questions. Updates are published on this page.</p><p>Last updated: January 12, 2026</p></article>
  </main><Footer /></>;
}
