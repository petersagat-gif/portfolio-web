// Full-page design renders for the Selected Work previews (1440 × 3600, they scroll inside the
// browser frames). Replace with real screenshots when they exist. Run: node scripts/pages.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const W = 1440, H = 3600;
const out = "public/work/pages";
mkdirSync(out, { recursive: true });
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";
const serif = "Georgia, Times New Roman, serif";

const rect = (x, y, w, h, fill, r = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const text = (x, y, s, size, fill, { font = sans, weight = 400, anchor = "start", ls = 0, op = 1 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" opacity="${op}">${s}</text>`;
const lines = (x, y, widths, h, gap, fill, op = 1) => widths.map((w, i) => rect(x, y + i * (h + gap), w, h, fill, h / 2, `opacity="${op}"`)).join("");
const svg = (bg, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${rect(0, 0, W, H, bg)}${body}</svg>`;

// ── Stepra: recruitment platform (dark, mint) ─────────────────────────────────────────────
{
  const ink = "#0e1512", fg = "#e8efea", mint = "#3ddc97", card = "#15211c", mute = "#8fa39a";
  let b = "";
  b += text(80, 70, "stepra", 30, fg, { weight: 700, ls: -1 }) + rect(205, 52, 10, 10, mint, 5);
  ["Jobs", "Companies", "How it works", "Pricing"].forEach((l, i) => (b += text(720 + i * 150, 70, l, 18, mute)));
  b += rect(1220, 40, 140, 46, mint, 23) + text(1290, 70, "Sign in", 17, ink, { weight: 700, anchor: "middle" });
  b += text(80, 300, "Work across borders,", 92, fg, { weight: 700, ls: -3 });
  b += text(80, 400, "hired in days.", 92, mint, { weight: 700, ls: -3 });
  b += text(80, 470, "One place for candidates and companies: matching, contracts and paperwork.", 24, mute);
  // search bar
  b += rect(80, 540, 900, 76, card, 38) + text(124, 587, "Role, skill or company", 20, mute) + rect(800, 552, 166, 52, mint, 26) + text(883, 585, "Search", 18, ink, { weight: 700, anchor: "middle" });
  ["Remote", "Germany", "Netherlands", "Engineering", "Hospitality"].forEach((t, i) => (b += rect(80 + i * 160, 646, 146, 40, "none", 20, `stroke="${mute}" stroke-opacity=".35"`) + text(153 + i * 160, 672, t, 15, mute, { anchor: "middle" })));
  // job cards
  for (let i = 0; i < 6; i++) {
    const x = 80 + (i % 3) * 440, y = 800 + Math.floor(i / 3) * 300;
    b += rect(x, y, 410, 270, card, 22) + rect(x + 28, y + 28, 54, 54, i % 2 ? "#2a3a33" : mint, 14, `opacity="${i % 2 ? 1 : 0.9}"`);
    b += text(x + 28, y + 128, ["Senior React Developer", "Hotel Operations Lead", "Data Engineer", "Warehouse Supervisor", "UX Researcher", "Sales Manager DACH"][i], 24, fg, { weight: 700 });
    b += text(x + 28, y + 162, ["Berlin or remote", "Amsterdam", "Vienna", "Rotterdam", "Remote, EU", "Munich"][i], 17, mute);
    b += rect(x + 28, y + 200, 110, 34, "none", 17, `stroke="${mint}" stroke-opacity=".5"`) + text(x + 83, y + 223, "Full time", 14, mint, { anchor: "middle" });
    b += text(x + 382, y + 223, "Apply →", 16, fg, { anchor: "end" });
  }
  // steps
  b += text(80, 1520, "How Stepra works", 54, fg, { weight: 700, ls: -1.5 });
  ["Create a profile once", "Get matched to roles", "Sign and start"].forEach((t, i) => {
    const x = 80 + i * 440;
    b += text(x, 1620, `0${i + 1}`, 18, mint, { weight: 700 }) + text(x, 1670, t, 30, fg, { weight: 700 }) + lines(x, 1700, [360, 300, 330], 12, 14, mute, 0.35);
  });
  // dashboard band
  b += rect(80, 1880, 1280, 760, card, 28) + rect(80, 1880, 260, 760, "#111a16", 28);
  ["Overview", "Applications", "Interviews", "Contracts", "Messages"].forEach((t, i) => (b += rect(108, 1930 + i * 60, 204, 44, i === 1 ? "#1f3029" : "none", 12) + text(130, 1958 + i * 60, t, 17, i === 1 ? mint : mute)));
  [["Active roles", "24"], ["Interviews", "9"], ["Offers", "3"]].forEach(([k, v], i) => (b += rect(380 + i * 320, 1930, 290, 150, "#111a16", 18) + text(410 + i * 320, 1980, k, 17, mute) + text(410 + i * 320, 2050, v, 58, fg, { weight: 700 })));
  for (let i = 0; i < 6; i++) b += rect(380, 2120 + i * 82, 940, 66, i % 2 ? "#111a16" : "#17241f", 12) + rect(404, 2141 + i * 82, 24, 24, mint, 12, `opacity="${0.4 + (i % 3) * 0.2}"`) + lines(450, 2146 + i * 82, [260], 12, 0, fg, 0.5) + rect(1180, 2140 + i * 82, 110, 26, "#223a30", 13);
  b += text(W / 2, 2860, "Hiring across borders, without the borders.", 54, fg, { weight: 700, anchor: "middle", ls: -1.5 });
  b += rect(W / 2 - 130, 2920, 260, 64, mint, 32) + text(W / 2, 2961, "Create a profile", 19, ink, { weight: 700, anchor: "middle" });
  b += rect(0, 3200, W, 400, "#08100c") + text(80, 3300, "stepra", 30, fg, { weight: 700 }) + lines(80, 3350, [180, 140, 160], 12, 18, mute, 0.4) + lines(700, 3290, [120, 100, 140, 90], 12, 18, mute, 0.4) + lines(1000, 3290, [120, 100, 140], 12, 18, mute, 0.4);
  writeFileSync(`${out}/stepra.svg`, svg(ink, b));
}

// ── Project 02: luxury residence (warm stone, serif, architecture) ────────────────────────
{
  const bg = "#14120f", fg = "#efe7da", sand = "#c9b38a", mute = "#a39a8b";
  let b = "";
  b += text(80, 74, "MAISON ALDER", 22, fg, { ls: 6 });
  ["Residences", "Location", "Gallery"].forEach((l, i) => (b += text(820 + i * 150, 74, l, 17, mute)));
  b += rect(1240, 46, 120, 44, "none", 0, `stroke="${sand}"`) + text(1300, 74, "Book", 16, sand, { anchor: "middle", ls: 2 });
  // hero: architecture rendered as light and planes
  b += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3026"/><stop offset="1" stop-color="#14120f"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9d6b0" stop-opacity=".55"/><stop offset="1" stop-color="#6d5a40" stop-opacity=".15"/></linearGradient></defs>`;
  b += rect(0, 130, W, 1120, "url(#sky)");
  b += `<circle cx="1120" cy="380" r="120" fill="#f2d9a6" opacity=".55"/>`;
  b += rect(260, 560, 920, 620, "#211c16") + rect(260, 560, 920, 40, "#2c251c");
  for (let i = 0; i < 6; i++) b += rect(300 + i * 145, 640, 120, 470, "url(#glass)");
  b += rect(160, 1150, 1120, 30, "#2c251c") + rect(0, 1180, W, 70, "#0f0d0b");
  b += text(80, 1380, "Light, before", 96, fg, { font: serif, ls: -2 }) + text(80, 1490, "it is built.", 96, sand, { font: serif, ls: -2 });
  b += text(80, 1560, "Twelve residences above the lake. Walk through them today.", 24, mute);
  // floor plan
  b += rect(80, 1680, 640, 640, "none", 0, `stroke="${mute}" stroke-opacity=".5"`);
  [[80, 1680, 380, 360], [460, 1680, 260, 220], [460, 1900, 260, 420], [80, 2040, 220, 280], [300, 2040, 160, 280]].forEach(([x, y, w, h]) => (b += rect(x, y, w, h, "none", 0, `stroke="${fg}" stroke-opacity=".7" stroke-width="2"`)));
  b += rect(560, 1980, 80, 80, sand, 0, 'opacity=".35"') + text(780, 1740, "Residence 04", 44, fg, { font: serif }) + text(780, 1790, "148 m² · Terrace · Lake view", 20, mute);
  b += lines(780, 1840, [460, 420, 440, 300], 12, 16, mute, 0.4);
  b += rect(780, 2000, 220, 60, sand) + text(890, 2038, "Walk through", 18, bg, { anchor: "middle", ls: 1 });
  // gallery
  for (let i = 0; i < 3; i++) b += rect(80 + i * 440, 2460, 410, 520, ["#2a231b", "#3a3026", "#211c16"][i]) + rect(80 + i * 440, 2460 + 300, 410, 220, "url(#glass)");
  b += text(W / 2, 3140, "Private viewings by appointment.", 52, fg, { font: serif, anchor: "middle" });
  b += rect(0, 3260, W, 340, "#0d0b09") + text(80, 3360, "MAISON ALDER", 20, mute, { ls: 6 });
  writeFileSync(`${out}/residence.svg`, svg(bg, b));
}

// ── Project 03: technology startup (light, cobalt, product UI) ────────────────────────────
{
  const bg = "#f4f5f8", fg = "#0f1220", blue = "#3d5bff", mute = "#5c6175", line = "#dde0ea";
  let b = "";
  b += rect(80, 50, 34, 34, blue, 8) + text(128, 76, "Northwave", 24, fg, { weight: 700 });
  ["Product", "Docs", "Customers", "Pricing"].forEach((l, i) => (b += text(760 + i * 130, 74, l, 17, mute)));
  b += rect(1260, 44, 120, 46, fg, 23) + text(1320, 73, "Get started", 15, "#fff", { anchor: "middle", weight: 600 });
  b += rect(80, 190, 260, 36, "#e5e9ff", 18) + text(210, 214, "New: ask the docs anything", 14, blue, { anchor: "middle", weight: 600 });
  b += text(80, 340, "Ship data pipelines", 88, fg, { weight: 700, ls: -3 }) + text(80, 440, "without the pipeline.", 88, blue, { weight: 700, ls: -3 });
  b += text(80, 510, "Connect a source, describe the result, and Northwave builds and runs the rest.", 24, mute);
  b += rect(80, 570, 200, 60, blue, 30) + text(180, 607, "Start free", 18, "#fff", { anchor: "middle", weight: 600 }) + rect(296, 570, 200, 60, "none", 30, `stroke="${line}" stroke-width="2"`) + text(396, 607, "Watch demo", 18, fg, { anchor: "middle" });
  // product window
  b += rect(80, 720, 1280, 760, "#fff", 22, `stroke="${line}" stroke-width="2"`) + rect(80, 720, 1280, 56, "#fafbfd", 22);
  [0, 1, 2].forEach((i) => (b += `<circle cx="${112 + i * 22}" cy="748" r="6" fill="${line}"/>`));
  // node graph
  [[160, 880, "Postgres"], [160, 1060, "Stripe"], [160, 1240, "Webhooks"], [620, 1060, "Transform"], [1040, 960, "Warehouse"], [1040, 1160, "Dashboard"]].forEach(([x, y, l], i) => {
    b += rect(x, y, 220, 84, i === 3 ? blue : "#f4f6ff", 16, `stroke="${i === 3 ? blue : "#cdd4ff"}" stroke-width="2"`) + text(x + 110, y + 50, l, 19, i === 3 ? "#fff" : fg, { anchor: "middle", weight: 600 });
  });
  b += `<path d="M380 922 C500 922 500 1102 620 1102 M380 1102 H620 M380 1282 C500 1282 500 1102 620 1102 M840 1102 C940 1102 940 1002 1040 1002 M840 1102 C940 1102 940 1202 1040 1202" stroke="${blue}" stroke-width="2.5" fill="none" stroke-dasharray="8 8"/>`;
  // assistant
  b += rect(80, 1580, 620, 560, "#fff", 22, `stroke="${line}" stroke-width="2"`) + text(120, 1650, "Ask the docs", 28, fg, { weight: 700 });
  b += rect(300, 1690, 360, 64, "#eef1ff", 18) + text(320, 1730, "How do I retry a failed sync?", 17, fg);
  b += rect(120, 1780, 460, 150, "#f6f7fb", 18) + lines(144, 1810, [380, 400, 300, 340], 11, 16, mute, 0.5);
  b += rect(120, 2050, 540, 56, "#f6f7fb", 28) + text(148, 2084, "Ask a question", 16, mute);
  b += text(780, 1650, "Built for", 54, fg, { weight: 700, ls: -1.5 }) + text(780, 1715, "data teams.", 54, blue, { weight: 700, ls: -1.5 });
  b += lines(780, 1770, [520, 480, 500], 13, 16, mute, 0.4);
  [["SOC 2", 0], ["Uptime SLA", 1], ["EU hosting", 2]].forEach(([t, i]) => (b += rect(780 + i * 180, 1900, 164, 52, "#fff", 26, `stroke="${line}" stroke-width="2"`) + text(862 + i * 180, 1932, t, 15, fg, { anchor: "middle", weight: 600 })));
  // logos + pricing
  for (let i = 0; i < 6; i++) b += rect(80 + i * 215, 2290, 180, 40, "#e3e6ee", 8);
  [["Starter", "Free"], ["Team", "€49"], ["Scale", "Custom"]].forEach(([n, p], i) => {
    const x = 80 + i * 440, hot = i === 1;
    b += rect(x, 2440, 410, 520, hot ? fg : "#fff", 22, `stroke="${line}" stroke-width="2"`) + text(x + 36, 2510, n, 24, hot ? "#fff" : fg, { weight: 700 }) + text(x + 36, 2590, p, 54, hot ? "#fff" : fg, { weight: 700 });
    b += lines(x + 36, 2640, [300, 260, 280, 240], 11, 22, hot ? "#fff" : mute, 0.4) + rect(x + 36, 2860, 338, 56, hot ? blue : bg, 28);
  });
  b += rect(0, 3180, W, 420, fg) + text(80, 3290, "Northwave", 26, "#fff", { weight: 700 }) + lines(80, 3330, [200, 160], 12, 18, "#fff", 0.3);
  writeFileSync(`${out}/startup.svg`, svg(bg, b));
}

// ── Project 04: corporate interactive report (black, signal red, data) ────────────────────
{
  const bg = "#0d0d0e", fg = "#f1efe9", red = "#e4573d", mute = "#97948d";
  let b = "";
  b += text(80, 74, "HALDEN GROUP", 20, fg, { weight: 700, ls: 4 }) + text(80, 104, "Annual Review", 16, mute);
  ["01 Year", "02 People", "03 Impact", "04 Outlook"].forEach((l, i) => (b += text(760 + i * 150, 74, l, 16, i === 2 ? red : mute)));
  b += rect(80, 140, 1280, 2, "#2a2a2c") + rect(80, 140, 520, 2, red);
  b += text(80, 380, "A year in", 120, fg, { weight: 800, ls: -5 }) + text(80, 500, "motion.", 120, red, { weight: 800, ls: -5 });
  b += text(80, 570, "Scroll through the story. Every chart is live and every chapter links to the source.", 24, mute);
  // big chart
  b += rect(80, 680, 1280, 720, "#151517", 0);
  for (let i = 0; i <= 5; i++) b += rect(140, 760 + i * 110, 1160, 1, "#2a2a2c");
  const pts = [0, 0.18, 0.12, 0.34, 0.3, 0.52, 0.47, 0.66, 0.61, 0.82, 0.78, 0.94];
  b += `<polyline fill="none" stroke="${red}" stroke-width="4" points="${pts.map((v, i) => `${140 + i * 105},${1310 - v * 520}`).join(" ")}"/>`;
  b += `<polyline fill="none" stroke="${mute}" stroke-width="2" stroke-dasharray="6 8" points="${pts.map((v, i) => `${140 + i * 105},${1310 - v * 380}`).join(" ")}"/>`;
  b += `<circle cx="${140 + 11 * 105}" cy="${1310 - 0.94 * 520}" r="10" fill="${red}"/>`;
  // chapter: people
  b += text(80, 1560, "02", 22, red, { weight: 700 }) + text(80, 1630, "People", 72, fg, { weight: 800, ls: -2 });
  for (let r = 0; r < 8; r++) for (let c = 0; c < 24; c++) b += `<circle cx="${100 + c * 52}" cy="${1720 + r * 46}" r="13" fill="${(r * 24 + c) % 7 === 0 ? red : "#2a2a2c"}"/>`;
  // bars
  b += text(80, 2210, "03", 22, red, { weight: 700 }) + text(80, 2280, "Impact", 72, fg, { weight: 800, ls: -2 });
  [0.4, 0.62, 0.55, 0.8, 0.72, 0.95, 0.88].forEach((v, i) => (b += rect(80 + i * 182, 2380 + (1 - v) * 520, 140, v * 520, i === 5 ? red : "#2a2a2c")));
  // quote
  b += text(80, 3080, "“The best year we have had,", 52, fg, { font: serif }) + text(80, 3150, "and the clearest we have told.”", 52, red, { font: serif });
  b += rect(0, 3280, W, 320, "#070708") + text(80, 3380, "HALDEN GROUP", 18, mute, { ls: 4 });
  writeFileSync(`${out}/corporate.svg`, svg(bg, b));
}
console.log("pages ok");
