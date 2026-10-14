"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localePath, type Dict, type Locale } from "@/content/i18n";
import { setSound, tick } from "@/lib/sound";

export default function Nav({ lang, t }: { lang: Locale; t: Dict["nav"] }) {
  const path = usePathname();
  const [sound, setSoundState] = useState(false);
  // Counterpart URL in the other language: EN lives at "/", SK at "/sk".
  const bare = path.replace(/^\/sk(?=\/|$)/, "") || "/";
  const other: Locale = lang === "en" ? "sk" : "en";

  return (
    <header className="wrap pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between py-4 md:py-5">
      <div className="pointer-events-auto flex items-center gap-5">
        <Link href={localePath(lang)} aria-label={t.home} className="display text-[1.15rem] tracking-normal">
          PŠ<span className="text-cobalt">.</span>
        </Link>
        {/* Build status: the label text is set from CSS by html[data-stage]. Decorative. */}
        <span className="label status hidden items-center gap-2 sm:inline-flex" aria-hidden>
          <span className="dot" />
          <span className="status-text" />
        </span>
      </div>

      <nav className="pointer-events-auto flex items-center gap-2 md:gap-3">
        <Link
          href={localePath(other, bare)}
          hrefLang={other}
          lang={other}
          aria-label={t.switchTo}
          className="label rounded-full px-3 py-2.5 text-paper hover:text-link"
        >
          {t.switchShort}
        </Link>
        <button
          type="button"
          aria-pressed={sound}
          onClick={() => {
            setSound(!sound);
            setSoundState(!sound);
            tick(900, 0.08, 0.05);
          }}
          className="label flex items-center gap-2 rounded-full px-3 py-2.5 text-paper hover:text-link"
        >
          <SoundBars on={sound} />
          <span className="sr-only md:not-sr-only">{sound ? t.soundOn : t.soundOff}</span>
        </button>
        <a href="#contact" className="btn btn-primary text-sm">
          {t.cta}
        </a>
      </nav>
    </header>
  );
}

function SoundBars({ on }: { on: boolean }) {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden className="shrink-0">
      {[2, 6, 10].map((x, i) => (
        <rect
          key={x}
          x={x - 1}
          width="2"
          rx="1"
          fill="currentColor"
          y={on ? [2, 0, 4][i] : 5}
          height={on ? [10, 12, 8][i] : 2}
        />
      ))}
    </svg>
  );
}
