"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHero, { SectionHead } from "@/components/page-hero";
import { StartCta } from "@/components/start-cta";
import Motion from "@/components/motion";

/*
  /agents (Nov 2026 redesign, matching the homepage): asymmetric hero, a short
  "one job each" statement, then the agents as an editorial list in a dark
  room, the way Why Rizely is on the homepage. Only the Card Agent is live;
  everything else is labelled for what it is. Motion is the shared minimal set
  (heading lines, the dark room opening, the list rules drawing, the footer).
*/

type Status = "live" | "roadmap" | "exploring";

const statusLabel: Record<Status, string> = {
  live: "Live",
  roadmap: "On the roadmap",
  exploring: "Exploring",
};

type Agent = { name: string; status: Status; job: string; body: string; limits?: string };

const agents: Agent[] = [
  {
    name: "The Card Agent",
    status: "live",
    job: "Reads the card, files the lead, drafts the follow-up.",
    body: "Photograph a business card in WhatsApp or Telegram. It reads the card (Indian-language cards too, not just English), turns it into a clean lead with name, company, role, phone, email and event, and files it into your pipeline. Then it drafts a personal follow-up for each person, ready for you to read, edit and send on WhatsApp or Telegram.",
    limits:
      "Honest limits: a badly printed or damaged card can still need a human glance, so check the details before you send the follow-up.",
  },
  {
    name: "The Keeper",
    status: "roadmap",
    job: "Keeps your contacts from going stale.",
    body: "It enriches each lead, fills the gaps the card left blank, and updates the record when someone switches company or role: a CRM that maintains itself instead of nagging you to. Early enrichment already runs inside the Card Agent; the Keeper turns it into an agent of its own.",
  },
  {
    name: "The Reviews Agent",
    status: "roadmap",
    job: "Turns happy customers into real Google reviews.",
    body: "For local businesses: clinics, showrooms, neighbourhood shops. The honest way only. No fake reviews, no review-gating, no “we'll remove the bad ones”: those break Google's rules and India's consumer-protection rules, so we won't build them.",
  },
  {
    name: "The Caller",
    status: "roadmap",
    job: "Follow-up calls when a message isn't enough.",
    body: "An agent that makes and takes follow-up calls, so the hot leads don't go cold while you're stuck on the expo floor. This is the furthest out; we'll only claim it when it's real.",
  },
  {
    name: "More on the way",
    status: "exploring",
    job: "Partner channels and a referral agent.",
    body: "Directional, not promised. When one is real, it gets its own row above.",
  },
];

export default function AgentsPageContent() {
  return (
    <main className="flex min-h-dvh flex-col">
      <PageHero
        kicker="The agents"
        title={
          <>
            Small agents. Real work. One raises your business<span className="text-spark">.</span>
          </>
        }
        lede="Rizely is a set of small AI agents, each built to own one job well and report to you where you already are: WhatsApp and Telegram. Here's what's live today and what's coming, told straight."
      >
        <StartCta size="lg" className="h-12 w-full px-6 text-base font-semibold sm:w-auto" />
        <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
          <Link href="/connect">See it run from Claude</Link>
        </Button>
      </PageHero>

      {/* One job each: the idea in one statement. */}
      <section className="w-full border-t border-hairline">
        <div className="mx-auto grid max-w-(--breakpoint-xl) gap-6 px-4 py-16 md:px-8 lg:grid-cols-12 lg:gap-12">
          <p className="big-hook lg:col-span-5" style={{ whiteSpace: "normal" }}>
            One job each<span className="dot">.</span>
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-3">
            Most software asks you to learn a big dashboard and do the work yourself. Rizely flips
            that: instead of one bloated app, you get focused agents, each with one job. Today that's
            reading the cards. Keeping contacts fresh, growing reviews and making calls come next. We
            ship each one when it actually works, not before.
          </p>
        </div>
      </section>

      {/* The agents, as an editorial list in a dark room. */}
      <div className="section-dark" data-room>
        <section className="mx-auto grid max-w-(--breakpoint-xl) gap-10 px-4 py-24 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <SectionHead kicker="What's live, what's next" title="One agent works today. The rest are on the way." />
          </div>
          <ol className="lg:col-span-8 border-b border-[var(--line-strong)]">
            {agents.map((a) => {
              const live = a.status === "live";
              return (
                <li key={a.name} data-wr-row className="relative flex flex-col gap-3 py-8">
                  <span aria-hidden="true" className="wr-rule" />
                  <div data-wr-body className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif-display text-2xl leading-tight sm:text-[1.75rem]">{a.name}</h3>
                    <span className={`ag-status ${live ? "is-live" : ""}`}>{statusLabel[a.status]}</span>
                  </div>
                  <div data-wr-body className="flex flex-col gap-2">
                    <p className="text-[17px] font-medium text-foreground">{a.job}</p>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{a.body}</p>
                    {a.limits ? (
                      <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{a.limits}</p>
                    ) : null}
                    {live ? (
                      <div className="flex pt-3">
                        <StartCta />
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {/* Close */}
      <section className="w-full">
        <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-6 px-4 py-20 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            title="Start with the one that's live."
            sub="Your first 50 scans are free, inside the WhatsApp you already have open. Try it on the cards from your last event."
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <StartCta size="lg" className="h-12 px-6 text-base font-semibold" />
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <Link href="/connect">See it run from Claude</Link>
            </Button>
          </div>
        </div>
      </section>
      <Motion />
    </main>
  );
}
