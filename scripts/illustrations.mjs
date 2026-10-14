// Self-drawing isometric illustrations (hero, pricing, contact, 404) in the site's blueprint style.
// Each SVG carries its own CSS: strokes draw on in sequence, fills fade in after, and everything is
// static under prefers-reduced-motion. Run: node scripts/illustrations.mjs public
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.argv[2] ?? "public", "art");
mkdirSync(out, { recursive: true });

const INK = "#0B0D12", PANEL = "#14171F", BAR = "#1B1F2A", PAPER = "#ECE9E2", COBALT = "#3D5BFF", CAUTION = "#FFC93C", GRAPHITE = "#8B8F9A";
const C = Math.cos(Math.PI / 6), S = Math.sin(Math.PI / 6);
const f = (n) => Math.round(n * 10) / 10;

const style = `<style>
.a-s,.a-h,.a-y,.a-p{fill:none;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1 1;stroke-dashoffset:1;animation:a-d .9s cubic-bezier(.65,0,.35,1) forwards;animation-delay:calc(var(--t)*1s)}
.a-s{stroke:${PAPER};stroke-width:1.6}
.a-h{stroke:${COBALT};stroke-width:7;stroke-opacity:.16}
.a-p{stroke:${PAPER};stroke-opacity:.55;stroke-width:1.2}
.a-y{stroke:${CAUTION};stroke-width:1.5}
.a-g{fill:none;stroke:${GRAPHITE};stroke-width:1;stroke-dasharray:4 7;opacity:0;animation:a-o .6s forwards;animation-delay:calc(var(--t)*1s)}
.a-f{opacity:0;animation:a-o .5s ease-out forwards;animation-delay:calc(var(--t)*1s)}
@keyframes a-d{to{stroke-dashoffset:0}}@keyframes a-o{to{opacity:1}}
@media (prefers-reduced-motion:reduce){.a-s,.a-h,.a-y,.a-p{animation:none;stroke-dashoffset:0}.a-g,.a-f{animation:none;opacity:1}}
</style>`;

