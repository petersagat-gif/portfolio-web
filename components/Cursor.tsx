"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

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
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      root.classList.add("has-cursor");
      x(e.clientX);
      y(e.clientY);
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
