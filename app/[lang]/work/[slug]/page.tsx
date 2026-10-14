import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { dictionaries, hasLocale, localePath } from "@/content/i18n";
import { projects } from "@/content/projects";

// Every case study is prerendered. Letting the navigation wait for it (instead of streaming a
// param-free shell first) means the page commits in one go, so the shared-title view transition can form.
export const instant = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p || !hasLocale(lang)) return {};
  const path = `/work/${slug}`;
  return {
    title: p.name,
    description: p.text[lang].line,
    alternates: {
      canonical: localePath(lang, path),
      languages: { en: path, sk: localePath("sk", path), "x-default": path },
    },
  };
}

export default async function CaseStudy({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();

  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const t = dictionaries[lang].work;
  const c = p.text[lang];

  return (
    <main id="main" className="relative z-10 pb-[12svh]" style={{ "--accent": p.accent } as React.CSSProperties}>
      <header className="wrap pt-28 md:pt-36">
        <Link href={`${localePath(lang)}#work`} className="label hover:text-paper">
          <span aria-hidden>←</span> {t.back}
        </Link>
        <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
          <h1 className="display mt-8 text-[clamp(3rem,11vw,11rem)]">{p.name}</h1>
        </ViewTransition>
        <div className="cols mt-8 gap-y-8">
          <p className="lead col-span-4 max-w-[38ch] md:col-span-6">{c.line}</p>
          <dl className="col-span-4 grid grid-cols-3 gap-4 md:col-span-5 md:col-start-8">
            {[
              [t.year, p.year],
              [t.role, p.role],
              [t.stack, p.stack],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3">
                <dt className="label">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <figure className="wrap mt-12 md:mt-16">
        <div className="overflow-hidden rounded-2xl bg-panel shadow-[0_60px_160px_-60px_var(--accent)]">
          {p.media.type === "video" ? (
            <video src={p.media.src} poster={p.media.poster} autoPlay muted loop playsInline className="w-full" />
          ) : (
            <img src={p.media.src} alt={p.name} className="aspect-[16/10] w-full object-cover object-top" />
          )}
        </div>
      </figure>

      <div className="wrap cols mt-[12svh] gap-y-14">
        {[
          [t.problem, c.problem],
          [t.did, c.did],
          [t.result, c.result],
        ].map(([k, v], n) => (
          <section key={k} className={`col-span-4 md:col-span-6 ${n % 2 ? "md:col-start-7" : ""}`}>
            <h2 className="label">{k}</h2>
            <p className="lead mt-4 max-w-[40ch]">{v}</p>
          </section>
        ))}
      </div>

      <div className="wrap mt-[10svh] flex flex-wrap gap-3">
        <a href={p.url} target="_blank" rel="noopener" className="btn btn-primary">
          {t.visit} <span aria-hidden>↗</span>
        </a>
      </div>

      <nav aria-label={t.next} className="wrap mt-[14svh] border-t border-line pt-8">
        <p className="label">{t.next}</p>
        <Link href={localePath(lang, `/work/${next.slug}`)} className="group mt-4 block" data-cursor="open">
          <span className="display block text-[clamp(2.4rem,8vw,8rem)] transition-colors group-hover:text-link">
            {next.name} <span aria-hidden>→</span>
          </span>
        </Link>
      </nav>
    </main>
  );
}
