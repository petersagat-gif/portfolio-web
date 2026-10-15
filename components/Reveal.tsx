"use client";

import { useEffect } from "react";
import { loadGsap } from "@/lib/gsap";
import { onFirstInteraction } from "@/lib/idle";

/**
 * Display headings below the fold reveal line by line as they scroll in. Rendered inside each page
 * (not the layout) so it only touches the DOM after that page has hydrated, and deferred to the
 * first interaction because splitting measures layout (the headings all start below the fold). The hero wordmark has its own entrance.
 */
export default function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let revert = () => {};
    let alive = true;
    const cancel = onFirstInteraction(async () => {
      const [{ gsap }, { SplitText }] = await Promise.all([loadGsap(), import("gsap/SplitText")]);
      if (!alive) return;
      gsap.registerPlugin(SplitText);
      const ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>("main :is(.h2, .mark):not(.process *, .hero-mark, .diag *)").forEach((el) => {
          if (el.getBoundingClientRect().top < innerHeight) return; // already on screen: leave it be
          SplitText.create(el, {
            type: "lines",
            aria: "none", // line wrappers keep the text readable as-is; no aria-label on <p>/<h2>
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
              }),
          });
        });
      });
      revert = () => ctx.revert();
    });
    return () => {
      alive = false;
      cancel();
      revert();
    };
  }, []);
  return null;
}
