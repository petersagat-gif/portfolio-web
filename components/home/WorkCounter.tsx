"use client";

import { useEffect, useRef } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** A fixed "02 / 04" that follows the reader through the work section (desktop). */
export default function WorkCounter({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const num = el.querySelector("[data-n]")!;
    const section = el.closest("section")!;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.target === section) el.dataset.on = e.isIntersecting ? "1" : "0";
          else if (e.isIntersecting) num.textContent = pad(Number((e.target as HTMLElement).dataset.project) + 1);
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    io.observe(section);
    section.querySelectorAll("[data-project]").forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-on="0" className="work-counter meta fixed left-[var(--gutter)] top-1/2 z-40 hidden -translate-y-1/2 md:block" aria-hidden>
      <span data-n className="text-paper">
        01
      </span>{" "}
      / {pad(total)}
    </div>
  );
}
