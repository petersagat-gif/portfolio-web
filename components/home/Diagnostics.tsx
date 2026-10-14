"use client";

import { useEffect, useRef, useState } from "react";
import { performance as copy } from "@/content/site";

type Metric = { label: string; value: number | null; unit: string; good: number; poor: number; digits?: number; note: string };

const fmt = (m: Metric) =>
  m.value == null ? "..." : m.unit === "KB" ? Math.round(m.value).toLocaleString("en") : m.value.toFixed(m.digits ?? 0);
const grade = (m: Metric) => (m.value == null ? "pending" : m.value <= m.good ? "good" : m.value <= m.poor ? "fair" : "poor");

/**
 * A live diagnostic of this very page, measured in the visitor's browser: Core Web Vitals,
 * what was transferred, and frame rate. Nothing is invented and nothing is sent anywhere.
 */
export default function Diagnostics() {
  const [m, setM] = useState({
    ttfb: null as number | null,
    fcp: null as number | null,
    lcp: null as number | null,
    cls: 0,
    inp: null as number | null,
    kb: null as number | null,
    reqs: null as number | null,
    dom: null as number | null,
  });
  const [fps, setFps] = useState<number[]>([]);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const bytes = resources.reduce((a, r) => a + (r.transferSize || 0), nav?.transferSize ?? 0);
    const first = requestAnimationFrame(() => setM((s) => ({
      ...s,
      ttfb: nav ? nav.responseStart : null,
      fcp: fcp ? fcp.startTime : null,
      kb: bytes / 1024,
      reqs: resources.length + 1,
      dom: document.getElementsByTagName("*").length,
    })));
    const obs: PerformanceObserver[] = [];
    const watch = (type: string, fn: (e: PerformanceEntry[]) => void, extra: object = {}) => {
      try {
        const o = new PerformanceObserver((l) => fn(l.getEntries()));
        o.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
        obs.push(o);
      } catch {} // older browsers: that metric simply stays "..."
    };
    watch("largest-contentful-paint", (es) => setM((s) => ({ ...s, lcp: es.at(-1)!.startTime })));
    watch("layout-shift", (es) =>
      setM((s) => ({ ...s, cls: s.cls + es.reduce((a, e) => a + ((e as unknown as { hadRecentInput: boolean; value: number }).hadRecentInput ? 0 : (e as unknown as { value: number }).value), 0) })),
    );
    watch("event", (es) => setM((s) => ({ ...s, inp: Math.max(s.inp ?? 0, ...es.map((e) => e.duration)) })), { durationThreshold: 16 });
    return () => {
      cancelAnimationFrame(first);
      obs.forEach((o) => o.disconnect());
    };
  }, []);

  // Frame rate, sampled once a second while the panel is on screen.
  useEffect(() => {
    let raf = 0, frames = 0, start = 0, on = false;
    const tick = (now: number) => {
      if (!start) start = now;
      frames++;
      if (now - start >= 1000) {
        const v = Math.round((frames * 1000) / (now - start));
        setFps((f) => [...f.slice(-29), v]);
        frames = 0;
        start = now;
      }
      raf = on ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on && !raf) {
        start = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(box.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const metrics: Metric[] = [
    { label: "Time to first byte", value: m.ttfb, unit: "ms", good: 800, poor: 1800, note: "Server response" },
    { label: "First contentful paint", value: m.fcp, unit: "ms", good: 1800, poor: 3000, note: "First pixels of content" },
    { label: "Largest contentful paint", value: m.lcp, unit: "ms", good: 2500, poor: 4000, note: "Main content visible" },
    { label: "Cumulative layout shift", value: m.cls, unit: "", good: 0.1, poor: 0.25, digits: 3, note: "Visual stability" },
    { label: "Interaction latency", value: m.inp, unit: "ms", good: 200, poor: 500, note: m.inp == null ? "Click anything to measure" : "Slowest so far" },
    { label: "Transferred", value: m.kb, unit: "KB", good: 1500, poor: 4000, note: `${m.reqs ?? "..."} requests` },
  ];
  const now = fps.at(-1);

  return (
    <div ref={box} className="diag ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="meta">
          <span className="diag-live" aria-hidden /> Live diagnostic: this page, your browser
        </p>
        <p className="meta">{m.dom ?? "..."} DOM nodes</p>
      </div>
      <dl className="grid sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((x) => (
          <div key={x.label} className="diag-cell border-b border-line p-5 sm:border-r" data-grade={grade(x)}>
            <dt className="meta">{x.label}</dt>
            <dd className="mt-3 flex items-baseline gap-2">
              <span className="diag-num">{fmt(x)}</span>
              <span className="meta">{x.unit}</span>
              <span className="diag-grade meta ml-auto">{grade(x)}</span>
            </dd>
            <dd className="meta mt-1">{x.note}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-end gap-6 p-5">
        <div>
          <p className="meta">Frame rate</p>
          <p className="mt-2">
            <span className="diag-num">{now ?? "..."}</span> <span className="meta">fps</span>
          </p>
        </div>
        <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="h-14 flex-1" aria-hidden>
          <polyline
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            points={fps.map((v, i) => `${(i / 29) * 300},${60 - Math.min(v, 120) / 2}`).join(" ")}
          />
        </svg>
      </div>
      <p className="sr-only">{copy.sub}</p>
    </div>
  );
}
