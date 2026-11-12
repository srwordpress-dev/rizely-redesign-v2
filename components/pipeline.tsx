"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import "@/app/pipeline.css";

/*
  04 · What one event turns into: the pile becomes a pipeline (Nov 2026, option 1).
  Design: claude.ai/artifact/HgGBmS9CowLmZKfw9ojHJU (Pipeline board).

  A scattered stack of cards, a "follow up???" note and a DAY 14 calendar sit
  on the left. As you scroll, the section pins for about one screen and GSAP
  ScrollTrigger scrubs one progress value p (0 to 1): the cards fly one by one
  into a WhatsApp phone whose "filed" counter climbs to 80, lead rows slide out
  on the right with "Draft ready", then turn "Sent". Scrolling back reverses it.

  The scene is drawn at a fixed size (wide 1100 x 500, narrow 360 x 700 under
  640px) and scaled to its frame, whose size is pure CSS (no layout shift).
  Positions are written straight to the DOM on each scroll update, so React
  does not re-render 20 elements per frame. Server HTML, no JS and reduced
  motion all show the finished pipeline (p = 1).

  Honest by design: "80 cards" and the names are the same made-up example the
  page has always used; no percentages, replies or outcomes are claimed.
*/

type Layout = {
  w: number;
  h: number;
  card: [number, number];
  mess: [number, number, number][];
  phone: { x: number; y: number; w: number; h: number };
  into: [number, number];
  rows: number;
  rowBox: { x: number; y: number; w: number; h: number; gap: number };
  rowFrom: [number, number];
  note: [number, number];
  day: [number, number];
};

const WIDE: Layout = {
  w: 1100,
  h: 500,
  card: [140, 86],
  mess: [[24, 56, -14], [110, 40, 9], [200, 100, -5], [30, 150, 18], [150, 180, -11], [250, 190, 7], [20, 260,
    -8], [120, 275, 13], [230, 290, -17], [50, 360, 6], [170, 380, -9], [290, 390, 15], [80, 210, -3], [300, 120, 11]],
  phone: { x: 470, y: 46, w: 172, h: 370 },
  into: [486, 190],
  rows: 6,
  rowBox: { x: 700, y: 52, w: 376, h: 56, gap: 66 },
  rowFrom: [520, 200],
  note: [270, 320],
  day: [380, 60],
};

const NARROW: Layout = {
  w: 360,
  h: 720,
  card: [112, 70],
  mess: [[10, 50, -12], [90, 36, 8], [180, 60, -6], [20, 120, 14], [120, 130, -10], [230, 120, 6], [40, 200, -5], [150, 205, 11]],
  phone: { x: 110, y: 300, w: 140, h: 214 },
  into: [124, 360],
  rows: 3,
  rowBox: { x: 10, y: 548, w: 340, h: 50, gap: 56 },
  rowFrom: [110, 430],
  note: [228, 196],
  day: [270, 30],
};

const LEADS = [
  ["Ananya Rao", "Kestrel Labs"],
  ["Arjun Desai", "Kestrel Labs"],
  ["Vikram Shah", "Northwind Exports"],
  ["Meera Iyer", "Bluefin Tools"],
  ["Rohan Mehta", "Tidewater Foods"],
  ["Sara Thomas", "Pinecone Studio"],
];

// Screen chrome around the pinned scene: the sticky nav (64px), plus on phones
// the bottom "Start on your WhatsApp" bar (~84px), plus breathing room.
const NAV_H = 64;
const CHROME_WIDE = NAV_H + 24;
const CHROME_PHONE = NAV_H + 84 + 24;