/** A tiny scene builder: isometric shapes, each with a start time for its draw-on animation. */
function scene(ox, oy, k = 1) {
  const iso = (x, y, z) => [f(ox + (x - y) * C * k), f(oy + ((x + y) * S - z) * k)];
  const els = [];
  const pts = (list) => list.map((p) => p.join(",")).join(" ");
  const quad = (x, y, w, h, z) => [iso(x, y, z), iso(x + w, y, z), iso(x + w, y + h, z), iso(x, y + h, z)];
  const at = (t) => `style="--t:${t.toFixed(2)}"`;
  return {
    iso,
    /** outline of a flat rectangle at height z (with a soft cobalt halo) */
    rect(x, y, w, h, z, t, halo = true, cls = "a-s") {
      const p = pts(quad(x, y, w, h, z));
      if (halo) els.push(`<polygon class="a-h" pathLength="1" points="${p}" ${at(t)}/>`);
      els.push(`<polygon class="${cls}" pathLength="1" points="${p}" ${at(t)}/>`);
    },
    fill(x, y, w, h, z, color, t) {
      els.push(`<polygon class="a-f" points="${pts(quad(x, y, w, h, z))}" fill="${color}" ${at(t)}/>`);
    },
    face(points3d, color, t) {
      els.push(`<polygon class="a-f" points="${pts(points3d.map((p) => iso(...p)))}" fill="${color}" ${at(t)}/>`);
    },
    poly(points3d, t, cls = "a-s") {
      els.push(`<polygon class="${cls}" pathLength="1" points="${pts(points3d.map((p) => iso(...p)))}" ${at(t)}/>`);
    },
    line(a, b, t, cls = "a-s") {
      const p = iso(...a), q = iso(...b);
      els.push(`<line class="${cls}" pathLength="1" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" ${at(t)}/>`);
    },
    raw(svg) {
      els.push(svg);
    },
    at,
    svg(W, H) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${style}${els.join("")}</svg>`;
    },
  };
}

/** The browser window, as four layers at the given heights (same layout as the 3D object). */
function browser(sc, z, t0, step, opts = {}) {
  const { x = 0, y = 0 } = opts;
  const L = 560, D = 380;
  const zs = Array.isArray(z) ? z : [z, z, z, z];
  let t = t0;
  const next = () => (t += step);
  // 0 · frame + chrome
  sc.fill(x, y, L, D, zs[0], PANEL, t + 0.3);
  sc.rect(x, y, L, D, zs[0], next());
  sc.line([x, y + 44, zs[0]], [x + L, y + 44, zs[0]], next());
  [22, 40, 58].forEach((dx) => sc.fill(x + dx - 5, y + 17, 10, 10, zs[0], GRAPHITE, t + 0.4));
  sc.rect(x + 110, y + 14, 300, 16, zs[0], next(), false);
  const plane = (i) => {
    sc.fill(x, y, L, D, zs[i], "rgba(11,13,18,.6)", t);
    sc.rect(x, y, L, D, zs[i], next(), false, "a-p");
  };
  // 1 · nav, headline, CTA
  t += 0.15;
  plane(1);
  sc.rect(x + 28, y + 70, 70, 14, zs[1], next(), false);
  [300, 360, 420, 480].forEach((dx) => sc.line([x + dx, y + 77, zs[1]], [x + dx + 40, y + 77, zs[1]], next()));
  sc.rect(x + 28, y + 120, 300, 34, zs[1], next());
  sc.rect(x + 28, y + 166, 230, 34, zs[1], next());
  sc.rect(x + 28, y + 226, 120, 30, zs[1], next());
  // 2 · image placeholder
  t += 0.15;
  plane(2);
  sc.rect(x + 350, y + 70, 180, 186, zs[2], next());
  sc.line([x + 350, y + 70, zs[2]], [x + 530, y + 256, zs[2]], next());
  sc.line([x + 530, y + 70, zs[2]], [x + 350, y + 256, zs[2]], next());
  sc.line([x + 350, y + 272, zs[2]], [x + 510, y + 272, zs[2]], next());
  // 3 · cards
  t += 0.15;
  plane(3);
  [28, 205, 382].forEach((dx) => {
    sc.rect(x + dx, y + 286, 150, 72, zs[3], next());
    sc.line([x + dx + 14, y + 304, zs[3]], [x + dx + 84, y + 304, zs[3]], next());
  });
  return t;
}

// ── Hero: the exploded wireframe browser, drawing itself (stage 1 of the build story) ───────────
{
  const k = 0.78, W = 720, H = 660;
  const sc = scene(300, 270, k);
  const Z = [0, 105, 210, 315];
  for (const [x, y] of [[0, 0], [560, 0], [560, 380], [0, 380]]) sc.line([x, y, 0], [x, y, 315], 0.05, "a-g");
  const end = browser(sc, Z, 0.1, 0.075);
  // dimension line along the front edge + the cobalt full stop
  sc.line([0, 420, 0], [560, 420, 0], end + 0.1, "a-y");
  sc.line([0, 405, 0], [0, 435, 0], end + 0.1, "a-y");
  sc.line([560, 405, 0], [560, 435, 0], end + 0.1, "a-y");
  const [dx, dy] = sc.iso(620, -40, 315);
  sc.raw(`<circle class="a-f" cx="${dx}" cy="${dy}" r="11" fill="${COBALT}" ${sc.at(end + 0.3)}/>`);
  writeFileSync(join(out, "hero.svg"), sc.svg(W, H));
}

// ── Pricing: a starter kit, a box with a website rising out of it ───────────────────────────────
{
  const W = 720, H = 640;
  const sc = scene(330, 330, 0.9);
  const bw = 300, bd = 220, bh = 150;
  // box: back edges, faces, front edges
  sc.rect(0, 0, bw, bd, 0, 0.1, false);
  sc.face([[0, bd, 0], [bw, bd, 0], [bw, bd, bh], [0, bd, bh]], PANEL, 0.5);
  sc.face([[bw, 0, 0], [bw, bd, 0], [bw, bd, bh], [bw, 0, bh]], BAR, 0.5);
  for (const [x, y] of [[0, bd], [bw, bd], [bw, 0]]) sc.line([x, y, 0], [x, y, bh], 0.3);
  sc.rect(0, 0, bw, bd, bh, 0.55);
  // open flaps
  sc.poly([[0, 0, bh], [bw, 0, bh], [bw, -80, bh + 70], [0, -80, bh + 70]], 0.8);
  sc.poly([[0, 0, bh], [0, bd, bh], [-80, bd, bh + 70], [-80, 0, bh + 70]], 0.9);
  // the website rising out
  for (const [x, y] of [[30, 25], [270, 25], [270, 195], [30, 195]]) sc.line([x, y, bh], [x, y, 330], 1.0, "a-g");
  sc.fill(30, 25, 240, 170, 330, PANEL, 1.5);
  sc.fill(30, 25, 240, 28, 330, COBALT, 1.6);
  sc.rect(30, 25, 240, 170, 330, 1.1);
  sc.fill(50, 75, 130, 18, 330, PAPER, 1.7);
  sc.fill(50, 102, 95, 18, 330, PAPER, 1.75);
  sc.fill(190, 75, 60, 70, 330, CAUTION, 1.8);
  sc.fill(50, 150, 70, 22, 330, COBALT, 1.85);
  // three tokens floating alongside: pages, SEO, launch
  [[340, 30, 230, CAUTION], [350, 140, 290, PAPER], [-120, 240, 260, COBALT]].forEach(([x, y, z, c], i) => {
    sc.fill(x, y, 60, 46, z, c, 2 + i * 0.12);
    sc.rect(x, y, 60, 46, z, 1.9 + i * 0.12, false);
  });
  writeFileSync(join(out, "pricing.svg"), sc.svg(W, H));
}

// ── Contact: a booking calendar with one slot taken ─────────────────────────────────────────────
{
  const W = 720, H = 560;
  const sc = scene(290, 150, 0.95);
  const cw = 420, cd = 310;
  sc.fill(0, 0, cw, cd, 0, PANEL, 0.6);
  sc.rect(0, 0, cw, cd, 0, 0.1);
  sc.fill(0, 0, cw, 52, 0, COBALT, 0.7);
  sc.line([0, 52, 0], [cw, 52, 0], 0.4);
  let t = 0.5;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 7; c++) {
      const x = 16 + c * 57, y = 70 + r * 58;
      if (r === 2 && c === 4) continue;
      sc.rect(x, y, 46, 46, 0, (t += 0.025), false);
    }
  // the booked slot, lifted, with a time card above it
  sc.fill(16 + 4 * 57, 70 + 2 * 58, 46, 46, 26, CAUTION, 1.5);
  sc.rect(16 + 4 * 57, 70 + 2 * 58, 46, 46, 26, 1.3);
  sc.line([16 + 4 * 57 + 23, 70 + 2 * 58 + 23, 26], [16 + 4 * 57 + 23, 70 + 2 * 58 + 23, 150], 1.6, "a-g");
  sc.fill(220, 160, 160, 54, 150, PAPER, 1.9);
  sc.fill(236, 176, 22, 22, 150, COBALT, 2.0);
  sc.fill(270, 180, 90, 12, 150, GRAPHITE, 2.05);
  sc.rect(220, 160, 160, 54, 150, 1.75);
  // pointer clicking the slot (drawn flat, on top)
  const [px, py] = sc.iso(16 + 4 * 57 + 30, 70 + 2 * 58 + 30, 26);
  sc.raw(
    `<path class="a-f" d="M${px} ${py} l0 30 l8 -7 l6 13 l6 -3 l-6 -13 l11 -1 z" fill="${PAPER}" stroke="${INK}" stroke-width="1.5" ${sc.at(2.2)}/>`,
  );
  writeFileSync(join(out, "contact.svg"), sc.svg(W, H));
}

// ── 404: the browser, coming apart ──────────────────────────────────────────────────────────────
{
  const W = 760, H = 640;
  const sc = scene(330, 260, 0.6);
  const tilt = [
    [0, 0, 0, -4],
    [40, -30, 140, 7],
    [-60, 50, 260, -10],
    [90, 80, 380, 14],
  ];
  // draw each layer separately so it can be rotated as a group
  const L = 560, D = 380;
  const glass = (s, z, t) => (s.fill(0, 0, L, D, z, "rgba(11,13,18,.6)", t), s.rect(0, 0, L, D, z, t, false, "a-p"));
  const layers = [
    (s, z) => (s.fill(0, 0, L, D, z, PANEL, 0.3), s.rect(0, 0, L, D, z, 0.1), s.line([0, 44, z], [L, 44, z], 0.3), s.rect(110, 14, 300, 16, z, 0.4, false)),
    (s, z) => (glass(s, z, 0.5), s.rect(28, 120, 300, 34, z, 0.6), s.rect(28, 166, 230, 34, z, 0.7), s.rect(28, 226, 120, 30, z, 0.8)),
    (s, z) => (glass(s, z, 0.9), s.rect(350, 70, 180, 186, z, 1.0), s.line([350, 70, z], [530, 256, z], 1.1), s.line([530, 70, z], [350, 256, z], 1.15)),
    (s, z) => (glass(s, z, 1.2), [28, 205, 382].forEach((x, i) => s.rect(x, 286, 150, 72, z, 1.3 + i * 0.1))),
  ];
  const groups = tilt.map(([dx, dy, z, rot], i) => {
    const g = scene(330 + dx * 0.8, 260 + dy * 0.8, 0.6);
    layers[i](g, z);
    const [cx, cy] = g.iso(280, 190, z);
    return `<g transform="rotate(${rot} ${cx} ${cy})">${g.svg(W, H).replace(/^<svg[^>]*>|<\/svg>$/g, "").replace(/<style>[\s\S]*?<\/style>/, "")}</g>`;
  });
  sc.raw(groups.join(""));
  writeFileSync(join(out, "404.svg"), sc.svg(W, H));
}

console.log("illustrations ok");
