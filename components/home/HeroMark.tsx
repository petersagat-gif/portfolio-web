"use client";

import { useEffect, useRef } from "react";

const LETTERS = ["W", "E", "B", null, "R", "V"] as const; // null = the three bars

/**
 * The giant hero wordmark. Letters lift towards the cursor and the bars stretch with it,
 * like an equaliser following your hand. Transform-only, so it never triggers layout.
 */
export default function HeroMark() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = ref.current!;
    const parts = [...root.querySelectorAll<HTMLElement>("[data-part]")];
    const bars = [...root.querySelectorAll<HTMLElement>(".bars > i")];
    let target = -1; // pointer x in px, -1 = away
    let raf = 0;
    const cur = parts.map(() => 0);
    const barCur = bars.map(() => 1);

    const loop = () => {
      let busy = false;
      parts.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = target < 0 ? 1 : Math.min(1, Math.abs(target - (r.left + r.width / 2)) / (r.width * 2.2));
        const want = (1 - d) ** 2;
        cur[i] += (want - cur[i]) * 0.12;
        if (Math.abs(want - cur[i]) > 0.001) busy = true;
        el.style.transform = `translateY(${-cur[i] * 0.07}em) scaleY(${1 + cur[i] * 0.06})`;
      });
      bars.forEach((el, i) => {
        const want = target < 0 ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(target / 140 + i * 1.3));
        barCur[i] += (want - barCur[i]) * 0.14;
        if (Math.abs(want - barCur[i]) > 0.001) busy = true;
        el.style.transform = `scaleX(${barCur[i]})`;
      });
      raf = busy ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => (raf ||= requestAnimationFrame(loop));
    const hero = root.closest("section")!;
    const move = (e: PointerEvent) => ((target = e.clientX), kick());
    const leave = () => ((target = -1), kick());
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <p ref={ref} className="mark intro-mark hero-mark">
      <span className="sr-only">WebERV</span>
      {LETTERS.map((l, i) =>
        l ? (
          <span key={i} data-part aria-hidden style={{ "--i": i } as React.CSSProperties} className="hero-letter">
            {l}
          </span>
        ) : (
          <span key={i} data-part aria-hidden style={{ "--i": i } as React.CSSProperties}>
            <span className="bars">
              {[0, 1, 2].map((b) => (
                <i key={b} style={{ "--i": b } as React.CSSProperties} />
              ))}
            </span>
          </span>
        ),
      )}
    </p>
  );
}
