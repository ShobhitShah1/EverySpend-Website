import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContactFormCard } from "@/components/ContactFormCard";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CONTACT_EMAIL } from "@/lib/site";
export const metadata: Metadata = { title: "Contact", description: "Contact EverySpend with questions, feedback, or support requests.", alternates: { canonical: "/contact" } };
export default function ContactPage() {
  return <><main id="main-content" className="document-page support-page">
    <div className="document-topbar">
      <Link className="text-link" href="/"><ArrowLeft size={16} aria-hidden="true" />EverySpend</Link>
      <ThemeToggle />
    </div>
    <header className="support-hero">
      <span className="document-eyebrow">Contact EverySpend</span>
      <h1>A little <em>hello.</em></h1>
      <p>A question, an idea, or something that needs fixing? We’d love to hear from you.</p>
    </header>
    <div className="contact-layout">
      <ContactFormCard />
      <aside className="contact-aside">
        <div className="contact-email-card">
          <h2>More of an email person?</h2>
          <p>Our inbox is open, too.</p>
          <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <div className="contact-help"><h2>A few details go a long way.</h2><p>For support, tell us what happened, your app version, and your device model. Please leave out account numbers, balances, and other sensitive information.</p></div>
        <Link className="text-link" href="/privacy">Read our Privacy Policy </Link>
      </aside>
    </div>
  </main><Footer /></>;
}
