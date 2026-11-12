"use client";

import { useEffect, useState } from "react";

/*
  "On this page" for /privacy and /terms: built from the article's own h2s
  (each gets an id), sticky beside the text on desktop, and the section you are
  reading is marked. No animation beyond the colour change.
*/
export default function LegalToc({ target }: { target: string }) {
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const root = document.querySelector(target);
    if (!root) return;
    const hs = [...root.querySelectorAll<HTMLHeadingElement>("h2")];
    const list = hs.map((h, i) => {
      if (!h.id) h.id = "s-" + (h.textContent ?? String(i)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return { id: h.id, label: (h.textContent ?? "").replace(/^\d+\.\s*/, "") };
    });
    setItems(list);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    hs.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [target]);

  if (!items.length) return null;
  return (
    <nav aria-label="On this page" className="legal-toc">
      <span className="kicker">On this page</span>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={active === it.id ? "true" : undefined}>
              <span className="legal-toc-n">{String(i + 1).padStart(2, "0")}</span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
