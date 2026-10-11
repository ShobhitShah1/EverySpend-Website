"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_DOWNLOAD_URL, assetUrl } from "@/lib/site";

export function EverySpendLanding() {
  return <main className="single-page" id="main">
    <header className="single-header">
      <Link className="single-brand" href="/">Money, made lighter.</Link>
      <div className="single-nav"><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link><ThemeToggle /></div>
    </header>
    <section className="single-intro" aria-labelledby="hero-title">
      <h1 id="hero-title">EverySpend</h1>
      <div className="intro-details">
        <h2>A clearer view.<br /><em>A calmer you.</em></h2>
        <div className="intro-action">
          <p>Your spending, balances and savings.<br />Together in one calm little place.</p>
          <a className="single-download" href={APP_DOWNLOAD_URL} target="_blank" rel="noreferrer">
            <svg className="play-store-icon" viewBox="0 0 24 26" aria-hidden="true">
              <path fill="#4285F4" d="M2 1.5 14 13 2 24.5Z" />
              <path fill="#34A853" d="M2 1.5 17 10 14 13Z" />
              <path fill="#FBBC04" d="m17 10 5 2.8c.8.5.8 1 0 1.5L17 17l-3-4Z" />
              <path fill="#EA4335" d="M2 24.5 14 13l3 4Z" />
            </svg><span>Download for Android</span><span className="download-arrow"><ArrowUpRight size={19} aria-hidden="true" /><ArrowRight size={19} aria-hidden="true" /></span>
          </a>
        </div>
      </div>
    </section>
    <div className="bottom-pouch"><Image src={assetUrl("/images/pouch-landing-body.png")} width={2172} height={724} sizes="100vw" priority alt="EverySpend’s smiling pouch" /></div>
  </main>;
}
