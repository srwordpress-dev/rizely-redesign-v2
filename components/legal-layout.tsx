import Link from "next/link";
import Footer from "@/components/footer";
import LegalToc from "@/components/legal-toc";

/*
  /privacy and /terms (Nov 2026 redesign, matching the homepage): a left-aligned
  head with the orange label, the draft notice as a peach note, then the text in
  a readable column with a sticky "On this page" beside it on desktop. Legal
  pages stay still: no scroll animation.
*/
export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="w-full border-b border-hairline">
        <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-5 px-4 pt-14 pb-12 md:px-8 md:pt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="legal-back">
              <span aria-hidden="true">←</span> Back to Rizely
            </Link>
            <span className="kicker">Legal</span>
            <h1 className="text-[2.5rem] leading-[1.05] md:text-6xl">
              {title}
              <span className="text-spark">.</span>
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          </div>
          <div className="legal-note">
            <b>Draft for review.</b> This is a starting template written for Rizely&apos;s current
            product. Please have it reviewed by legal counsel before you rely on it.
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-10 px-4 pt-12 pb-24 md:px-8 lg:grid-cols-12 lg:gap-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <LegalToc target="#legal-text" />
        </aside>
        <article id="legal-text" className="legal-prose lg:col-span-8 lg:col-start-5 text-muted-foreground">
          {children}
        </article>
      </div>
      <Footer />
    </main>
  );
}
