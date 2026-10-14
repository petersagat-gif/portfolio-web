"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { tick } from "@/lib/sound";

gsap.registerPlugin(ScrollTrigger);

/** Site-wide chrome: inertial scrolling, film grain and UI sounds. */
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

  // New page: start at the top without smoothing.
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [path]);

  return <div className="grain" aria-hidden />;
}
