"use client";

import { useEffect, useRef, useState } from "react";
import { capabilities, type CapabilityId } from "@/content/site";

const pad = (n: number) => String(n).padStart(2, "0");

/** Eight capabilities. Hover or focus picks one (tap on touch); each has its own live demo. */
export default function Capabilities() {
  const [active, setActive] = useState<CapabilityId>("design");
  const current = capabilities.find((c) => c.id === active)!;
  return (
    <section id="capabilities" className="section" aria-labelledby="cap-title">
      <div className="wrap">
        <h2 id="cap-title" className="h2 max-w-[12ch]">
          What we build
        </h2>
        <div className="mt-[10vh] grid gap-12 lg:grid-cols-[1.25fr_1fr]">
          <ul className="cap-list" role="list">
            {capabilities.map((c, i) => {
              const on = c.id === active;
              return (
                <li key={c.id} className="border-t border-line last:border-b">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`cap-${c.id}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(c.id)}
                    onFocus={() => setActive(c.id)}
                    onClick={() => setActive(c.id)}
                    className="cap-row group flex w-full items-baseline gap-5 py-5 text-left md:py-6"
                    data-on={on || undefined}
                  >
                    <span className="meta w-7 shrink-0">{pad(i + 1)}</span>
                    <span className="h3 transition-[color,translate] duration-500 group-data-[on]:translate-x-3 group-data-[on]:text-accent-soft">
                      {c.name}
                    </span>
                  </button>
                  {/* Touch / narrow screens: the demo opens inline under its row. */}
                  {on ? (
                    <div className="pb-8 lg:hidden">
                      <p className="muted max-w-[44ch]">{c.body}</p>
                      <Demo id={c.id} className="mt-6" />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="hidden lg:block">
            <div className="sticky top-28" id={`cap-${current.id}`} aria-live="polite">
              <Demo id={current.id} key={current.id} />
              <p className="lead muted mt-8 max-w-[34ch]">{current.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Demo({ id, className = "" }: { id: CapabilityId; className?: string }) {
  const D = demos[id];
  return (
    <div className={`demo relative aspect-[5/4] overflow-hidden bg-ink-2 ring-1 ring-line ${className}`} data-demo={id} aria-hidden>
      <D />
    </div>
  );
}

/** Web design: content blocks re-flow between three layouts on a 12-column grid. */
function DesignDemo() {
  const [layout, setLayout] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setLayout((l) => (l + 1) % 3), 1700);
    return () => clearInterval(t);
  }, []);
  // [x, y, w, h] in % for each block, per layout
  const L = [
    [[6, 8, 58, 30], [68, 8, 26, 30], [6, 44, 26, 48], [36, 44, 58, 22], [36, 70, 58, 22]],
    [[6, 8, 88, 36], [6, 50, 42, 42], [52, 50, 42, 18], [52, 72, 20, 20], [74, 72, 20, 20]],
    [[6, 8, 26, 84], [36, 8, 58, 54], [36, 66, 18, 26], [56, 66, 18, 26], [76, 66, 18, 26]],
  ];
  return (
    <>
      <div className="demo-grid absolute inset-[6%]" />
      {L[layout].map(([x, y, w, h], i) => (
        <div
          key={i}
          className="demo-block absolute"
          style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, background: i === 0 ? "var(--accent)" : undefined }}
        />
      ))}
    </>
  );
}

/** Web development: code types itself, then the build passes. */
function DevDemo() {
  const lines = [
    ["k", "export default ", "f", "async function ", "n", "Page", "p", "() {"],
    ["p", "  const ", "n", "work", "p", " = await ", "f", "getProjects", "p", "();"],
    ["p", "  return ", "t", "<Showcase ", "n", "items", "p", "={work} />;"],
    ["p", "}"],
    ["c", "", "c", "", "c", "", "ok", "✓ Compiled successfully."],
  ];
  return (
    <pre className="demo-code absolute inset-0 p-[8%] font-mono text-[clamp(0.6rem,1vw,0.85rem)] leading-[1.9]">
      {lines.map((l, i) => (
        <span key={i} className="block" style={{ "--i": i } as React.CSSProperties}>
          {l.map((part, j) => (j % 2 ? <span key={j} className={`tk-${l[j - 1]}`}>{part}</span> : null))}
        </span>
      ))}
    </pre>
  );
}

/** UI/UX: a pointer finds the button, presses it, and the state resolves. */
function UxDemo() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="demo-card w-[62%] p-[6%]">
        <div className="h-2 w-1/2 rounded-full bg-paper/30" />
        <div className="mt-3 h-2 w-3/4 rounded-full bg-paper/15" />
        <div className="demo-press mt-6 grid h-9 place-items-center rounded-full bg-accent text-[0.75rem] font-semibold text-white">
          <span className="demo-press-a">Continue</span>
          <span className="demo-press-b">Done ✓</span>
        </div>
      </div>
      <svg className="demo-pointer absolute w-[7%]" viewBox="0 0 20 24">
        <path d="M2 2l0 18 5-4 4 7 3-1.5-4-7 6.5-.5z" fill="#ededea" stroke="#0b0b0c" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/** Motion: the studio's signature easing curve, and a block travelling on it. */
function MotionDemo() {
  return (
    <div className="absolute inset-[10%]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <path d="M0 100 H100 M0 100 V0" stroke="rgb(237 237 234 / .2)" fill="none" vectorEffect="non-scaling-stroke" />
        <path className="demo-curve" d="M0 100 C22 0 36 0 100 0" stroke="var(--accent)" strokeWidth="2" fill="none" pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="demo-ball absolute bottom-0 left-0 size-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-paper" />
      <span className="demo-slide absolute -bottom-[14%] left-0 h-[6%] w-[18%] bg-accent" />
    </div>
  );
}

/** 3D: a wireframe cube in real CSS 3D that leans towards the pointer. */
function ThreeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="demo-3d absolute inset-0 grid place-items-center"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ref.current!.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -40}deg`);
        ref.current!.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 60}deg`);
      }}
    >
      <div className="demo-cube">
        {["f", "b", "l", "r", "t", "d"].map((f) => (
          <span key={f} className={`face face-${f}`} />
        ))}
      </div>
    </div>
  );
}

/** AI: a question goes in, the answer streams out. */
function AiDemo() {
  return (
    <div className="demo-ai absolute inset-[8%] flex flex-col justify-end gap-3 text-[clamp(0.65rem,1vw,0.85rem)]">
      <p className="demo-q self-end rounded-2xl rounded-br-sm bg-paper/10 px-3 py-2">Which page loses the most visitors?</p>
      <div className="demo-a self-start rounded-2xl rounded-bl-sm px-3 py-2 ring-1 ring-line">
        <span className="demo-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="demo-stream">Pricing. Most visitors leave before the plans load. Moving them above the fold is the first fix.</span>
      </div>
    </div>
  );
}

/** Automation: a form entry travels through calendar and e-mail to the CRM. */
function AutoDemo() {
  const nodes = ["Form", "Calendar", "E-mail", "CRM"];
  return (
    <div className="absolute inset-[8%] flex items-center justify-between">
      <div className="absolute inset-x-[8%] top-1/2 h-px bg-line">
        <span className="demo-packet absolute -top-[3px] size-[7px] rounded-full bg-accent" />
        <span className="demo-packet absolute -top-[3px] size-[7px] rounded-full bg-accent" style={{ animationDelay: "-1.2s" }} />
      </div>
      {nodes.map((n, i) => (
        <div key={n} className="demo-node relative grid aspect-square w-[17%] place-items-center bg-ink ring-1 ring-line" style={{ "--i": i } as React.CSSProperties}>
          <span className="font-mono text-[clamp(0.5rem,0.8vw,0.7rem)]">{n}</span>
        </div>
      ))}
    </div>
  );
}

/** Branding: the mark cycles through weights and widths, then settles. */
function BrandDemo() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <p className="demo-brand mark text-[clamp(2rem,4.4vw,3.6rem)]">
        WEB
        <span className="bars">
          <i />
          <i />
          <i />
        </span>
        RV
      </p>
      <div className="absolute bottom-[10%] left-1/2 flex -translate-x-1/2 gap-2">
        {["#0b0b0c", "#131315", "#ededea", "#8e8e93", "#3d5bff"].map((c) => (
          <span key={c} className="size-5 ring-1 ring-line" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

const demos: Record<CapabilityId, () => React.JSX.Element> = {
  design: DesignDemo,
  dev: DevDemo,
  ux: UxDemo,
  motion: MotionDemo,
  "3d": ThreeDemo,
  ai: AiDemo,
  auto: AutoDemo,
  brand: BrandDemo,
};
