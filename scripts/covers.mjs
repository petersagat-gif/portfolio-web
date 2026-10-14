// Generates the cover artworks in /public/work. Run: node covers.mjs <publicDir>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.argv[2], "work");
mkdirSync(out, { recursive: true });
const W = 1600, H = 1000;
const INK = "#0B0D12", PAPER = "#ECE9E2", COBALT = "#3D5BFF", CAUTION = "#FFC93C", GRAPHITE = "#8B8F9A";
const f = (n) => Math.round(n * 10) / 10;
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const guides = (cols = 12, color = "rgba(139,143,154,.12)") =>
  Array.from({ length: cols + 1 }, (_, i) => `<line x1="${f(80 + (i * (W - 160)) / cols)}" y1="0" x2="${f(80 + (i * (W - 160)) / cols)}" y2="${H}" stroke="${color}"/>`).join("");

// ── 1. This site: exploded isometric browser (the hero object, drawn flat) ──────────────
{
  const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
  const ox = 800, oy = 300;
  const iso = (x, y, z) => [f(ox + (x - y) * c), f(oy + (x + y) * s - z)];
  const poly = (x, y, w, h, z) => [iso(x, y, z), iso(x + w, y, z), iso(x + w, y + h, z), iso(x, y + h, z)].map((p) => p.join(",")).join(" ");
  const rect = (x, y, w, h, z, attrs) => `<polygon points="${poly(x, y, w, h, z)}" ${attrs}/>`;
  const line = (a, b, attrs) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${attrs}/>`;
  const st = `fill="none" stroke="${PAPER}" stroke-width="1.6" stroke-linejoin="round"`;
  const L = 560, D = 380; // browser footprint
  const layers = [0, 110, 220, 330];
  let g = "";
  // assembly guides between layers
  for (const [x, y] of [[0, 0], [L, 0], [L, D], [0, D]]) g += line(iso(x, y, 0), iso(x, y, 330), `stroke="${GRAPHITE}" stroke-width="1" stroke-dasharray="4 7" opacity=".6"`);
  // layer 0: frame
  g += rect(0, 0, L, D, 0, `fill="${INK}" stroke="${PAPER}" stroke-width="1.6"`);
  g += line(iso(0, 44, 0), iso(L, 44, 0), st);
  [22, 40, 58].forEach((x) => (g += rect(x - 5, 17, 10, 10, 0, `fill="${GRAPHITE}"`)));
  g += rect(110, 14, 300, 16, 0, st);
  // layer 1: nav + headline + CTA
  g += rect(0, 0, L, D, layers[1], `fill="rgba(11,13,18,.72)" stroke="${PAPER}" stroke-width="1.2" opacity=".9"`);
  g += rect(28, 70, 70, 14, layers[1], `fill="${PAPER}"`);
  [300, 360, 420, 480].forEach((x) => (g += rect(x, 74, 40, 6, layers[1], `fill="${GRAPHITE}"`)));
  g += rect(28, 120, 300, 34, layers[1], st) + rect(28, 166, 230, 34, layers[1], st);
  g += rect(28, 226, 120, 30, layers[1], `fill="${COBALT}"`);
  // layer 2: image block with the wireframe "X", plus a filled design block
  g += rect(0, 0, L, D, layers[2], `fill="rgba(11,13,18,.72)" stroke="${PAPER}" stroke-width="1.2" opacity=".9"`);
  g += rect(350, 70, 180, 186, layers[2], st);
  g += line(iso(350, 70, layers[2]), iso(530, 256, layers[2]), st) + line(iso(530, 70, layers[2]), iso(350, 256, layers[2]), st);
  g += rect(28, 120, 230, 120, layers[2], `fill="${CAUTION}" opacity=".95"`);
  // layer 3: cards
  g += rect(0, 0, L, D, layers[3], `fill="rgba(11,13,18,.72)" stroke="${PAPER}" stroke-width="1.2" opacity=".9"`);
  [28, 205, 382].forEach((x, i) => {
    g += rect(x, 286, 150, 72, layers[3], i === 1 ? `fill="${PAPER}"` : st);
    g += rect(x + 14, 300, 70, 8, layers[3], `fill="${i === 1 ? INK : GRAPHITE}"`);
  });
  // dimension line along the front edge
  const a = iso(0, D + 40, 0), b = iso(L, D + 40, 0);
  g += line(a, b, `stroke="${CAUTION}" stroke-width="1.4"`);
  for (const p of [a, b]) g += line([p[0], p[1] - 9], [p[0], p[1] + 9], `stroke="${CAUTION}" stroke-width="1.4"`);
  g += `<circle cx="${iso(L + 60, -40, 330)[0]}" cy="${iso(L + 60, -40, 330)[1]}" r="16" fill="${COBALT}"/>`;
  writeFileSync(join(out, "this-site.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${INK}"/>${guides()}<g>${g}</g></svg>`);
}

