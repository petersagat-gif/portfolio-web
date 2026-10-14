// The hero object: a browser window drawn as line segments, split into four layers that
// explode apart in depth (like a technical drawing) and collapse as the site gets built.
// Layout is authored in "design pixels" (560 × 380) and mapped to world units here.

const S = 4 / 560; // 560px → 4 world units wide
const P = (x: number, y: number): [number, number] => [x * S - 2, 1.357 - y * S];
export const LAYER_GAP = 0.5; // exploded distance between layers

type Seg = number[]; // flat [x1,y1,z1, x2,y2,z2, ...]

function rect(out: Seg, x: number, y: number, w: number, h: number, r = 0) {
  if (!r) {
    const a = P(x, y), b = P(x + w, y), c = P(x + w, y + h), d = P(x, y + h);
    for (const [p, q] of [[a, b], [b, c], [c, d], [d, a]]) out.push(p[0], p[1], 0, q[0], q[1], 0);
    return;
  }
  // rounded: walk the outline with 5 segments per corner
  const pts: [number, number][] = [];
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -Math.PI / 2],
    [x + w - r, y + h - r, 0],
    [x + r, y + h - r, Math.PI / 2],
    [x + r, y + r, Math.PI],
  ];
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i <= 5; i++) {
      const a = a0 + (i / 5) * (Math.PI / 2);
      pts.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    out.push(p[0], p[1], 0, q[0], q[1], 0);
  }
}

function line(out: Seg, x1: number, y1: number, x2: number, y2: number) {
  const a = P(x1, y1), b = P(x2, y2);
  out.push(a[0], a[1], 0, b[0], b[1], 0);
}

function circle(out: Seg, cx: number, cy: number, r: number, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = P(cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r);
    const b = P(cx + Math.cos(((i + 1) / n) * Math.PI * 2) * r, cy + Math.sin(((i + 1) / n) * Math.PI * 2) * r);
    out.push(a[0], a[1], 0, b[0], b[1], 0);
  }
}

/** Line segments per layer (back to front). */
export function wireLayers(): Seg[] {
  const l0: Seg = [], l1: Seg = [], l2: Seg = [], l3: Seg = [];
  // 0 · window frame and browser chrome
  rect(l0, 0, 0, 560, 380, 14);
  line(l0, 0, 44, 560, 44);
  [22, 40, 58].forEach((x) => circle(l0, x, 22, 5));
  rect(l0, 110, 14, 300, 16, 8);
  // 1 · nav, headline, call to action
  rect(l1, 28, 70, 70, 14);
  [300, 360, 420, 480].forEach((x) => line(l1, x, 77, x + 40, 77));
  rect(l1, 28, 120, 300, 34);
  rect(l1, 28, 166, 230, 34);
  rect(l1, 28, 226, 120, 30, 15);
  // 2 · image placeholder (the wireframe "X") and body copy
  rect(l2, 350, 70, 180, 186);
  line(l2, 350, 70, 530, 256);
  line(l2, 530, 70, 350, 256);
  line(l2, 350, 272, 510, 272);
  // 3 · cards
  [28, 205, 382].forEach((x) => {
    rect(l3, x, 286, 150, 72, 8);
    line(l3, x + 14, 304, x + 84, 304);
    line(l3, x + 14, 320, x + 120, 320);
  });
  return [l0, l1, l2, l3];
}

export type Block = { layer: number; x: number; y: number; w: number; h: number; color: string };

/** Flat "design" fills that snap into the wireframe slots in stage 2. */
export const blocks: Block[] = [
  { layer: 0, x: 0, y: 0, w: 560, h: 44, color: "#1b1f2a" },
  { layer: 0, x: 0, y: 44, w: 560, h: 336, color: "#14171f" },
  { layer: 1, x: 28, y: 70, w: 70, h: 14, color: "#ece9e2" },
  { layer: 1, x: 28, y: 120, w: 300, h: 34, color: "#ece9e2" },
  { layer: 1, x: 28, y: 166, w: 230, h: 34, color: "#ece9e2" },
  { layer: 1, x: 28, y: 226, w: 120, h: 30, color: "#3d5bff" },
  { layer: 2, x: 350, y: 70, w: 180, h: 186, color: "#ffc93c" },
  { layer: 3, x: 28, y: 286, w: 150, h: 72, color: "#232838" },
  { layer: 3, x: 205, y: 286, w: 150, h: 72, color: "#ece9e2" },
  { layer: 3, x: 382, y: 286, w: 150, h: 72, color: "#232838" },
];

/** Centre + size of a block in world units. */
export function blockBox(b: Block) {
  const [x0, y0] = P(b.x, b.y);
  const [x1, y1] = P(b.x + b.w, b.y + b.h);
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y0 - y1 };
}

/** The content area below the browser chrome, where the live site appears in stage 3. */
export const screenBox = blockBox({ layer: 0, x: 0, y: 44, w: 560, h: 336, color: "" });
