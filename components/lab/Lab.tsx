"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { lab, type ExperimentId } from "@/content/site";

const pad = (n: number) => String(n).padStart(2, "0");
const Loading = () => <div className="lab-loading absolute inset-0" aria-hidden />;

// Each experiment is its own chunk, loaded only when picked.
const experiments: Record<ExperimentId, React.ComponentType> = {
  particles: dynamic(() => import("./Particles"), { ssr: false, loading: Loading }),
  object: dynamic(() => import("./ObjectLab"), { ssr: false, loading: Loading }),
  physics: dynamic(() => import("./Physics"), { ssr: false, loading: Loading }),
  liquid: dynamic(() => import("./Liquid"), { ssr: false, loading: Loading }),
  scroll: dynamic(() => import("./ScrollLab"), { ssr: false, loading: Loading }),
  ai: dynamic(() => import("./AiLab"), { ssr: false, loading: Loading }),
  generative: dynamic(() => import("./Generative"), { ssr: false, loading: Loading }),
};

/** WebERV Lab: pick an experiment, play with it. Only the active one is mounted. */
export default function Lab() {
  const [active, setActive] = useState<ExperimentId>("particles");
  const [near, setNear] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const current = lab.experiments.find((e) => e.id === active)!;
  const Active = experiments[active];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "50% 0px" });
    io.observe(stage.current!);
    return () => io.disconnect();
  }, []);

  return (
    <section id="lab" className="section" aria-labelledby="lab-title">
      <div className="wrap">
        <p className="meta text-accent-soft">WebERV Lab</p>
        <h2 id="lab-title" className="h2 mt-4 max-w-[16ch]">
          {lab.heading}
        </h2>
        <div className="mt-[8vh] grid gap-8 lg:grid-cols-[minmax(15rem,0.42fr)_1fr]">
          <div role="tablist" aria-label="Experiments" className="lab-tabs flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible">
            {lab.experiments.map((e, i) => (
              <button
                key={e.id}
                role="tab"
                id={`tab-${e.id}`}
                aria-selected={e.id === active}
                aria-controls="lab-stage"
                onClick={() => setActive(e.id)}
                className="lab-tab group flex shrink-0 items-baseline gap-4 rounded-full px-4 py-2.5 text-left ring-1 ring-line lg:rounded-none lg:border-t lg:border-line lg:px-0 lg:py-4 lg:ring-0"
              >
                <span className="meta hidden lg:inline">Interaction {pad(i + 1)}</span>
                <span className="font-semibold transition-colors group-aria-selected:text-accent-soft lg:text-lg">{e.name}</span>
              </button>
            ))}
          </div>
          <div>
            <div
              ref={stage}
              id="lab-stage"
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              data-cursor={active === "ai" || active === "scroll" ? undefined : active === "physics" || active === "object" ? "drag" : "play"}
              className="lab-stage relative aspect-[4/5] overflow-hidden bg-ink-2 ring-1 ring-line sm:aspect-[16/11]"
            >
              <Suspense fallback={<Loading />}>{near ? <Active key={active} /> : <Loading />}</Suspense>
            </div>
            <p className="meta mt-4">
              <span className="text-paper">{current.name}.</span> {current.hint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
