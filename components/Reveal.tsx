"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Display headings reveal line by line as they scroll in. Rendered inside each page (not the
 * layout) so it only touches the DOM after that page has hydrated. The hero name has its own animation.
 */
export default function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("main :is(h1, h2, h3).display:not(.hero-name)").forEach((el) =>
        SplitText.create(el, {
          type: "lines",
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
        }),
      );
    });
    return () => ctx.revert();
  }, []);
  return null;
}
