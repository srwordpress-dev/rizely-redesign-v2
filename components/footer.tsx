"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND, SHOP_URL } from "@/lib/site";
import { OPEN_EVENT } from "@/components/cookie-consent";
import { StartCta } from "@/components/start-cta";
import "@/app/footer.css";

/*
  The sign-off footer (Nov 2026, option A).
  Design: claude.ai/artifact/EL2GuRanjHv2TEa4tYa5YC (SignOff board).

  One dark block: the closing line and CTA flow straight into the footer, so
  the page ends on the same dark as its other rooms. Three groups stay:
  Explore (links), Why Rizely (four claims, larger), Built for India (an orange
  stamp with a cycling language word and the GST / UPI / DPDP facts). The real
  logo closes the page, set large and faint; components/motion.tsx lifts it and
  staggers the rows in on the homepage. Reduced motion: nothing cycles or moves.

  Only facts already on the site. The QR (public/whatsapp-qr.svg) encodes the
  same wa.me link as WHATSAPP_URL and shows from 640px up; phones get the
  "Start on your WhatsApp" button instead.
*/

// Absolute, for the same reason as the navbar: the footer renders on the
// legal and blog pages, where a bare hash anchor resolves nowhere.
const LINKS = [
  { name: "How it works", href: "/#how" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Agents", href: "/agents" },
  { name: "Connect to Claude", href: "/connect" },
  { name: "FAQ", href: "/#faq" },
  { name: "Blog", href: "/blogs" },
  { name: "Buy a card", href: SHOP_URL },
];

// Annual or per-event only, never monthly: RBI e-mandates make monthly
// subscriptions hostile in India.
const WHY = [
  ["Capture and follow-up in one flow", "From the photo to the draft, no CRM in between"],
  ["Reads cards in many languages", "Hindi, Gujarati, Marathi and English"],
  ["Per-event or annual pricing", "Pay for the show, not the year"],
  ["WhatsApp, Telegram or Claude", "Run it where you already work"],
];

const LANGS = [
  { word: "English", cls: "" },
  { word: "हिंदी", cls: "ft-deva", lang: "hi" },
  { word: "ગુજરાતી", cls: "ft-guj", lang: "gu" },
  { word: "मराठी", cls: "ft-deva", lang: "mr" },
];

function istNow() {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

export default function Footer() {
  const year = new Date().getFullYear();
  // Client-only values start empty so server and first client render match.
  const [clock, setClock] = useState("");
  const [lang, setLang] = useState(0);

  useEffect(() => {
    setClock(istNow());
    const c = window.setInterval(() => setClock(istNow()), 30_000);
    let l = 0;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      l = window.setInterval(() => setLang((v) => (v + 1) % LANGS.length), 2200);
    }
    return () => {
      window.clearInterval(c);
      window.clearInterval(l);
    };
  }, []);

  const L = LANGS[lang];

  return (
    <footer className="ft">
      {/* The close: the page's last dark room. */}
      <div data-closing-cta className="ft-close">
        <h2 data-light-words className="ft-close-title">
          Meet someone today. Follow up tonight<span className="text-spark">.</span>
        </h2>
        <p className="ft-close-sub">It works inside the WhatsApp you already have open.</p>
        <div className="ft-close-ctas">
          <StartCta size="lg" className="h-12 px-6 text-base font-semibold" />
          <span className="ft-or" aria-hidden="true">
            or
          </span>
          <div className="ft-qr">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, a tiny SVG */}
            <img src="/whatsapp-qr.svg" alt="QR code that opens the Rizely chat on WhatsApp" width={84} height={84} />
            <span>
              <b>Scan to start on your WhatsApp</b>
              <span>opens the chat on your phone</span>
            </span>
          </div>
        </div>
      </div>

      <div className="ft-inner">
        <div className="ft-grid">
          <div className="ft-brand">
            <Link href="/" aria-label="Rizely home" className="inline-flex">
              <Image src="/rizely-logo-dark.png" alt={BRAND} width={200} height={58} className="h-7 w-auto" />
            </Link>
            <p>
              Your card, the cards you collect and the follow-up, inside the WhatsApp you already
              use. Priced per event.
            </p>
            <span className="ft-clock" aria-label={clock ? `Pune, ${clock} India time` : undefined}>
              <span className="ft-dot" aria-hidden="true" />
              Pune · {clock || "--:--"} IST
            </span>
          </div>

          <nav aria-label="Explore" className="ft-col">
            <h3 className="ft-head">Explore</h3>
            {LINKS.map((l) => (
              <Link key={l.name} href={l.href} className="ft-link">
                {l.name}
                <span className="ft-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="ft-col">
            <h3 className="ft-head">Why Rizely</h3>
            <ul className="ft-why">
              {WHY.map(([t, s]) => (
                <li key={t} data-ft-row>
                  <b>{t}</b>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-col">
            <h3 className="ft-head">Built for India</h3>
            <div className="ft-stamp" data-ft-row>
              <div className="ft-stamp-in">
                <div className="ft-stamp-top">
                  <b>INDIA · भारत</b>
                  <b>Rizely</b>
                </div>
                <p className="ft-stamp-lang">
                  <span>Follow-ups in</span>{" "}
                  <b key={L.word} className={`ft-word ${L.cls}`} lang={L.lang}>
                    {L.word}
                  </b>
                </p>
                <ul className="ft-chips">
                  <li>GST invoice</li>
                  <li>UPI at checkout</li>
                  <li>DPDP in mind</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <span>
            © {year} {BRAND}. All rights reserved.
          </span>
          <span className="ft-signoff">Made in India, for people who meet people.</span>
          <span className="ft-legal">
            <Link href="/privacy" className="ft-link ft-link-sm">
              Privacy
            </Link>
            <Link href="/terms" className="ft-link ft-link-sm">
              Terms
            </Link>
            {/* Reopens the cookie banner (components/cookie-consent.tsx). Shown only
                where analytics are configured, since that is the only place it does anything. */}
            {process.env.NEXT_PUBLIC_GTM_ID && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
                className="ft-link ft-link-sm"
              >
                Cookie settings
              </button>
            )}
          </span>
        </div>
      </div>

      {/* The real logo, large and faint, closing the page. Decorative. */}
      <div className="ft-mark" aria-hidden="true">
        <Image data-ft-logo src="/rizely-logo-dark.png" alt="" width={200} height={58} className="ft-mark-img" />
      </div>
    </footer>
  );
}
