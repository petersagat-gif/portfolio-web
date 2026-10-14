"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { tick } from "@/lib/sound";

gsap.registerPlugin(ScrollTrigger);

/** Site-wide chrome: inertial scrolling, film grain, UI sounds and the nav's build status. */
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
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => document.removeEventListener("pointerover", over);
    }
    const l = new Lenis({ autoRaf: false, anchors: true, lerp: 0.11 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      document.removeEventListener("pointerover", over);
      gsap.ticker.remove(raf);
      l.destroy();
      lenis.current = null;
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
    return () => io.disconnect();
  }, [path]);

  return <div className="grain" aria-hidden />;
}
