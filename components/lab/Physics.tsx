"use client";

import { useCallback } from "react";
import { displayFont, useCanvas, type Pointer } from "./useCanvas";

type Body = { ch: string; x: number; y: number; vx: number; vy: number; r: number; a: number; va: number };

/** Interaction 03: letters with gravity, collisions and a throw. A tiny circle-physics engine, no library. */
function makeSetup(word: string) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number, p: Pointer) => {
  const font = displayFont();
  const r = Math.min(w / (word.length + 2), word.length < 5 ? 110 : 70);
  const bodies: Body[] = [...word].map((ch, i) => ({
    ch,
    x: r + ((i * 1.7 * r) % (w - 2 * r)),
    y: -r * (1 + i * 1.3),
    vx: (Math.random() - 0.5) * 120,
    vy: 0,
    r,
    a: (Math.random() - 0.5) * 0.6,
    va: 0,
  }));
  let held: Body | null = null;
  const G = 2200;

  return ({ dt }: { dt: number }) => {
    // Grab the body under the pointer; while held it follows the pointer, released it keeps the throw.
    if (p.down && !held) held = bodies.find((b) => (b.x - p.x) ** 2 + (b.y - p.y) ** 2 < b.r * b.r) ?? null;
    if (!p.down && held) held = null;

    const steps = 3, h1 = dt / steps;
    for (let s = 0; s < steps; s++) {
      for (const b of bodies) {
        if (b === held) {
          b.vx = (p.x - b.x) / Math.max(h1, 1e-3) * 0.3;
          b.vy = (p.y - b.y) / Math.max(h1, 1e-3) * 0.3;
        } else b.vy += G * h1;
        b.x += b.vx * h1;
        b.y += b.vy * h1;
        b.a += b.va * h1;
        // walls and floor
        if (b.y > h - b.r) {
          b.y = h - b.r;
          b.vy *= -0.42;
          b.vx *= 0.985;
          b.va = b.vx / b.r; // rolling
        }
        if (b.x < b.r) {
          b.x = b.r;
          b.vx *= -0.5;
        }
        if (b.x > w - b.r) {
          b.x = w - b.r;
          b.vx *= -0.5;
        }
      }
      // circle-circle collisions: push apart, exchange momentum along the normal
      for (let i = 0; i < bodies.length; i++)
        for (let j = i + 1; j < bodies.length; j++) {
          const A = bodies[i], B = bodies[j];
          const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), min = A.r + B.r;
          if (d === 0 || d >= min) continue;
          const nx = dx / d, ny = dy / d, overlap = (min - d) / 2;
          A.x -= nx * overlap; A.y -= ny * overlap; B.x += nx * overlap; B.y += ny * overlap;
          const rel = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
          if (rel < 0) {
            const imp = -rel * 0.72;
            A.vx -= nx * imp; A.vy -= ny * imp; B.vx += nx * imp; B.vy += ny * imp;
            A.va -= rel * 0.004; B.va += rel * 0.004;
          }
        }
    }

    ctx.fillStyle = "#131315";
    ctx.fillRect(0, 0, w, h);
    (ctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = "extra-expanded";
    ctx.font = `900 ${r * 1.15}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    bodies.forEach((b, i) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.a);
      if (word.startsWith("WEBE") && i === 3) {
        // the WebERV "E": three bars
        ctx.fillStyle = "#3d5bff";
        for (let k = 0; k < 3; k++) ctx.fillRect(-b.r * 0.45, -b.r * 0.5 + k * b.r * 0.4, b.r * 0.9, b.r * 0.2);
      } else {
        ctx.fillStyle = b === held ? "#8da0ff" : "#ededea";
        ctx.fillText(b.ch, 0, b.r * 0.06);
      }
      ctx.restore();
    });
  };
  };
}

export default function Physics({ word = "WEBERVLAB" }: { word?: string }) {
  const setup = useCallback((...a: Parameters<ReturnType<typeof makeSetup>>) => makeSetup(word)(...a), [word]);
  const ref = useCanvas(setup);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full touch-none" aria-label="Letters with gravity you can grab and throw" role="img" />;
}
