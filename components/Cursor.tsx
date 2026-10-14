"use client";

import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";

const LABELS: Record<string, string> = { view: "View", drag: "Drag", play: "Play" };

/**
 * A dot that trails the pointer and changes with context: a ring over links, a caret over text
 * fields, a labelled disc over work ("View"), lab experiments ("Play") and draggables ("Drag").
 * Set the state with data-cursor on any element. Fine pointers only, never with reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = dot.current!;
    const root = document.documentElement;
    let lastY = 0;
    // Follow directly until GSAP has loaded (first move), then with a soft lag.
    let x: (v: number) => unknown = (v) => el.style.setProperty("translate", `${v}px ${lastY}px`);
    let y: (v: number) => unknown = (v) => (lastY = v);
    let upgraded = false;

    const move = (e: PointerEvent) => {
      root.classList.add("has-cursor");
      if (!upgraded) {
        upgraded = true;
        void loadGsap().then(({ gsap }) => {
          el.style.removeProperty("translate");
          x = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3" });
          y = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3" });
        });
      }
      y(e.clientY);
      x(e.clientX);
      const t = e.target as Element;
      const mode =
        t.closest("[data-cursor]")?.getAttribute("data-cursor") ??
        (t.closest("input, textarea") ? "text" : t.closest("a, button, label, [role='tab']") ? "link" : "");
      if (mode !== el.dataset.mode) {
        el.dataset.mode = mode;
        label.current!.textContent = LABELS[mode] ?? "";
      }
    };
    const leave = () => root.classList.remove("has-cursor");
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={dot} className="cursor" aria-hidden>
      <span ref={label} />
    </div>
  );
}
