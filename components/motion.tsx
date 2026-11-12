"use client";

import { useEffect } from "react";

/*
  The page's GSAP layer (Nov 2026). One component, mounted once at the end of the
  homepage; GSAP, ScrollTrigger and SplitText load as a separate chunk after the
  page is up, so nothing here touches first paint or the hero.

  Six moments, all transform / opacity / clip-path:
    1. Dark rooms open: each [data-room] grows from an inset rounded panel to
       full width as it scrolls in (scrubbed).
    2. The big clock runs: done in how-it-works.tsx with the timeline's own clock.
    3. Section headings rise line by line from a mask (once). Not the hero H1.
    4. Why Rizely: each row's rule draws left to right, then the row settles.
    5. Product windows lift: Claude window and card photo (scrubbed).
    6. The closing line lights up word by word (scrubbed).

  Everything sits inside gsap.matchMedia("(prefers-reduced-motion: no-preference)"):
  with reduced motion, or before JS, the page is simply finished and still.
*/
export default function Motion() {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      await document.fonts.ready;
      if (cancelled) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Dark rooms open.
        gsap.utils.toArray<HTMLElement>("[data-room]").forEach((room) => {
          gsap.fromTo(
            room,
            { clipPath: "inset(0% 4% 0% 4% round 28px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: { trigger: room, start: "top 95%", end: "top 30%", scrub: 0.4 },
            },
          );
        });

        // 3. Headings rise from a mask (section h2s only).
        gsap.utils.toArray<HTMLElement>("main h2:not([data-light-words])").forEach((h) => {
          SplitText.create(h, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 100,
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.08,
                scrollTrigger: { trigger: h, start: "top 88%", once: true },
              });
            },
          });
        });

        // 4. Why Rizely rules draw, then each row settles.
        gsap.utils.toArray<HTMLElement>("[data-wr-row]").forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } });
          tl.from(row.querySelector(".wr-rule"), { scaleX: 0, duration: 0.7, ease: "expo.out" }).from(
            row.querySelectorAll("[data-wr-body]"),
            { y: 14, opacity: 0, duration: 0.6, ease: "expo.out", stagger: 0.08 },
            "-=0.45",
          );
        });

        // 5. Product windows lift.
        gsap.utils.toArray<HTMLElement>(".cc-window, .card-stage").forEach((w) => {
          gsap.fromTo(
            w,
            { y: 40, scale: 0.96 },
            {
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: w, start: "top 98%", end: "top 55%", scrub: 0.4 },
            },
          );
        });

        // 7. Footer: its rows settle one by one, and the big logo rises into the
        //    page's bottom edge as you reach the end (scrubbed).
        gsap.utils.toArray<HTMLElement>("[data-ft-row]").forEach((row, i) => {
          gsap.from(row, {
            y: 16,
            opacity: 0,
            duration: 0.6,
            ease: "expo.out",
            delay: (i % 4) * 0.07,
            scrollTrigger: { trigger: row, start: "top 92%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-ft-logo]").forEach((logo) => {
          gsap.fromTo(
            logo,
            { yPercent: 45, opacity: 0 },
            {
              yPercent: 0,
              opacity: 0.14,
              ease: "none",
              scrollTrigger: { trigger: logo.parentElement, start: "top bottom", end: "bottom bottom", scrub: 0.4 },
            },
          );
        });

        // 6. The closing line lights up word by word.
        gsap.utils.toArray<HTMLElement>("[data-light-words]").forEach((h) => {
          SplitText.create(h, {
            type: "words",
            autoSplit: true,
            onSplit(self) {
              return gsap.fromTo(
                self.words,
                { opacity: 0.2 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.12,
                  scrollTrigger: { trigger: h, start: "top 85%", end: "top 45%", scrub: 0.3 },
                },
              );
            },
          });
        });
      });

      cleanup = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
