"use client";

import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DASHBOARD_URL } from "@/lib/site";
import { RizelyLogo } from "@/components/logo";
import { StartCta } from "@/components/start-cta";

// Absolute hrefs, not bare "#how": these render on /blogs and /privacy too,
// where a bare hash would resolve to /blogs#how and go nowhere.
const menuItems = [
  { name: "How it works", href: "/#how" },
  { name: "Pricing", href: "/#pricing" },
  { name: "NFC cards", href: "/#card" },
  // Kept from main: the blog is live and already linked from rizely.net, so
  // dropping it here would orphan published posts.
  { name: "Blog", href: "/blogs" },
  { name: "FAQ", href: "/#faq" },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showNavbarBlur = isScrolled || isMenuOpen;

  /*
    GSAP micro-interactions (Nov 2026). GSAP loads after the page is up; until
    then (and with reduced motion) the links keep their plain CSS hover.
      - one pill slides behind whichever link the pointer is on
      - the "Start free" button leans a few px toward the pointer
      - in-page links scroll smoothly, clearing the sticky bar; a click presses the pill
      - the mobile menu's links arrive one after another
  */
  type G = typeof import("gsap").gsap;
  const gsapRef = useRef<G | null>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fine = useRef(false);
  const reduce = useRef(true);

  useEffect(() => {
    let alive = true;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce.current) return;
    (async () => {
      const [{ gsap }, { ScrollToPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollToPlugin"),
      ]);
      if (!alive) return;
      gsap.registerPlugin(ScrollToPlugin);
      gsapRef.current = gsap;
      linksRef.current?.setAttribute("data-gsap", "");
    })();
    return () => {
      alive = false;
    };
  }, []);

  const movePill = (el: HTMLElement) => {
    const g = gsapRef.current;
    const pill = pillRef.current;
    const box = linksRef.current;
    if (!g || !pill || !box || !fine.current) return;
    const r = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const first = pill.style.opacity === "" || pill.style.opacity === "0";
    g.to(pill, {
      x: r.left - b.left,
      width: r.width,
      opacity: 1,
      duration: first ? 0 : 0.35,
      ease: "expo.out",
      overwrite: "auto",
    });
  };
  const hidePill = () => {
    const g = gsapRef.current;
    if (g && pillRef.current) g.to(pillRef.current, { opacity: 0, duration: 0.2, ease: "power1.out" });
  };

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const g = gsapRef.current;
    if (g && pillRef.current && fine.current) {
      g.fromTo(pillRef.current, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: "expo.out" });
    }
    // Smooth-scroll only for anchors on this page; everything else navigates as usual.
    if (!g || !href.startsWith("/#") || window.location.pathname !== "/") return;
    const target = document.querySelector(href.slice(1));
    if (!target) return;
    e.preventDefault();
    setIsMenuOpen(false);
    g.to(window, { duration: 0.9, ease: "power3.inOut", scrollTo: { y: target, offsetY: 72 } });
    history.replaceState(null, "", href.slice(1));
  };

  const onCtaMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const g = gsapRef.current;
    const el = ctaRef.current;
    if (!g || !el || !fine.current) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
    g.to(el, { x: Math.max(-6, Math.min(6, dx)), y: Math.max(-4, Math.min(4, dy)), duration: 0.3, ease: "power3.out" });
  };
  const onCtaLeave = () => {
    const g = gsapRef.current;
    if (g && ctaRef.current) g.to(ctaRef.current, { x: 0, y: 0, duration: 0.5, ease: "expo.out" });
  };

  // Mobile menu: links arrive one after another once the panel opens.
  useEffect(() => {
    const g = gsapRef.current;
    if (!isMenuOpen || !g || !menuRef.current) return;
    g.from(menuRef.current.querySelectorAll("[data-menu-item]"), {
      y: 10,
      opacity: 0,
      duration: 0.35,
      ease: "expo.out",
      stagger: 0.04,
      delay: 0.08,
    });
  }, [isMenuOpen]);

  return (
    <>
    <nav
      className={`sticky top-0 z-50 w-full transition-[background-color,backdrop-filter,border-color] duration-300 ease-out ${
        isMenuOpen
          ? "bg-parchment border-b border-hairline"
          : showNavbarBlur
          ? "bg-parchment border-b border-hairline"
          : "bg-canvas border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isMenuOpen ? (
                  <Cross1Icon aria-hidden="true" />
                ) : (
                  <HamburgerMenuIcon aria-hidden="true" />
                )}
              </motion.div>
            </Button>
          </div>

          {/* Below lg the hamburger sits left and the right slot is empty, so
              justify-between left the logo off centre. Pin it to the middle there;
              from lg up it rejoins the flex row. shrink-0 so a crowded row can
              never squeeze it to 0px (W-30). */}
          <Link
            href="/"
            aria-label="Rizely home"
            className="absolute left-1/2 -translate-x-1/2 shrink-0 lg:static lg:translate-x-0"
          >
            <RizelyLogo priority />
          </Link>

          {/* Logo + six links + the CTA need roughly 900px, so the full row starts at
              lg (1024px); below that it is the hamburger menu (W-30). */}
          <div
            ref={linksRef}
            onMouseLeave={hidePill}
            className="nav-links relative hidden lg:flex items-center space-x-6"
          >
            <span ref={pillRef} aria-hidden="true" className="nav-pill" />
            {menuItems.map((item) => (
              <Button key={item.name} asChild variant="ghost" size="sm" className="relative">
                <Link
                  href={item.href}
                  onMouseEnter={(e) => movePill(e.currentTarget)}
                  onFocus={(e) => movePill(e.currentTarget)}
                  onClick={(e) => onLinkClick(e, item.href)}
                >
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>

          <div ref={ctaRef} onMouseMove={onCtaMove} onMouseLeave={onCtaLeave} className="flex items-center">
            {/* One filled button, for new visitors; it opens the app, where sign-up lives. */}
            <Button asChild size="sm" className="hidden lg:flex">
              <Link href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
                Start free
              </Link>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div ref={menuRef} className="px-2 pt-2 pb-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-menu-item
                    className="flex min-h-11 items-center px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={(e) => {
                      onLinkClick(e, item.href);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* The menu shows below lg. Same CTA as the hero (start-cta.tsx). */}
                <div className="flex flex-col pt-2">
                  <StartCta size="sm" className="w-full" onClick={() => setIsMenuOpen(false)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>

      {/* Dimming backdrop behind the open mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden
            className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-ink/40"
          />
        )}
      </AnimatePresence>
    </>
  );
}
