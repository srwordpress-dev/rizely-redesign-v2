import { HomeStructuredData } from "@/components/structured-data";
import Hero from "@/components/hero";
import Partners from "@/components/partners";
import HowItWorks from "@/components/how-it-works";
import ChatDemo from "@/components/chat-demo";
import TheCard from "@/components/the-card";
import WhyRizely from "@/components/why-rizely";
// Nov 2026: the drag-to-compare Proof is replaced by the scroll-scrubbed Pipeline
// (components/proof.tsx is kept, unused, so it can come back).
import Pipeline from "@/components/pipeline";
import Personas from "@/components/personas";
import ClaudeChat from "@/components/claude-chat";
import Pricing from "@/components/pricing";
import Faq from "@/components/faq";
import Footer from "@/components/footer";
import MobileCtaBar from "@/components/mobile-cta-bar";
import Motion from "@/components/motion";

/*
  Positioning: the homepage sells one thing to one buyer — event follow-up for
  sales and event teams — and only what works today. The card comes in as the
  add-on. The wider platform story (the agent hive, Connect for Claude, the
  roadmap) lives on /agents and /connect; the homepage shows only the
  Claude chat, as one more way to use what works today.
*/
export default function Home() {
  return (
    <main className="flex flex-col min-h-dvh">
      {/* Product + FAQ schema belongs on this page only — it is the page that
          shows them. Site-wide publisher schema stays in the root layout. */}
      <HomeStructuredData />
      {/* Sections alternate canvas and parchment (DESIGN.md: rhythm from the
          surface, not divider lines). */}
      <Hero />
      <Partners />
      {/* Dark rooms (Nov 2026): How it works, Why Rizely and Works with Claude sit
          on near-black so the page swings light / dark; product UI inside stays light. */}
      <div className="section-dark" data-room>
        <HowItWorks />
      </div>
      <ChatDemo />
      <div className="section-dark" data-room>
        <WhyRizely />
      </div>
      <Pipeline />
      <div className="bg-parchment">
        <Personas />
      </div>
      <div className="section-dark" data-room>
        <ClaudeChat />
      </div>
      <div className="bg-parchment">
        <TheCard />
      </div>
      <Pricing />
      <div className="bg-parchment">
        <Faq />
      </div>
      <Footer />
      <MobileCtaBar />
      <Motion />
    </main>
  );
}
