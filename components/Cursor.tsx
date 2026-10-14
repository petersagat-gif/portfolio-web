"use client";

import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";

/**
 * A dot that trails the pointer and morphs: a ring over links, a labelled disc over
 * projects ("Open") and draggable things ("Drag"). Fine pointers only, never with reduced motion.
 */
export default function Cursor({ open, drag }: { open: string; drag: string }) {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = dot.current!;
    const root = document.documentElement;
    const text: Record<string, string> = { open, drag };
    // Follow the pointer directly until GSAP has loaded (first move), then with a soft lag.
    let x: (v: number) => unknown = (v) => el.style.setProperty("translate", `${v}px ${lastY}px`);
    let y: (v: number) => unknown = (v) => (lastY = v);
    let lastY = 0;
    let upgraded = false;
    const upgrade = () =>
      loadGsap().then(({ gsap }) => {
        el.style.removeProperty("translate");
        x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
        y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
      });

    const move = (e: PointerEvent) => {
      root.classList.add("has-cursor");
      if (!upgraded) {
        upgraded = true;
        void upgrade();
      }
      y(e.clientY);
      x(e.clientX);
      const t = e.target as Element;
      const mode = root.hasAttribute("data-cursor-open") // set by the 3D gallery on hover
        ? "open"
        : (t.closest("[data-cursor]")?.getAttribute("data-cursor") ?? (t.closest("a, button") ? "link" : ""));
      if (mode !== el.dataset.mode) {
        el.dataset.mode = mode;
        label.current!.textContent = text[mode] ?? "";
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
  }, [open, drag]);

  return (
    <div ref={dot} className="cursor" aria-hidden>
      <span ref={label} />
    </div>
  );
}
