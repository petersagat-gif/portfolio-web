"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CTA, EMAIL, footer, nav, work } from "@/content/site";

/** The WebERV mark: WEB≡RV. The bars are the "E" of ERV. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <span className={`mark ${className}`} aria-label="WebERV">
      <span aria-hidden className="mark-letters">WEB</span>
      <span aria-hidden className="bars">
        <i />
        <i />
        <i />
      </span>
      <span aria-hidden className="mark-letters">RV</span>
    </span>
  );
}

export default function Nav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const close = () => {
    const d = dialog.current;
    if (!d?.open) return;
    d.dataset.closing = "";
    setTimeout(() => {
      d.close();
      delete d.dataset.closing;
    }, 380);
  };

  useEffect(() => {
    const d = dialog.current!;
    const onClose = () => {
      setOpen(false);
      document.documentElement.style.overflow = "";
      toggle.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <header className="nav-bar fixed inset-x-0 top-0 z-50">
        <div className="wrap flex h-[72px] items-center justify-between">
          <Link href="/" className="nav-mark text-[1.35rem]" aria-label="WebERV, home">
            <Mark />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="u-link text-[0.95rem]">
                {n.label}
              </a>
            ))}
          </nav>
          <button
            ref={toggle}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => {
              dialog.current?.showModal();
              document.documentElement.style.overflow = "hidden";
              setOpen(true);
            }}
            className="menu-btn flex items-center gap-3 rounded-full py-2 pl-2 pr-1 text-[0.95rem]"
          >
            Menu
            <span className="menu-icon" aria-hidden>
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <dialog
        ref={dialog}
        className="menu"
        aria-label="Site menu"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <div className="wrap flex min-h-[100dvh] flex-col py-5">
          <div className="flex h-[52px] items-center justify-between">
            <Mark className="text-[1.35rem]" />
            <button type="button" onClick={close} className="u-link text-[0.95rem]" autoFocus>
              Close
            </button>
          </div>
          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.3fr_1fr]">
            <ul className="menu-links">
              {nav.map((n, i) => (
                <li key={n.href} style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={n.href}
                    onClick={close}
                    onPointerEnter={() => setPreview(n.label)}
                    onFocus={() => setPreview(n.label)}
                    className="group flex items-baseline gap-5"
                  >
                    <span className="meta w-8">0{i + 1}</span>
                    <span className="h2 transition-colors duration-300 group-hover:text-accent">{n.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            {/* Hover preview: the work, or a line about where the link goes. */}
            <div className="menu-preview relative hidden aspect-[4/3] overflow-hidden lg:block" aria-hidden>
              {work.projects.map((p, i) => (
                <img
                  key={p.slug}
                  src={p.page}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-[opacity,translate] duration-700"
                  style={{
                    opacity: preview === "Work" ? 1 : 0,
                    translate: preview === "Work" ? `${i * 6}% ${8 + i * 7}%` : "0 18%",
                    transitionDelay: `${i * 60}ms`,
                    scale: 0.82,
                  }}
                />
              ))}
              <p className="meta absolute left-0 top-0">{preview ? `Go to ${preview.toLowerCase()}` : "Pick a destination"}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
            <Link href="/#contact" onClick={close} className="btn btn-primary">
              {CTA} <span className="arrow">→</span>
            </Link>
            <a href={`mailto:${EMAIL}`} className="u-link">
              {EMAIL}
            </a>
            <ul className="flex flex-wrap gap-5">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" className="u-link meta !text-paper">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}
