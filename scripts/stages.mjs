// Static renders of the three build stages (for reduced motion / no WebGL). Run: node stages.mjs <publicDir>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.argv[2], "process");
mkdirSync(out, { recursive: true });
const W = 1200, H = 860;
const INK = "#0B0D12", PANEL = "#14171F", BAR = "#1B1F2A", PAPER = "#ECE9E2", COBALT = "#3D5BFF", CAUTION = "#FFC93C", GRAPHITE = "#8B8F9A";
const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
const f = (n) => Math.round(n * 10) / 10;

function scene(stage) {
  const gap = stage === "wire" ? 110 : 6;
  const ox = 600, oy = stage === "wire" ? 215 : 170;
  const iso = (x, y, z) => [f(ox + (x - y) * c), f(oy + (x + y) * s - z)];
  const pts = (x, y, w, h, z) => [iso(x, y, z), iso(x + w, y, z), iso(x + w, y + h, z), iso(x, y + h, z)].map((p) => p.join(",")).join(" ");
  const rect = (x, y, w, h, z, a) => `<polygon points="${pts(x, y, w, h, z)}" ${a}/>`;
  const line = (x1, y1, x2, y2, z, a) => {
    const p = iso(x1, y1, z), q = iso(x2, y2, z);
    return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" ${a}/>`;
  };
  const lw = stage === "wire" ? 1.8 : 1.2;
  const st = `fill="none" stroke="${PAPER}" stroke-width="${lw}" stroke-linejoin="round" opacity="${stage === "wire" ? 1 : 0.55}"`;
  const glow = stage === "wire" ? `filter="url(#glow)"` : "";
  const L = 560, D = 380;
  let g = "";
  // layer 0
  if (stage !== "wire") g += rect(0, 0, L, 44, 0, `fill="${BAR}"`) + rect(0, 44, L, D - 44, 0, `fill="${PANEL}"`);
  g += rect(0, 0, L, D, 0, st.replace(/opacity="[^"]+"/, 'opacity="1"')) + line(0, 44, L, 44, 0, st);
  [22, 40, 58].forEach((x) => (g += rect(x - 5, 17, 10, 10, 0, `fill="${GRAPHITE}"`)));
  g += rect(110, 14, 300, 16, 0, st);
  if (stage === "live") {
    // the live site: hairline + solid name bars, pitch, CTA
    const z = gap;
    g += rect(0, 44, L, D - 44, z, `fill="${INK}"`);
    g += rect(28, 64, 40, 12, z, `fill="${PAPER}"`) + rect(460, 60, 74, 20, z, `fill="${COBALT}"`);
    g += rect(28, 150, 260, 40, z, `fill="none" stroke="${PAPER}" stroke-width="1.2"`);
    g += rect(28, 200, 300, 46, z, `fill="${PAPER}"`) + rect(338, 228, 18, 18, z, `fill="${COBALT}"`);
    g += rect(28, 280, 210, 10, z, `fill="${GRAPHITE}"`) + rect(28, 298, 170, 10, z, `fill="${GRAPHITE}"`);
    g += rect(390, 282, 142, 30, z, `fill="${COBALT}"`);
    return g;
  }
  // layer 1
  const z1 = gap;
  if (stage === "design") g += rect(28, 70, 70, 14, z1, `fill="${PAPER}"`) + rect(28, 120, 300, 34, z1, `fill="${PAPER}"`) + rect(28, 166, 230, 34, z1, `fill="${PAPER}"`) + rect(28, 226, 120, 30, z1, `fill="${COBALT}"`);
  g += rect(28, 70, 70, 14, z1, st) + rect(28, 120, 300, 34, z1, st) + rect(28, 166, 230, 34, z1, st) + rect(28, 226, 120, 30, z1, st);
  [300, 360, 420, 480].forEach((x) => (g += line(x, 77, x + 40, 77, z1, st)));
  // layer 2
  const z2 = gap * 2;
  if (stage === "design") g += rect(350, 70, 180, 186, z2, `fill="${CAUTION}"`);
  g += rect(350, 70, 180, 186, z2, st) + line(350, 70, 530, 256, z2, st) + line(530, 70, 350, 256, z2, st) + line(350, 272, 510, 272, z2, st);
  // layer 3
  const z3 = gap * 3;
  [28, 205, 382].forEach((x, i) => {
    if (stage === "design") g += rect(x, 286, 150, 72, z3, `fill="${i === 1 ? PAPER : "#232838"}"`);
    g += rect(x, 286, 150, 72, z3, st) + line(x + 14, 304, x + 84, 304, z3, st) + line(x + 14, 320, x + 120, 320, z3, st);
  });
  return `<g ${glow}>${g}</g>`;
}

const defs = `<defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feFlood flood-color="${COBALT}" flood-opacity=".9"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
["wire", "design", "live"].forEach((stage, i) =>
  writeFileSync(join(out, `stage-${i + 1}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}${scene(stage)}</svg>`),
);
console.log("stages ok");
