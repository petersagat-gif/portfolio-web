// Home page sections. Server components: copy arrives as HTML, interactivity lives in small client islands.
import Link from "next/link";
import { ViewTransition } from "react";
import { contact, localePath, type Dict, type Locale } from "@/content/i18n";
import { comparisons, projectName, projects } from "@/content/projects";
import BeforeAfter from "./BeforeAfter";
import CopyEmail from "./CopyEmail";
import ViewportSize from "./ViewportSize";

type T = { t: Dict };
const pad = (n: number) => String(n).padStart(2, "0");

export function Hero({ t }: T) {
  return (
    <section id="top" className="wrap relative z-10 flex min-h-svh flex-col justify-end pb-5 pt-28">
      {/* Without WebGL (or with reduced motion) the hero object is shown as a drawing. */}
      <img
        src="/work/this-site.svg"
        alt=""
        className="static-only pointer-events-none absolute right-0 top-20 -z-10 w-[min(58vw,820px)] opacity-90 max-md:hidden"
      />
      <p className="label mb-5 md:mb-7">{t.hero.role}</p>
      <h1 className="display hero-name">
        <span className="outline-type block">{t.hero.first}</span>
        <span className="hero-solid block">
          {t.hero.last}
          <span className="text-cobalt">.</span>
        </span>
      </h1>
      <div className="cols mt-8 items-end gap-y-6 md:mt-10">
        <p className="lead col-span-4 max-w-[36ch] md:col-span-5">{t.hero.pitch}</p>
        <div className="col-span-4 flex flex-wrap items-center gap-x-6 gap-y-4 md:col-span-5 md:col-start-8 md:justify-end">
          <span className="label inline-flex items-center gap-2 text-paper">
            <span className="dot" style={{ "--dot": "var(--cobalt)" } as React.CSSProperties} />
            {t.hero.available}
          </span>
          <a href="#contact" className="btn btn-primary">
            {t.contact.cta} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
      <div className="label mt-10 flex items-center justify-between border-t border-line pt-4">
        <ViewportSize />
        <span className="with-3d build inline-flex items-center gap-2" data-build-wrap aria-hidden>
          <span className="dot" /> {t.hero.loading} <span data-build>0%</span>
        </span>
        <span>
          {t.hero.scroll} <span aria-hidden>↓</span>
        </span>
      </div>
    </section>
  );
}

const stageKeys = ["wireframe", "design", "live"] as const;

