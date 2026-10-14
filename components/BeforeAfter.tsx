"use client";

import { useEffect, useRef } from "react";
import type { Dict } from "@/content/i18n";
import { loadGsap } from "@/lib/gsap";
import { tick } from "@/lib/sound";

/** Draggable before/after comparison. Pointer, touch and keyboard (role="slider"). */
export default function BeforeAfter({ before, after, t }: { before: string; after: string; t: Dict["compare"] }) {
  const box = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = box.current!;
    const handle = knob.current!;
    let pos = 50;
    // Weighted follow: the divider trails the finger slightly, which is what makes it feel physical.
    // Until GSAP has loaded it simply jumps.
    let to = (v: number) => el.style.setProperty("--pos", String(v));
    const upgrade = () => loadGsap().then(({ gsap }) => (to = gsap.quickTo(el, "--pos", { duration: 0.45, ease: "power3.out" })));
    const set = (v: number) => {
      const next = Math.min(100, Math.max(0, v));
      if ((pos - 50) * (next - 50) < 0) {
        tick(1100, 0.03, 0.03);
        navigator.vibrate?.(6);
      }
      pos = next;
      to(pos);
      handle.setAttribute("aria-valuenow", String(Math.round(pos)));
    };
    const fromEvent = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };

    let dragging = false;
    const down = (e: PointerEvent) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "";
      fromEvent(e);
    };
    const move = (e: PointerEvent) => dragging && fromEvent(e);
    const up = () => {
      dragging = false;
      delete el.dataset.dragging;
    };
    const key = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 20 : 5;
      const map: Record<string, number> = { ArrowLeft: pos - step, ArrowRight: pos + step, Home: 0, End: 100 };
      if (e.key in map) {
        e.preventDefault();
        set(map[e.key]);
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    handle.addEventListener("keydown", key);

    // A one-time nudge when it scrolls into view, so people see it can be dragged.
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        await upgrade(); // GSAP loads when the slider first comes into view
        if (reduce) return;
        const { gsap } = await loadGsap();
        gsap.timeline({ delay: 0.3 }).to(el, { "--pos": 64, duration: 0.6, ease: "power2.inOut" }).to(el, {
          "--pos": 50,
          duration: 0.9,
          ease: "elastic.out(1, 0.5)",
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      handle.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <div
      ref={box}
      data-cursor="drag"
      className="compare relative aspect-[16/10] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-xl bg-panel"
      style={{ "--pos": 50 } as React.CSSProperties}
    >
      <img src={after} alt={t.after} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <img src={before} alt={t.before} className="compare-before absolute inset-0 h-full w-full object-cover" draggable={false} />
      <span className="label absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1.5 text-paper">{t.before}</span>
      <span className="label absolute right-3 top-3 rounded-full bg-caution px-3 py-1.5 !text-ink">{t.after}</span>
      <div className="compare-line pointer-events-none absolute inset-y-0 w-px bg-paper">
        <button
          ref={knob}
          type="button"
          role="slider"
          aria-label={t.handle}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          className="compare-knob pointer-events-auto absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink"
        >
          <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden>
            <path d="M7 1L1 7l6 6M15 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
