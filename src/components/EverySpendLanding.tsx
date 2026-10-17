import Link from "next/link";
import { PouchMascot } from "@/components/PouchMascot";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_DOWNLOAD_URL } from "@/lib/site";

export function EverySpendLanding() {
  return <main className="single-page" id="main">
    <header className="single-header">
      <Link className="single-brand" href="/">Money, made lighter.</Link>
      <nav className="single-nav" aria-label="Main navigation"><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link><ThemeToggle /></nav>
    </header>
    <section className="single-intro" aria-labelledby="hero-title">
      <h1 id="hero-title" aria-label="EverySpend"><span>Every</span><em>Spend</em></h1>
      <div className="intro-details">
        <p>Your spending, balances and savings. Together in one calm little place.</p>
          <a className="single-download" href={APP_DOWNLOAD_URL} target="_blank" rel="noreferrer">
            <svg className="play-store-icon" viewBox="0 0 24 26" aria-hidden="true">
              <path fill="#4285F4" d="M2 1.5 14 13 2 24.5Z" />
              <path fill="#34A853" d="M2 1.5 17 10 14 13Z" />
              <path fill="#FBBC04" d="m17 10 5 2.8c.8.5.8 1 0 1.5L17 17l-3-4Z" />
              <path fill="#EA4335" d="M2 24.5 14 13l3 4Z" />
            </svg><span>Download for Android</span>
          </a>
      </div>
    </section>
    <PouchMascot />
  </main>;
}
