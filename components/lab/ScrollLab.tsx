/** Interaction 05: everything here is driven by the panel's own scroll position, in CSS only. */
export default function ScrollLab() {
  return (
    <div className="sl absolute inset-0 overflow-y-auto overscroll-contain" tabIndex={0} aria-label="Scroll-driven animation demo. Scroll inside this panel.">
      <div className="sl-sticky sticky top-0 grid h-full place-items-center">
        <div className="relative grid place-items-center">
          <svg viewBox="0 0 120 120" className="sl-ring w-[min(52vw,260px)] -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(237 237 234 / .12)" strokeWidth="2" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" strokeWidth="2" pathLength={1} className="sl-arc" />
          </svg>
          <p className="sl-count mark absolute text-[clamp(2.2rem,6vw,4.5rem)]" aria-hidden />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="sl-card absolute h-[78%] w-[62%] ring-1 ring-paper/15" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <p className="meta absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">Scroll inside this panel</p>
      </div>
      <div className="h-[300%]" aria-hidden />
    </div>
  );
}
