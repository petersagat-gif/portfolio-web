"use client";

import { useState } from "react";
import { tech } from "@/content/site";

/** The stack as a three-layer architecture. Packets flow down the buses; pick a node to see its job. */
export default function Technology() {
  const [sel, setSel] = useState<[string, string, number] | null>(null);
  return (
    <section id="technology" className="section" aria-labelledby="tech-title">
      <div className="wrap">
        <h2 id="tech-title" className="h2 h2-long max-w-[20ch]">
          {tech.heading}
        </h2>
        <div className="mt-[9vh]">
          {tech.layers.map((layer, li) => (
            <div key={layer.name}>
              {li > 0 ? <Bus /> : null}
              <div className="grid gap-5 border-t border-line pt-6 md:grid-cols-[13rem_1fr]">
                <p className={`meta transition-colors ${sel?.[2] === li ? "!text-accent-soft" : ""}`}>
                  {String(li + 1).padStart(2, "0")} {layer.name}
                </p>
                <ul className="flex flex-wrap gap-2.5">
                  {layer.items.map(([name, note]) => (
                    <li key={name}>
                      <button
                        type="button"
                        className="tech-node"
                        data-on={sel?.[0] === name || undefined}
                        onPointerEnter={(e) => e.pointerType === "mouse" && setSel([name, note, li])}
                        onFocus={() => setSel([name, note, li])}
                        onClick={() => setSel([name, note, li])}
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <p className="meta mt-10 min-h-[1.5em] border-t border-line pt-5" aria-live="polite">
            {sel ? (
              <>
                <span className="text-paper">{sel[0]}.</span> {sel[1]}
              </>
            ) : (
              "Pick a technology to see where it earns its place."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Vertical data bus between two layers, with packets travelling down it. */
function Bus() {
  return (
    <div className="tech-bus relative my-3 h-16" aria-hidden>
      {[12, 31, 54, 77, 93].map((x, i) => (
        <span key={x} className="absolute inset-y-0 w-px bg-line" style={{ left: `${x}%` }}>
          <i className="tech-packet" style={{ animationDelay: `${i * -0.47}s` }} />
        </span>
      ))}
    </div>
  );
}
