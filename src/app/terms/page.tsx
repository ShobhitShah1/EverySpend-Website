import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquareText, FileText, BadgeCheck, CircleAlert, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/site";
type TermsSection = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  icon: LucideIcon;
};

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "use",
    title: "Use of the App",
    summary: "EverySpend is provided for personal finance tracking and insights.",
    points: [
      "You can use EverySpend to record expenses, review analytics, and manage reminders",
      "You agree to use the app lawfully and not misuse platform permissions",
      "Core features are designed for individual and household finance use",
    ],
    icon: FileText,
  },
  {
    id: "permissions",
    title: "Permissions and Access",
    summary: "Sensitive permissions are optional and purpose-specific.",
    points: [
      "SMS access is optional and used for transaction detection only",
      "Notification permissions are used for reminders you configure",
      "You can revoke permissions any time from device settings",
    ],
    icon: MessageSquareText,
  },
  {
    id: "ownership",
    title: "Data Ownership",
    summary: "You retain control of the data stored in your app.",
    points: [
      "EverySpend stores data locally on-device as part of a local-first architecture",
      "You are responsible for backup and restore decisions",
      "Deleting the app or local data may remove stored records",
    ],
    icon: BadgeCheck,
  },
  {
    id: "disclaimer",
    title: "Financial Disclaimer",
    summary: "EverySpend supports financial tracking but is not financial advice.",
    points: [
      "Auto-parsed transactions should be reviewed by you before relying on them",
      "EverySpend does not provide investment, tax, or legal advice",
      "You remain responsible for financial decisions and compliance obligations",
    ],
    icon: CircleAlert,
  },
  {
    id: "liability",
    title: "Limits of Liability",
    summary: "We aim for reliability but cannot guarantee uninterrupted service.",
    points: [
      "Features may change, improve, or be discontinued over time",
      "We are not liable for losses caused by device issues or third-party outages",
      "Always maintain your own backup practices for critical records",
    ],
    icon: Scale,
  },
];

export const metadata: Metadata = {
  title: "Terms of Service | EverySpend",
  description:
    "EverySpend terms of service: app usage terms, optional permissions, and user responsibilities.",
};

export default function DocumentPage() {
  return <><main className="document-page">
    <Link className="text-link" href="/"><ArrowLeft size={16} aria-hidden="true" />Back to EverySpend</Link>
    <header><h1>Clear terms. A little peace of mind.</h1><p>These terms explain how EverySpend can be used, what to expect, and your responsibilities.</p></header>
    <section aria-label="Terms policy">
      {TERMS_SECTIONS.map((section) => <article key={section.id} id={section.id}>
        <h2>{section.title}</h2><p>{section.summary}</p>
        <ul>{section.points.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </article>)}
    </section>
    <article><h2>Questions and updates</h2><p>Contact <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with questions. Updates are published on this page.</p><p>Last updated: January 12, 2026</p></article>
  </main><Footer /></>;
}