export function Process({ t }: T) {
  return (
    <section id="process" aria-labelledby="process-title" className="relative z-10">
      <h2 id="process-title" className="wrap label pt-[12svh]">
        {t.process.label}
      </h2>
      <ol>
        {t.process.stages.map((s, i) => (
          <li key={s.name} data-stage-block={stageKeys[i]} className="wrap cols min-h-svh items-end md:items-center">
            <div className="caption col-span-4 pb-[8svh] max-md:bg-gradient-to-t max-md:from-ink max-md:via-ink/85 max-md:pt-20 md:col-span-4 md:pb-0">
              <p className="display outline-type text-[clamp(4.5rem,10vw,9rem)]" aria-hidden>
                {pad(i + 1)}
              </p>
              <h3 className="display mt-4 text-[clamp(2.2rem,4.4vw,4.25rem)]">{s.name}</h3>
              <p className="lead mt-5 max-w-[32ch] text-paper/80">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Work({ lang, t }: T & { lang: Locale }) {
  return (
    <section id="work" aria-labelledby="work-title" className="relative z-10">
      <div className="wrap flex min-h-svh flex-col justify-end pb-[14svh]">
        <h2 id="work-title" className="display text-[clamp(3rem,11vw,11rem)]">
          {t.work.title}
        </h2>
        <p className="lead mt-6 max-w-[42ch] text-paper/80">{t.work.intro}</p>
      </div>
      <ol>
        {projects.map((p, i) => (
          <li key={p.slug} data-project={i} className="wrap flex min-h-[95svh] flex-col justify-end pb-[10svh]">
            <img
              src={p.media.poster ?? p.media.src}
              alt=""
              loading="lazy"
              className="static-only mb-8 aspect-[16/10] w-full max-w-3xl rounded-lg object-cover object-top"
            />
            <p className="label">
              {pad(i + 1)} / {pad(projects.length)} · {p.year}
            </p>
            <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
              <h3 className="display mt-3 text-[clamp(2.4rem,7vw,7rem)]">{projectName(p, lang)}</h3>
            </ViewTransition>
            <p className="lead mt-4 max-w-[40ch] text-paper/80">{p.text[lang].line}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={localePath(lang, `/work/${p.slug}`)} className="btn btn-primary" data-cursor="open">
                {t.work.open} <span aria-hidden>→</span>
              </Link>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener" className="btn btn-ghost">
                  {t.work.visit} <span aria-hidden>↗</span>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Compare({ t }: T) {
  return (
    <section id="compare" aria-labelledby="compare-title" className="relative z-10 py-[16svh]">
      <div className="wrap">
        <h2 id="compare-title" className="display text-[clamp(2.6rem,8vw,8rem)]">
          {t.compare.title}
        </h2>
        <div className="cols mt-10 gap-y-8 md:mt-14">
          <p className="lead col-span-4 max-w-[30ch] md:col-span-3">{t.compare.intro}</p>
          <div className="col-span-4 space-y-10 md:col-span-9">
            {comparisons.map((c) => (
              <figure key={c.id}>
                <BeforeAfter before={c.before} after={c.after} t={t.compare} />
                <figcaption className="label mt-3">{t.compare.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Toolkit({ t }: T) {
  return (
    <section id="toolkit" aria-labelledby="toolkit-title" className="relative z-10">
      <div className="wrap cols pt-[14svh]">
        <h2 id="toolkit-title" className="display col-span-4 text-[clamp(2.6rem,8vw,8rem)] md:col-span-8">
          {t.toolkit.title}
        </h2>
        <p className="lead col-span-4 mt-5 max-w-[34ch] text-paper/80 md:col-span-4 md:mt-0 md:self-end">
          {t.toolkit.intro}
        </p>
      </div>
      {/* With 3D these buttons are moved onto a turning sphere; without it they are a plain list. */}
      <div data-toolkit className="toolkit wrap">
        <ul>
          {t.toolkit.skills.map(([name, note]) => (
            <li key={name}>
              <button type="button" data-skill data-note={note} className="skill">
                {name}
                <span className="skill-note">{note}</span>
              </button>
            </li>
          ))}
        </ul>
        <p data-skill-note className="toolkit-note lead" aria-hidden />
      </div>
    </section>
  );
}

export function Stepra({ t }: T) {
  return (
    <section id="stepra" aria-labelledby="stepra-title" className="relative z-10 overflow-hidden bg-[#0d1512] py-[16svh]">
      <div className="wrap cols gap-y-10">
        <div className="col-span-4 md:col-span-6">
          <p className="label !text-stepra">{t.stepra.label}</p>
          <h2 id="stepra-title" className="display mt-5 text-[clamp(3.4rem,11vw,11rem)] text-stepra">
            Stepra
          </h2>
          <p className="lead mt-8 max-w-[38ch]">{t.stepra.body}</p>
          <p className="label mt-6 text-paper/70">{t.stepra.roles}</p>
          <a
            href={contact.stepraUrl}
            target="_blank"
            rel="noopener"
            className="btn mt-9 bg-stepra text-ink hover:bg-paper"
          >
            {t.stepra.cta} <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="col-span-4 md:col-span-6 md:pl-10">
          <img
            src={projects[0].media.src}
            alt=""
            loading="lazy"
            className="aspect-[4/5] w-full rounded-xl object-cover object-top shadow-[0_40px_120px_-40px_rgb(61_220_151/0.45)] md:rotate-[-3deg]"
          />
        </div>
      </div>
    </section>
  );
}

export function About({ t }: T) {
  return (
    <section id="about" aria-labelledby="about-title" className="relative z-10 py-[18svh]">
      <div className="wrap cols gap-y-8">
        <p className="label col-span-4 md:col-span-2">{t.about.label}</p>
        <h2 id="about-title" className="display col-span-4 text-[clamp(2.4rem,6.4vw,6.5rem)] md:col-span-10">
          {t.about.title}
        </h2>
        <div className="lead col-span-4 space-y-5 text-paper/85 md:col-span-5 md:col-start-7">
          {t.about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing({ t }: T) {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative z-10 pb-[18svh]">
      <div className="wrap">
        <div className="cols gap-y-10 rounded-2xl bg-panel p-6 md:p-12">
          <div className="col-span-4 md:col-span-7">
            <p className="label">{t.pricing.label}</p>
            <h2 id="pricing-title" className="mt-6">
              <span className="block text-xl font-semibold md:text-2xl">{t.pricing.from}</span>
              <span className="display mt-2 block text-[clamp(4.5rem,13vw,12rem)] text-paper">{t.pricing.price}</span>
            </h2>
            <p className="lead mt-8 max-w-[40ch] text-paper/80">{t.pricing.body}</p>
          </div>
          <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-4 md:col-start-9">
            <ul className="space-y-3">
              {t.pricing.included.map((item) => (
                <li key={item} className="flex gap-3 border-t border-line pt-3">
                  <span className="font-mono text-caution" aria-hidden>
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a href={contact.bookingUrl} target="_blank" rel="noopener" className="btn btn-primary self-start">
              {t.pricing.cta} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact({ t }: T) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-10 py-[14svh]">
      <div className="wrap cols gap-y-10">
        <div className="col-span-4 md:col-span-5">
          <p className="label">{t.contact.label}</p>
          <h2 id="contact-title" className="display mt-6 text-[clamp(2.4rem,5.4vw,5.5rem)]">
            {t.contact.title}
          </h2>
          <p className="lead mt-6 max-w-[36ch] text-paper/80">{t.contact.body}</p>
        </div>
        <div className="col-span-4 flex flex-col items-start gap-8 md:col-span-6 md:col-start-7 md:justify-end">
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener"
            data-magnetic
            className="btn btn-primary px-[1.4em] py-[1.1em] text-[clamp(1.25rem,2.4vw,2rem)]"
          >
            {t.contact.cta} <span aria-hidden>→</span>
          </a>
          <div className="flex flex-wrap items-center gap-3">
            <CopyEmail email={contact.email} copy={t.contact.copy} copied={t.contact.copied} />
            <a href={contact.bookingUrl} target="_blank" rel="noopener" className="btn btn-ghost">
              {t.contact.book} <span aria-hidden>↗</span>
            </a>
          </div>
          <div>
            <p className="label">{t.contact.elsewhere}</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {contact.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener me" className="link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ t }: T) {
  return (
    <footer className="relative z-10">
      <div data-finale className="with-3d h-[75svh]" aria-hidden />
      <div className="wrap label flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
        <span>© 2026 Peter Šagát · {t.footer.line}</span>
        <span className="inline-flex items-center gap-2 text-paper" data-stage="ready">
          <span className="dot" /> ready
        </span>
        <a href="#top" className="hover:text-paper">
          {t.footer.top} <span aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
}
