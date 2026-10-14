import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Footer } from "@/components/home/sections";
import Reveal from "@/components/Reveal";
import { CTA, work } from "@/content/site";

// Every case study is prerendered; waiting for it (rather than streaming a shell first) lets the
// shared title and preview morph from the home page in one commit.
export const instant = false;

export function generateStaticParams() {
  return work.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = work.projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name}, ${p.industry}`,
    description: `${p.challenge} ${p.solution}`,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function CaseStudy({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { slug } = await params;
  const i = work.projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = work.projects[i];
  const next = work.projects[(i + 1) % work.projects.length];

  return (
    <>
      <main id="main" className="relative z-10" style={{ "--accent-p": p.accent } as React.CSSProperties}>
        <header className="wrap pt-28 md:pt-36">
          <Link href="/#work" className="meta u-link">
            ← All work
          </Link>
          <p className="meta mt-10">
            {String(i + 1).padStart(2, "0")} / {String(work.projects.length).padStart(2, "0")}
            {p.sample ? <span className="ml-3 text-accent-soft">Sample project</span> : null}
          </p>
          <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
            <h1 className="mark mt-4 text-[clamp(3.2rem,11vw,11rem)]">{p.name}</h1>
          </ViewTransition>
          <p className="lead muted mt-5 max-w-[36ch]">{p.industry}</p>
        </header>

        <figure className="wrap mt-14">
          <ViewTransition name={`shot-${p.slug}`} share="morph" default="none">
            <div className="browser relative">
              <div className="flex h-9 items-center gap-1.5 border-b border-line px-4" aria-hidden>
                {[0, 1, 2].map((k) => (
                  <span key={k} className="size-2.5 rounded-full bg-paper/20" />
                ))}
                <span className="meta ml-4">{p.name.toLowerCase().replace(/\s/g, "")}.com</span>
              </div>
              {/* A real scrolling mockup: scroll inside the frame. */}
              <div className="max-h-[78vh] overflow-y-auto overscroll-contain" tabIndex={0} aria-label={`${p.name} page preview, scrollable`}>
                <img src={p.page} alt={`${p.name}: full page design`} className="w-full" />
              </div>
              <span className="absolute bottom-0 left-0 h-[3px] w-full" style={{ background: p.accent }} />
            </div>
          </ViewTransition>
          <figcaption className="meta mt-3">Scroll inside the frame to see the whole page.</figcaption>
        </figure>

        <section className="wrap grid gap-14 py-[16vh] md:grid-cols-2" aria-label="Case study">
          <div>
            <h2 className="meta">Challenge</h2>
            <p className="h3 mt-4">{p.challenge}</p>
          </div>
          <div>
            <h2 className="meta">Solution</h2>
            <p className="h3 mt-4">{p.solution}</p>
          </div>
          <dl className="grid gap-8 sm:grid-cols-3 md:col-span-2">
            {[
              ["Services", p.services.join(", ")],
              ["Technology", p.tech.join(", ")],
              ["Result", p.result],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-line pt-4">
                <dt className="meta">{k}</dt>
                <dd className="mt-2">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener" className="btn btn-ghost">
                Visit the live site <span className="arrow">↗</span>
              </a>
            ) : null}
            <Link href="/#contact" className="btn btn-primary">
              {CTA} <span className="arrow">→</span>
            </Link>
          </div>
        </section>

        <nav aria-label="Next project" className="wrap border-t border-line py-[10vh]">
          <p className="meta">Next project</p>
          <Link href={`/work/${next.slug}`} data-cursor="view" className="group mt-4 block">
            <span className="mark block text-[clamp(2.6rem,9vw,8.5rem)] transition-colors duration-500 group-hover:text-accent">
              {next.name} <span className="arrow">→</span>
            </span>
            <span className="lead muted mt-3 block">{next.industry}</span>
          </Link>
        </nav>
        <Reveal />
      </main>
      <Footer />
    </>
  );
}
