"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";
import { onFirstInteraction } from "@/lib/idle";
import { tick } from "@/lib/sound";

type Lenis = import("lenis").default;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Site-wide chrome: inertial scrolling, film grain, UI sounds, magnetic buttons and the nav's build status. */
export default function Chrome() {
  const lenis = useRef<Lenis | null>(null);
  const path = usePathname();

  useEffect(() => {
    // Hover ticks (silent unless sound is switched on).
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element).closest?.("a, button");
      if (hit && hit !== (e.relatedTarget as Element | null)?.closest?.("a, button")) tick();
    };
    document.addEventListener("pointerover", over, { passive: true });
    if (reduced()) return () => document.removeEventListener("pointerover", over);

    // Smooth scrolling is a nicety: start it on the first interaction.
    let alive = true;
    let stop = () => {};
    const cancel = onFirstInteraction(async () => {
      const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([loadGsap(), import("lenis")]);
      if (!alive) return;
      const l = new Lenis({ autoRaf: false, anchors: true, lerp: 0.11 });
      lenis.current = l;
      l.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      stop = () => {
        gsap.ticker.remove(raf);
        l.destroy();
        lenis.current = null;
      };
    });
    return () => {
      alive = false;
      document.removeEventListener("pointerover", over);
      cancel();
      stop();
    };
  }, []);

  useEffect(() => {
    // New page: start at the top without smoothing.
    lenis.current?.scrollTo(0, { immediate: true });

    // Build status in the nav: whichever section crosses the middle of the screen sets it.
    const root = document.documentElement;
    root.dataset.stage = path.includes("/work/") ? "live" : "wireframe";
    const stageOf = (el: HTMLElement) =>
      el.dataset.stageBlock ?? (el.id === "top" ? "wireframe" : el.tagName === "FOOTER" ? "ready" : "live");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (root.dataset.stage = stageOf(e.target as HTMLElement))),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document
      .querySelectorAll<HTMLElement>("[data-stage-block], main section:not(#process), footer")
      .forEach((el) => io.observe(el));

    // Magnetic buttons: they lean towards the pointer, then spring back. GSAP loads on first hover.
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced();
    const mags = fine ? [...document.querySelectorAll<HTMLElement>("[data-magnetic], .btn-primary")] : [];
    const offs = mags.map((el) => {
      const move = async (e: PointerEvent) => {
        const { gsap } = await loadGsap();
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.3,
          y: (e.clientY - r.top - r.height / 2) * 0.4,
          duration: 0.4,
          ease: "power3.out",
        });
      };
      const leave = async () => {
        const { gsap } = await loadGsap();
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });

    return () => {
      io.disconnect();
      offs.forEach((off) => off());
    };
  }, [path]);

  return <div className="grain" aria-hidden />;
}
