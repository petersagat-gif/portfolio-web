// Home page sections that need no client JavaScript. Interactive pieces are separate client islands.
import Link from "next/link";
import { ViewTransition } from "react";
import { Mark } from "@/components/Nav";
import { CTA, EMAIL, about, contact, footer, hero, nav, performance, statement, steps, testimonials, why, work, type Project } from "@/content/site";
import ContactForm from "./ContactForm";
import Diagnostics from "./Diagnostics";
import HeroMark from "./HeroMark";
import WorkCounter from "./WorkCounter";

const pad = (n: number) => String(n).padStart(2, "0");

export function Hero() {
  return (
    <section id="top" className="relative z-10 flex min-h-[100dvh] flex-col overflow-hidden">
      <div data-hero-gl className="gl-slot pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="hero-glow pointer-events-none absolute inset-0 -z-20" aria-hidden />
      <div className="wrap flex flex-1 flex-col pb-[3vh] pt-28 md:pt-32">
        <div className="max-w-[54rem]">
          <span className="mask">
            <h1 className="h1 intro-2">{hero.headline}</h1>
          </span>
          <p className="lead muted intro-2 mt-6 max-w-[34ch]">{hero.sub}</p>
          <div className="intro-5 mt-9 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-primary">
              {hero.primary} <span className="arrow">→</span>
            </a>
            <a href="#contact" className="btn btn-ghost">
              {CTA}
            </a>
          </div>
        </div>
        <div className="mt-auto pt-12">
          <HeroMark />
        </div>
      </div>
    </section>
  );
}

export function Statement() {
  // Every word gets its position (0..1) so the scroll timeline can light them up in order.
  const words = statement.lines.flatMap((line, li) => line.split(" ").map((w) => ({ w, li })));
  return (
    <section className="section" aria-label="About WebERV in one sentence">
      <div className="wrap">
        <p className="kinetic h3 max-w-[22ch] !font-[720] md:text-[clamp(2.4rem,4.6vw,4.9rem)]">
          {words.map(({ w, li }, i) => (
            <span key={i}>
              <span className={`w ${li === 0 ? "font-[820]" : ""}`} style={{ "--p": i / (words.length - 1) } as React.CSSProperties}>
                {w}
              </span>{" "}
              {li === 0 && words[i + 1]?.li === 1 ? <br /> : null}
            </span>
          ))}
        </p>
        <p className="lead muted mt-14 max-w-[42ch] md:ml-[42%]">{statement.body}</p>
      </div>
    </section>
  );
}

function Preview({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <Link href={`/work/${p.slug}`} data-cursor="view" className={`parallax group block ${className}`} aria-label={`${p.name} case study`}>
      <ViewTransition name={`shot-${p.slug}`} share="morph" default="none">
        <div className="browser reveal-clip relative aspect-[16/10]">
          <div className="flex h-7 items-center gap-1.5 border-b border-line px-3" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rounded-full bg-paper/20" />
            ))}
            <span className="meta ml-3 truncate">{p.name.toLowerCase().replace(/\s/g, "")}.com</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 top-7 overflow-hidden">
            <img src={p.page} alt="" loading="lazy" className="browser-page w-full" style={{ "--to": "-72%" } as React.CSSProperties} />
          </div>
          <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100" style={{ background: p.accent }} />
        </div>
      </ViewTransition>
    </Link>
  );
}

