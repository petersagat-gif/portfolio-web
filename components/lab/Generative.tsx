"use client";

import { useCallback, useState } from "react";
import { useCanvas, type Pointer } from "./useCanvas";

/** Small seeded PRNG (mulberry32): the same seed always draws the same piece. */
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Interaction 07: a seeded flow field. Each seed grows a different piece, line by line. */
export default function Generative() {
  const [seed, setSeed] = useState(() => (Math.random() * 1e6) | 0);
  const setup = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, p: Pointer) => {
      const rand = rng(seed);
      // Smooth angle field from a few random sine waves (cheap, seedable, good-looking).
      const waves = Array.from({ length: 4 }, () => [rand() * 0.012 + 0.002, rand() * 0.012 + 0.002, rand() * 6.28, rand() * 2 + 0.5]);
      const field = (x: number, y: number) => waves.reduce((a, [fx, fy, ph, amp]) => a + Math.sin(x * fx + y * fy + ph) * amp, 0);
      const n = Math.round((w * h) / 520);
      const walkers = Array.from({ length: n }, () => ({ x: rand() * w, y: rand() * h, life: 40 + rand() * 120, hot: rand() < 0.06 }));
      ctx.fillStyle = "#131315";
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 0.9;
      let frames = 0;
      return () => {
        if (frames++ > 260) return false; // the piece is finished: stop drawing
        for (const k of walkers) {
          if (k.life-- <= 0) continue;
          const a = field(k.x, k.y) + (p.inside ? Math.atan2(p.y - k.y, p.x - k.x) * 0.15 : 0);
          const nx = k.x + Math.cos(a) * 1.6, ny = k.y + Math.sin(a) * 1.6;
          ctx.strokeStyle = k.hot ? "rgba(61,91,255,0.55)" : "rgba(237,237,234,0.16)";
          ctx.beginPath();
          ctx.moveTo(k.x, k.y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          k.x = nx;
          k.y = ny;
        }
      };
    },
    [seed],
  );
  const ref = useCanvas(setup);
  return (
    <>
      <canvas
        ref={ref}
        onClick={() => setSeed((Math.random() * 1e6) | 0)}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`Generative flow-field drawing, seed ${seed}`}
      />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
        <span className="meta">Seed {seed}</span>
        <button type="button" onClick={() => setSeed((Math.random() * 1e6) | 0)} className="btn btn-ghost !px-4 !py-2.5 text-sm">
          New seed
        </button>
      </div>
    </>
  );
}
