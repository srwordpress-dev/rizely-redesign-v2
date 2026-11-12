"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHero, { SectionHead } from "@/components/page-hero";
import { StartCta } from "@/components/start-cta";
import Scribble from "@/components/scribble";
import Motion from "@/components/motion";

/*
  /connect (Nov 2026 redesign, matching the homepage): asymmetric hero with the
  one hand-drawn underline, what you can do as an editorial grid (no icon
  tiles), where it works as two status lines, the three steps in a dark room,
  and the honest limits. Motion is the shared minimal set.
*/

const capabilities = [
  {
    title: "Add and update contacts",
    desc: "Share a card photo and Claude reads it and adds the contact, or describe someone in your own words. Editing a lead only changes the fields you name; nothing else is touched.",
  },
  {
    title: "Find and segment your pipeline",
    desc: "Ask for a slice by free text, event, tag, capture channel or date range, or only the leads that have a phone number or an email. Get the shortlist without opening a dashboard.",
  },
  {
    title: "Organise events",
    desc: "Create or close an event, list what's open, and pull every lead from one event.",
  },
  {
    title: "See what just came in",
    desc: "Pull your most recent scans with their fields and links to the card photo and any voice note, so you can review a batch straight after a show.",
  },
  {
    title: "Export to CSV",
    desc: "Get your contacts as a CSV, up to 500 at a time, to open in a spreadsheet or import anywhere. It's an export, not a sync.",
  },
  {
    title: "Check balance and top up",
    desc: "See your plan, balance and which WhatsApp or Telegram numbers are linked. Top up over UPI; the payment always finishes safely in your browser, never in the chat.",
  },
];

const steps = [
  {
    n: "1",
    title: "Start on WhatsApp",
    desc: "Send Rizely the cards from your last event to create your account and build a pipeline. Your first 50 scans are free.",
  },
  {
    n: "2",
    title: "Add Rizely in Claude",
    desc: "Add Rizely as a connector and sign in. It's OAuth, scoped to your own account, so you're always in control of access.",
  },
  {
    n: "3",
    title: "Just ask",
    desc: "“Add this card,” “show me leads from the Home Expo,” “export them to a sheet.” Contacts you add from Claude are tagged as added via Claude.",
  },
];

const limits = [
  "A pipeline search returns a focused shortlist, not your whole database. An export gives you up to 500 contacts at a time; the dashboard exports the rest.",
  "Export is one-way: a CSV copy of your contacts. It isn't a live sync.",
  "Payments always complete in your browser over UPI, never inside the chat.",
  "It's a window onto your pipeline, not a separate product: you'll need a Rizely account with WhatsApp or Telegram linked.",
  "Rizely's own card scanning runs in the WhatsApp or Telegram bot; in Claude, Claude reads the photo and adds the details itself.",
];

export default function ConnectPageContent() {
  return (
    <main className="flex min-h-dvh flex-col">
      <PageHero
        kicker={
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-spark" />
            Live on Claude today
          </span>
        }
        title={
          <>
            Run your pipeline from inside <Scribble>Claude</Scribble>
            <span className="text-spark">.</span>
          </>
        }
        lede="Rizely connects to the AI assistant you already use. Add and find contacts, organise events, pull an event's leads, export them and top up, all in plain language and without learning a dashboard. Live on Claude now; ChatGPT is next."
      >
        <StartCta size="lg" className="h-12 w-full px-6 text-base font-semibold sm:w-auto" />
        <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
          <Link href="#how-to-connect">How to connect</Link>
        </Button>
      </PageHero>

      {/* What you can do */}
      <section className="w-full border-t border-hairline">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHead kicker="What you can do" title="Your whole pipeline, in plain language." />
            <ul className="flex flex-col gap-2 text-[15px]" aria-label="Where it works">
              <li className="cn-where">
                <span className="cn-dot is-live" aria-hidden="true" />
                <b>Claude</b>
                <span>live now: web, desktop app and Claude Code</span>
              </li>
              <li className="cn-where">
                <span className="cn-dot" aria-hidden="true" />
                <b>ChatGPT</b>
                <span>next, once it works as well as Claude does</span>
              </li>
            </ul>
          </div>
          <ul className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <li key={c.title} data-wr-row className="relative flex flex-col gap-2 py-7">
                <span aria-hidden="true" className="wr-rule" />
                <h3 data-wr-body className="font-serif-display text-xl leading-snug sm:text-[1.375rem]">
                  {c.title}
                </h3>
                <p data-wr-body className="text-[15px] leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How to connect: three real steps, in a dark room. */}
      <div id="how-to-connect" className="section-dark scroll-mt-16" data-room>
        <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-24 md:px-8">
          <SectionHead kicker="How to connect" title="Three steps, no setup call." />
          <ol className="cn-steps mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s) => (
              <li key={s.n} data-wr-row className="relative flex flex-col gap-3 pt-8">
                <span aria-hidden="true" className="wr-rule" />
                <span data-wr-body className="cn-num">
                  {s.n}
                </span>
                <h3 data-wr-body className="font-serif-display text-2xl leading-tight">
                  {s.title}
                </h3>
                <p data-wr-body className="text-[15px] leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Honest limits */}
      <section className="w-full">
        <div className="mx-auto grid max-w-(--breakpoint-xl) gap-10 px-4 py-20 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHead kicker="Straight about the edges" title="What it does not do." />
          </div>
          <ul className="lg:col-span-8 border-b border-line">
            {limits.map((l) => (
              <li key={l} className="border-t border-line py-4 text-[16px] leading-relaxed text-muted-foreground">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close */}
      <section className="w-full border-t border-hairline">
        <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-6 px-4 py-20 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            title="Bring your event pipeline into the chat."
            sub="Start on WhatsApp, connect Rizely in Claude, and run your leads by asking. Your first 50 scans are free."
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <StartCta size="lg" className="h-12 px-6 text-base font-semibold" />
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <Link href="/agents">Meet the agents</Link>
            </Button>
          </div>
        </div>
      </section>
      <Motion />
    </main>
  );
}