const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Every moving value for a given progress p, for one layout.
function frameAt(L: Layout, p: number) {
  const n = L.mess.length;
  const cards = L.mess.map(([x, y, r], i) => {
    const t = ease(cl((p - (i / n) * 0.5) / 0.28));
    const s = lerp(1, 0.3, cl((t - 0.55) / 0.45));
    return {
      transform: `translate(${lerp(x, L.into[0], t).toFixed(1)}px,${lerp(y, L.into[1], t).toFixed(1)}px) rotate(${lerp(r, 0, t).toFixed(1)}deg) scale(${s.toFixed(3)})`,
      opacity: t > 0.96 ? 0 : 1,
    };
  });
  const rows = Array.from({ length: L.rows }, (_, i) => {
    const t = ease(cl((p - 0.48 - i * 0.05) / 0.2));
    const x = lerp(L.rowFrom[0], L.rowBox.x, t);
    const y = lerp(L.rowFrom[1], L.rowBox.y + i * L.rowBox.gap, t);
    return {
      transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${lerp(0.4, 1, t).toFixed(3)})`,
      opacity: t < 0.02 ? 0 : 1,
      ghost: 1 - t,
      sent: p > 0.8 + i * 0.03,
    };
  });
  return {
    cards,
    rows,
    mess: 1 - cl(p * 1.7),
    filed: Math.round(cl((p - 0.06) / 0.62) * 80),
    drafts: cl((p - 0.45) * 5),
    done: cl((p - 0.9) * 10),
    late: p > 0.5,
  };
}

export default function Pipeline() {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const [maxW, setMaxW] = useState<number | undefined>(undefined);
  const layoutRef = useRef<Layout>(WIDE);
  const L = narrow ? NARROW : WIDE;
  layoutRef.current = L;

  // Write one progress value straight to the DOM.
  const apply = (p: number) => {
    const el = stage.current;
    if (!el) return;
    const f = frameAt(layoutRef.current, p);
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
      if (!f.cards[i]) return;
      c.style.transform = f.cards[i].transform;
      c.style.opacity = String(f.cards[i].opacity);
    });
    el.querySelectorAll<HTMLElement>("[data-row]").forEach((r, i) => {
      if (!f.rows[i]) return;
      r.style.transform = f.rows[i].transform;
      r.style.opacity = String(f.rows[i].opacity);
      r.querySelector("[data-pill]")?.classList.toggle("is-sent", f.rows[i].sent);
      const label = r.querySelector("[data-pill]");
      if (label) label.textContent = f.rows[i].sent ? "Sent ✓" : "Draft ready";
    });
    el.querySelectorAll<HTMLElement>("[data-ghost]").forEach((g, i) => {
      if (f.rows[i]) g.style.opacity = f.rows[i].ghost.toFixed(3);
    });
    el.querySelectorAll<HTMLElement>("[data-mess]").forEach((m) => (m.style.opacity = f.mess.toFixed(3)));
    const filed = el.querySelector("[data-filed]");
    if (filed) filed.textContent = String(f.filed);
    const drafts = el.querySelector<HTMLElement>("[data-drafts]");
    if (drafts) drafts.style.opacity = f.drafts.toFixed(2);
    const done = el.querySelector<HTMLElement>("[data-done]");
    if (done) done.style.opacity = f.done.toFixed(2);
    el.classList.toggle("is-late", f.late);
  };

  // Size: the frame's box is CSS; the scene scales into it.
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => {
      // The wide scene needs ~760px to stay legible (its smallest text is 12px at
      // full size); below that the tall phone scene is used, tablets included.
      const parent = el.parentElement;
      const cs = parent ? getComputedStyle(parent) : null;
      const avail = parent && cs ? parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) : el.clientWidth;
      const n = avail < 760;
      setNarrow(n);
      // Phones: the tall scene must fit between the sticky nav and the bottom
      // WhatsApp bar while it is pinned, so cap its width by the screen height.
      setMaxW(n ? Math.round(Math.max(280, Math.min(420, (window.innerHeight - CHROME_PHONE) * (NARROW.w / NARROW.h)))) : undefined);
      setScale(el.clientWidth / (n ? NARROW.w : WIDE.w));
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Motion: GSAP pins the frame and scrubs p with the scroll.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let kill = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (!alive || !frame.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const chrome = () => (window.innerWidth < 640 ? CHROME_PHONE : CHROME_WIDE);
      const fits = () => (frame.current?.offsetHeight ?? 0) <= window.innerHeight - chrome();
      const pinTop = () => {
        const fh = frame.current?.offsetHeight ?? 0;
        return Math.round(NAV_H + Math.max(8, (window.innerHeight - chrome() - fh) / 2));
      };
      apply(0);
      const st = ScrollTrigger.create({
        trigger: frame.current,
        // Pinned just below the sticky nav, centred in the space that is left.
        // A screen too short for the scene (rare) scrubs it without pinning.
        start: () => (fits() ? `top ${pinTop()}px` : "top 85%"),
        end: () => (fits() ? "+=" + Math.round(window.innerHeight * 0.95) : "bottom 35%"),
        pin: fits(),
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      kill = () => st.kill();
    })();
    return () => {
      alive = false;
      kill();
    };
    // apply reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A layout switch redraws at the current progress (the trigger refreshes itself).
  const f = frameAt(L, 1);

  return (
    <section className="w-full max-w-(--breakpoint-xl) mx-auto px-4 py-24 md:px-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: "spring", bounce: 0 }}
        className="mx-auto mb-10 flex w-full max-w-[1100px] flex-col gap-3 text-left sm:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
      >
        <h2 className="text-3xl font-heading font-bold sm:text-4xl tracking-tight">
          What one event turns into.
        </h2>
        <p className="text-muted-foreground text-lg lg:max-w-md lg:text-right">
          80 cards from one expo: out of your pocket, into WhatsApp, back as follow-ups ready to send.
        </p>
      </motion.div>

      <div
        ref={frame}
        role="img"
        aria-label="A scattered pile of 80 business cards goes into WhatsApp, where Rizely files them under the event; leads come out with drafts ready, then marked sent."
        className={`pl-frame ${narrow ? "is-narrow" : ""}`}
        style={maxW ? { maxWidth: maxW } : undefined}
      >
        <div
          ref={stage}
          className="pl-stage is-late"
          aria-hidden="true"
          style={{ width: L.w, height: L.h, transform: `scale(${scale})`, opacity: ready ? 1 : 0 }}
        >
          <span className="pl-tag" data-mess style={{ opacity: f.mess }}>
            your jacket pocket, Monday
          </span>
          <div className="pl-note" data-mess style={{ left: L.note[0], top: L.note[1], opacity: f.mess }}>
            follow up???<span>…next week</span>
          </div>
          <div className="pl-day" data-mess style={{ left: L.day[0], top: L.day[1], opacity: f.mess }}>
            <span>DAY</span>
            <b>14</b>
          </div>

          {L.mess.map((_, i) => (
            <div
              key={i}
              data-card
              className="pl-card"
              style={{ width: L.card[0], height: L.card[1], transform: f.cards[i].transform, opacity: f.cards[i].opacity }}
            >
              <span />
              <span />
              <span />
            </div>
          ))}

          <div className="pl-phone" style={{ left: L.phone.x, top: L.phone.y, width: L.phone.w, height: L.phone.h }}>
            <div className="pl-screen">
              <div className="pl-chat-head">
                <span className="pl-avatar" />
                <b>Rizely</b>
              </div>
              <div className="pl-chat">
                <span className="pl-out">Photos: cards from the expo</span>
                <span className="pl-in">
                  <b data-filed>{f.filed}</b> filed under
                  <br />
                  Tech Expo Pune
                </span>
                <span className="pl-in" data-drafts style={{ opacity: f.drafts }}>
                  Drafts ready in their language
                </span>
              </div>
            </div>
          </div>

          {/* Where the leads will land: dashed outlines that fade as each row arrives. */}
          {LEADS.slice(0, L.rows).map(([name], i) => (
            <div
              key={`g-${name}`}
              data-ghost
              className="pl-ghost"
              style={{
                left: L.rowBox.x,
                top: L.rowBox.y + i * L.rowBox.gap,
                width: L.rowBox.w,
                height: L.rowBox.h,
                opacity: f.rows[i].ghost,
              }}
            />
          ))}

          {LEADS.slice(0, L.rows).map(([name, co], i) => (
            <div
              key={name}
              data-row
              className="pl-row"
              style={{ width: L.rowBox.w, height: L.rowBox.h, transform: f.rows[i].transform, opacity: f.rows[i].opacity }}
            >
              <span>
                <b>{name}</b>
                <small>{co}</small>
              </span>
              <em data-pill className={`pl-pill ${f.rows[i].sent ? "is-sent" : ""}`}>
                {f.rows[i].sent ? "Sent ✓" : "Draft ready"}
              </em>
            </div>
          ))}

          <span className="pl-done" data-done style={{ opacity: f.done }}>
            same evening
          </span>
        </div>
      </div>

      {/* Early-access honesty note — no invented proof. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mx-auto mt-8 max-w-4xl rounded-2xl border border-dashed border-border bg-card p-5 text-center"
      >
        <p className="inline-flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles aria-hidden="true" className="size-4 text-brand-amber" />
          <span>
            <span className="font-medium text-foreground">Early access.</span> Real, logged event
            stories will land here, not invented numbers or stock testimonials.
          </span>
        </p>
      </motion.div>
    </section>
  );
}
