"use client";

import { displayFont, useCanvas, type Pointer } from "./useCanvas";

/** Interaction 01: the wordmark as a particle field that parts around the cursor. */
function setup(ctx: CanvasRenderingContext2D, w: number, h: number, p: Pointer) {
  // Sample the wordmark's pixels on an offscreen canvas to get the particles' home positions.
  const off = document.createElement("canvas");
  const iw = Math.floor(w), ih = Math.floor(h);
  off.width = iw;
  off.height = ih;
  const o = off.getContext("2d") as CanvasRenderingContext2D & { fontStretch: string };
  const size = Math.min((w * 0.86) / 6.4, h / 2.4); // the wordmark is ~6.4em wide
  o.fontStretch = "extra-expanded";
  o.font = `900 ${size}px ${displayFont()}`;
  o.textAlign = "center";
  o.textBaseline = "middle";
  o.fillText("WEBERV", w / 2, h / 2);
  const data = o.getImageData(0, 0, iw, ih).data;
  const gap = Math.max(3, Math.round(Math.sqrt((w * h) / 26000)));
  const homes: number[] = [];
  for (let y = 0; y < ih; y += gap) for (let x = 0; x < iw; x += gap) if (data[(y * iw + x) * 4 + 3] > 128) homes.push(x, y);
  const n = homes.length / 2;
  const scatter = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
  const pos = Float32Array.from(homes, (v, i) => v + (Math.random() - 0.5) * (i % 2 ? h : w) * scatter);
  const vel = new Float32Array(n * 2);
  let wasDown = false;

  return () => {
    ctx.fillStyle = "rgba(19,19,21,0.42)"; // a little trail
    ctx.fillRect(0, 0, w, h);
    const burst = p.down && !wasDown;
    wasDown = p.down;
    const R = p.down ? 150 : 90;
    for (let i = 0; i < n; i++) {
      const ix = i * 2, iy = ix + 1;
      let fx = (homes[ix] - pos[ix]) * 0.045, fy = (homes[iy] - pos[iy]) * 0.045;
      const dx = pos[ix] - p.x, dy = pos[iy] - p.y, d2 = dx * dx + dy * dy;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / R) * (burst ? 60 : 6);
        fx += (dx / d) * f;
        fy += (dy / d) * f;
      }
      vel[ix] = (vel[ix] + fx) * 0.84;
      vel[iy] = (vel[iy] + fy) * 0.84;
      pos[ix] += vel[ix];
      pos[iy] += vel[iy];
      const speed = Math.abs(vel[ix]) + Math.abs(vel[iy]);
      ctx.fillStyle = speed > 2.2 ? "#3d5bff" : speed > 0.6 ? "#8da0ff" : "#ededea";
      ctx.fillRect(pos[ix], pos[iy], 1.7, 1.7);
    }
  };
}

export default function Particles() {
  const ref = useCanvas(setup);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full touch-none" aria-label="Particle field forming the WebERV wordmark" role="img" />;
}