// ── 2. Weberv: a field of websites receding to the horizon, some already built ──────────
{
  seed = 11;
  let g = "";
  const horizon = 330;
  for (let r = 0; r < 7; r++) {
    const t = r / 6; // 0 = far, 1 = near
    const sc = 0.28 + t * t * 0.95;
    const cw = 230 * sc, ch = 150 * sc, gap = 40 * sc;
    const y = horizon + 30 + Math.pow(t, 1.6) * 560;
    const n = Math.ceil(W / (cw + gap)) + 2;
    const x0 = (W - n * (cw + gap)) / 2 + (r % 2 ? (cw + gap) / 2 : 0);
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (cw + gap);
      const k = rand();
      const fill = k < 0.09 ? COBALT : k < 0.15 ? CAUTION : "none";
      const stroke = fill === "none" ? `rgba(236,233,226,${0.25 + t * 0.55})` : "none";
      const fg = fill === "none" ? `rgba(139,143,154,${0.3 + t * 0.4})` : INK;
      g += `<rect x="${f(x)}" y="${f(y)}" width="${f(cw)}" height="${f(ch)}" rx="${f(8 * sc)}" fill="${fill}" stroke="${stroke}" stroke-width="${f(1 + t)}"/>`;
      g += `<line x1="${f(x)}" y1="${f(y + 22 * sc)}" x2="${f(x + cw)}" y2="${f(y + 22 * sc)}" stroke="${fill === "none" ? stroke : INK}" stroke-width="${f(1 + t)}" opacity=".7"/>`;
      g += `<rect x="${f(x + 16 * sc)}" y="${f(y + 44 * sc)}" width="${f(120 * sc)}" height="${f(16 * sc)}" rx="${f(8 * sc)}" fill="${fg}"/>`;
      g += `<rect x="${f(x + 16 * sc)}" y="${f(y + 72 * sc)}" width="${f(84 * sc)}" height="${f(16 * sc)}" rx="${f(8 * sc)}" fill="${fg}"/>`;
    }
  }
  const glow = `<radialGradient id="g" cx="50%" cy="${horizon / H * 100}%" r="60%"><stop offset="0" stop-color="${COBALT}" stop-opacity=".45"/><stop offset="1" stop-color="${COBALT}" stop-opacity="0"/></radialGradient>`;
  const fade = `<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${INK}"/><stop offset=".42" stop-color="${INK}" stop-opacity="0"/></linearGradient>`;
  writeFileSync(
    join(out, "weberv.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${glow}${fade}</defs><rect width="${W}" height="${H}" fill="${INK}"/><rect width="${W}" height="${H}" fill="url(#g)"/><line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="rgba(236,233,226,.25)"/>${g}<rect width="${W}" height="${H}" fill="url(#fade)"/></svg>`,
  );
}

// ── 3. Stepra: job cards climbing like steps ────────────────────────────────────────────
{
  const MINT = "#3DDC97", BG = "#0D1512", CARD = "#15211C";
  let g = "";
  const n = 6;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const x = 150 + i * 205, y = 770 - i * 118;
    const top = i === n - 1;
    pts.push([x + 30, y + 75]);
    g += `<rect x="${x}" y="${y}" width="390" height="150" rx="22" fill="${top ? MINT : CARD}" stroke="${top ? "none" : "rgba(61,220,151,.28)"}" stroke-width="1.5"/>`;
    g += `<circle cx="${x + 52}" cy="${y + 75}" r="26" fill="${top ? BG : "rgba(61,220,151,.18)"}"/>`;
    g += `<rect x="${x + 100}" y="${y + 50}" width="${170 - (i % 3) * 22}" height="16" rx="8" fill="${top ? BG : "rgba(232,239,234,.75)"}"/>`;
    g += `<rect x="${x + 100}" y="${y + 82}" width="${112 + (i % 2) * 30}" height="12" rx="6" fill="${top ? "rgba(13,21,18,.55)" : "rgba(232,239,234,.32)"}"/>`;
    g += `<rect x="${x + 300}" y="${y + 56}" width="58" height="38" rx="19" fill="none" stroke="${top ? BG : "rgba(61,220,151,.5)"}" stroke-width="1.5"/>`;
    if (top) g += `<path d="M${x + 40} ${y + 76} l9 9 l16 -18" fill="none" stroke="${MINT}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const path = `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${MINT}" stroke-width="1.5" stroke-dasharray="3 9" opacity=".6"/>`;
  const glow = `<radialGradient id="m" cx="82%" cy="12%" r="55%"><stop offset="0" stop-color="${MINT}" stop-opacity=".22"/><stop offset="1" stop-color="${MINT}" stop-opacity="0"/></radialGradient>`;
  writeFileSync(
    join(out, "stepra.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${glow}</defs><rect width="${W}" height="${H}" fill="${BG}"/><rect width="${W}" height="${H}" fill="url(#m)"/>${guides(12, "rgba(61,220,151,.07)")}${path}${g}</svg>`,
  );
}
console.log("covers ok");
