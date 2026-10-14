"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { CTA } from "@/content/site";

const Physics = dynamic(() => import("./lab/Physics"), { ssr: false });

/** The 404 is a toy: the missing page's number falls in, and you can throw it around. */
export default function NotFoundView() {
  return (
    <main id="main" className="relative z-10 min-h-[100dvh]">
      <div className="absolute inset-0" data-cursor="drag">
        <Physics word="404" />
      </div>
      <div className="wrap pointer-events-none relative flex min-h-[100dvh] flex-col justify-end pb-12 pt-32">
        <h1 className="h2 max-w-[14ch]">This page doesn&apos;t exist. Yet.</h1>
        <p className="lead muted mt-5 max-w-[34ch]">The link is broken or the page moved. The numbers above are real physics: grab one and throw it.</p>
        <div className="pointer-events-auto mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back to the homepage <span className="arrow">→</span>
          </Link>
          <Link href="/#contact" className="btn btn-ghost">
            {CTA}
          </Link>
        </div>
      </div>
    </main>
  );
}
