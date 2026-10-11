import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContactFormCard } from "@/components/ContactFormCard";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/site";
export const metadata: Metadata = { title: "Contact", description: "Contact EverySpend with questions, feedback, or support requests." };
export default function ContactPage() {
  return <><main className="document-page">
    <Link className="text-link" href="/"><ArrowLeft size={16} aria-hidden="true" />Back to EverySpend</Link>
    <header><h1>A little hello.</h1><p>A question, an idea, or something that needs fixing? We’d love to hear from you.</p></header>
    <div className="contact-layout"><ContactFormCard /><aside><h2>Prefer email?</h2><a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><p>For support, include what happened and your device details.</p></aside></div>
  </main><Footer /></>;
}
