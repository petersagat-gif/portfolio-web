"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";
import { onFirstInteraction } from "@/lib/idle";

type Lenis = import("lenis").default;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Three bars on ink, widths 0..1: the favicon version of the WebERV mark. */
function drawFavicon(widths: number[]) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d")!;
  x.fillStyle = "#0b0b0c";
  x.beginPath();
  x.roundRect(0, 0, 64, 64, 14);
  x.fill();
  x.fillStyle = "#3d5bff";
  widths.forEach((w, i) => x.fillRect(16, 17 + i * 12, Math.max(4, 32 * w), 7));
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon'][data-live]");
  if (!link) {
    link = Object.assign(document.createElement("link"), { rel: "icon", type: "image/png" });
    link.dataset.live = "";
    document.head.appendChild(link);
  }
  link.href = c.toDataURL("image/png");
}

/** Site-wide chrome: inertial scroll, magnetic buttons, grain, favicon, title and the blueprint easter egg. */
export default function Chrome() {
  const lenis = useRef<Lenis | null>(null);
  const path = usePathname();

  useEffect(() => {
    // Favicon: bars load in once, then breathe while the tab sits in the background.
    let frame = 0;
    const load = setInterval(() => {
      frame++;
      drawFavicon([0, 1, 2].map((i) => Math.min(1, Math.max(0, frame / 6 - i * 0.25))));
      if (frame >= 9) clearInterval(load);
    }, 90);
    const title = document.title;
    let idle = 0;
    const onVisibility = () => {
      clearInterval(idle);
      if (document.hidden) {
        document.title = "Still building. | WebERV";
        let t = 0;
        idle = window.setInterval(() => {
          t++;
          drawFavicon([0, 1, 2].map((i) => 0.45 + 0.55 * Math.abs(Math.sin(t * 0.9 + i))));
        }, 700);
      } else {
        document.title = title;
        drawFavicon([1, 1, 1]);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Easter egg: type "weberv" anywhere (outside form fields) to toggle blueprint mode.
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element).closest("input, textarea, select, [contenteditable]")) return;
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-6);
      if (typed !== "weberv") return;
      typed = "";
      const root = document.documentElement;
      const on = root.toggleAttribute("data-blueprint");
      const toast = Object.assign(document.createElement("div"), {
        className: "meta fixed bottom-5 left-1/2 z-[95] -translate-x-1/2 rounded-full bg-accent px-4 py-2 !text-white",
        textContent: on ? "Blueprint mode on. Type weberv again to leave." : "Blueprint mode off.",
        role: "status",
      });
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2600);
    };
    addEventListener("keydown", onKey);

    // Smooth scrolling is a nicety: start it on the first interaction, off the load path.
    let alive = true;
    let stop = () => {};
    const cancel = reduced()
      ? () => {}
      : onFirstInteraction(async () => {
          const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([loadGsap(), import("lenis")]);
          if (!alive) return;
          // Sections above an anchor may still be unrendered (content-visibility) when the jump starts,
          // so their real heights only arrive mid-scroll. Re-aim once or twice when it lands.
          let anchor: HTMLElement | null = null;
          const pick = (e: MouseEvent) => {
            const id = (e.target as Element).closest?.('a[href*="#"]')?.getAttribute("href")?.split("#")[1];
            anchor = id ? document.getElementById(id) : null;
          };
          addEventListener("click", pick, true);
          const settle = (lenis: InstanceType<typeof Lenis>, tries = 2) => {
            const want = anchor && 72 + parseFloat(getComputedStyle(anchor).scrollMarginTop);
            if (!anchor || !tries || Math.abs(anchor.getBoundingClientRect().top - want!) < 4) return void (anchor = null);
            lenis.scrollTo(anchor, { offset: -72, duration: 0.6, onComplete: (x) => settle(x, tries - 1) });
          };
          const l = new Lenis({ autoRaf: false, anchors: { offset: -72, onComplete: (x) => settle(x) }, lerp: 0.1 });
          lenis.current = l;
          l.on("scroll", ScrollTrigger.update);
          const raf = (time: number) => l.raf(time * 1000);
          gsap.ticker.add(raf);
          gsap.ticker.lagSmoothing(0);
          stop = () => {
            gsap.ticker.remove(raf);
            removeEventListener("click", pick, true);
            l.destroy();
            lenis.current = null;
          };
        });

    return () => {
      alive = false;
      clearInterval(load);
      clearInterval(idle);
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("keydown", onKey);
      cancel();
      stop();
    };
  }, []);

  useEffect(() => {
    // New page: start at the top without smoothing.
    lenis.current?.scrollTo(0, { immediate: true });

    // Magnetic buttons: they lean towards the pointer, then spring back. GSAP loads on first hover.
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced();
    const mags = fine ? [...document.querySelectorAll<HTMLElement>("[data-magnetic], .btn")] : [];
    const offs = mags.map((el) => {
      const move = async (e: PointerEvent) => {
        const { gsap } = await loadGsap();
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.28,
          y: (e.clientY - r.top - r.height / 2) * 0.38,
          duration: 0.45,
          ease: "power3.out",
        });
      };
      const leave = async () => {
        const { gsap } = await loadGsap();
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => offs.forEach((off) => off());
  }, [path]);

  return <div className="grain" aria-hidden />;
}
