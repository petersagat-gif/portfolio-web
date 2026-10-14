"use client";

import { useEffect, useRef } from "react";

export type Frame = { ctx: CanvasRenderingContext2D; w: number; h: number; t: number; dt: number };
export type Pointer = { x: number; y: number; down: boolean; inside: boolean; vx: number; vy: number };

/**
 * A 2D canvas sized to its box (DPR-aware), with a pointer state and a render loop that only
 * runs while the canvas is on screen. `setup` returns the per-frame draw function.
 */
export function useCanvas(setup: (ctx: CanvasRenderingContext2D, w: number, h: number, p: Pointer) => (f: Frame) => void) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const p: Pointer = { x: -1e4, y: -1e4, down: false, inside: false, vx: 0, vy: 0 };
    let draw: (f: Frame) => void = () => {};
    let w = 0, h = 0, raf = 0, last = performance.now(), visible = false;

    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      w = r.width;
      h = r.height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw = setup(ctx, w, h, p);
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw({ ctx, w, h, t: now / 1000, dt });
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(c);

    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      p.vx = x - p.x;
      p.vy = y - p.y;
      p.x = x;
      p.y = y;
    };
    const down = (e: PointerEvent) => (pos(e), (p.down = true), c.setPointerCapture(e.pointerId));
    const move = (e: PointerEvent) => ((p.inside = true), pos(e));
    const up = () => (p.down = false);
    const leave = () => ((p.inside = false), (p.x = p.y = -1e4));
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    c.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
      c.removeEventListener("pointerleave", leave);
    };
  }, [setup]);
  return ref;
}

/** The page's display font family (next/font exposes it as a CSS variable). */
export const displayFont = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--font-anybody").trim() || "sans-serif";