function Facts({ p }: { p: Project }) {
  const rows: [string, React.ReactNode][] = [
    ["Challenge", p.challenge],
    ["Solution", p.solution],
    ["Services", p.services.join(", ")],
    ["Technology", p.tech.join(", ")],
    ["Result", p.result],
  ];
  return (
    <dl className="grid gap-6 sm:grid-cols-2">
      {rows.map(([k, v], i) => (
        <div key={k} className={i < 2 ? "sm:col-span-2" : ""}>
          <dt className="meta">{k}</dt>
          <dd className={`mt-1.5 ${i < 2 ? "text-[1.05em]" : "muted text-[0.95em]"}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Work() {
  const [a, b, c, d] = work.projects;
  const title = (p: Project, i: number) => (
    <div>
      <p className="meta">
        {pad(i + 1)} / {pad(work.projects.length)}
        {p.sample ? <span className="ml-3 text-accent-soft">Sample project</span> : null}
      </p>
      <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
        <h3 className="h2 mt-3">{p.name}</h3>
      </ViewTransition>
      <p className="lead muted mt-3">{p.industry}</p>
    </div>
  );
  const more = (p: Project) => (
    <Link href={`/work/${p.slug}`} className="u-link mt-8 inline-flex items-center gap-2">
      Case study <span className="arrow">→</span>
    </Link>
  );
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <WorkCounter total={work.projects.length} />
      <div className="wrap">
        <h2 id="work-title" className="h2">
          {work.title}
        </h2>
        <p className="lead muted mt-5 max-w-[30ch]">{work.subtitle}</p>

        {/* 01: full-width preview, facts underneath in columns */}
        <article data-project={0} className="mt-[14vh]">
          <Preview p={a} />
          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
            {title(a, 0)}
            <div>
              <Facts p={a} />
              {more(a)}
            </div>
          </div>
        </article>

        {/* 02 and 03: offset pair */}
        <div className="mt-[18vh] grid gap-[14vh] md:grid-cols-2 md:gap-x-[6vw] md:gap-y-0">
          <article data-project={1}>
            <Preview p={b} />
            <div className="mt-8">{title(b, 1)}</div>
            <div className="mt-8">
              <Facts p={b} />
              {more(b)}
            </div>
          </article>
          <article data-project={2} className="md:mt-[30vh]">
            <Preview p={c} />
            <div className="mt-8">{title(c, 2)}</div>
            <div className="mt-8">
              <Facts p={c} />
              {more(c)}
            </div>
          </article>
        </div>

        {/* 04: text first, wide preview to the right */}
        <article data-project={3} className="mt-[18vh] grid items-end gap-10 md:grid-cols-[1fr_1.7fr]">
          <div className="md:order-none order-2">
            {title(d, 3)}
            <div className="mt-8">
              <Facts p={d} />
              {more(d)}
            </div>
          </div>
          <Preview p={d} />
        </article>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="process relative z-10" aria-labelledby="process-title">
      <div className="process-sticky flex flex-col justify-center">
        <div className="wrap">
          <h2 id="process-title" className="h2">
            How we work
          </h2>
          <div className="mt-6 h-px w-full bg-line" aria-hidden>
            <div className="process-fill h-px bg-accent" />
          </div>
        </div>
        <ol className="process-track mt-12 md:mt-16">
          {steps.map((s, i) => (
            <li key={s.verb} className="process-step w-screen px-[var(--gutter)] md:w-[56vw]">
              <p className="meta text-accent-soft">{pad(i + 1)}</p>
              <h3 className="mark mt-4 text-[clamp(3.2rem,9vw,8.5rem)]">{s.verb}</h3>
              <p className="lead muted mt-6 max-w-[30ch]">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Why() {
  return (
    <section className="light section relative z-10" aria-labelledby="why-title">
      <div className="wrap">
        <h2 id="why-title" className="sr-only">
          Why WebERV
        </h2>
        <div className="space-y-2">
          {why.statements.map((s, i) => (
            <p key={s} className={`h2 max-w-[18ch] ${i === 2 ? "text-accent" : ""}`}>
              {s}
            </p>
          ))}
        </div>
      </div>
      <div className="marquee mt-[12vh] border-y border-line py-8">
        <ul className="marquee-track h3">
          {[...why.points, ...why.points].map((p, i) => (
            <li key={i} aria-hidden={i >= why.points.length || undefined} className="flex items-center">
              <span className={i % 2 ? "outline" : ""}>{p}</span>
              <span className="mx-[0.6em] inline-block size-[0.28em] bg-accent" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <h2 id="about-title" className="h2 h2-long md:col-span-10">
          {about.heading}
        </h2>
        <div className="lead muted space-y-5 md:col-span-6 md:col-start-6">
          {about.body.map((b) => (
            <p key={b}>{b}</p>
          ))}
        </div>
        <ul className="grid gap-4 self-end md:col-span-4 md:col-start-1 md:row-start-2">
          {about.team.map((m) => (
            <li key={m.name}>
              <p className="font-semibold">{m.name}</p>
              <p className="meta mt-0.5">{m.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Testimonial() {
  const t = testimonials[0];
  return (
    <section className="section" aria-label="Client experience">
      <figure className="wrap">
        <blockquote className="h3 max-w-[24ch] !font-[620] md:text-[clamp(2.2rem,4.4vw,4.6rem)]">
          <span className="text-accent">“</span>
          {t.quote}
          <span className="text-accent">”</span>
        </blockquote>
        <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-4">
          <span className="font-semibold">{t.name}</span>
          <span className="meta">
            {t.role}, {t.company}
          </span>
          {t.placeholder ? <span className="meta text-accent-soft">Placeholder quote until a client approves one</span> : null}
        </figcaption>
      </figure>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <Mark className="footer-mark" />
          <p className="meta mt-6">{footer.disciplines.join(" / ")}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="u-link">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <ul className="space-y-2">
            {footer.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener me" className="u-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${EMAIL}`} className="u-link mt-6 inline-block text-accent-soft">
            {EMAIL}
          </a>
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
        <p className="meta">© 2026 WebERV</p>
        <p className="meta">{footer.closing}</p>
      </div>
    </footer>
  );
}

export function Performance() {
  return (
    <section id="performance" className="section" aria-labelledby="perf-title">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 id="perf-title" className="h2 max-w-[11ch]">
            {performance.heading}
          </h2>
          <p className="lead muted mt-6 max-w-[30ch]">{performance.sub}</p>
          <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {performance.built.map(([k, d]) => (
              <li key={k}>
                <p className="font-semibold">{k}</p>
                <p className="meta mt-1">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <Diagnostics />
      </div>
    </section>
  );
}

export function StartProject() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="h2 max-w-[16ch]">
          {contact.heading}
        </h2>
        <p className="mark mt-4 text-[clamp(2.6rem,8.4vw,9rem)] text-accent">{contact.sub}</p>
        <div className="mt-[10vh] grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="lead muted max-w-[26ch]">
            <p>Tell us what you are building. We read every brief ourselves.</p>
            <a href={`mailto:${EMAIL}`} className="u-link mt-6 inline-block text-paper">
              {EMAIL}
            </a>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
