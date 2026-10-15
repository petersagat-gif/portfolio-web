# WebERV

The WebERV studio site: a dark, cinematic, scroll-driven site whose features are its own proof of work. A liquid-chrome WebGL hero, the WEB≡RV identity, live capability demos, editorial case studies, a seven-experiment Lab, a live performance diagnostic and a project-brief form.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, React Three Fiber, GSAP and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
|---|---|
| `content/site.ts` | **All copy and data**: hero, capabilities, projects, lab, technology, process, about, testimonial, contact options, footer links |
| `app/globals.css` | Design tokens (colours, type scale, easing, durations), components, and every CSS animation (scroll-driven ones included) |
| `components/home/` | Page sections. `sections.tsx` holds the server-rendered ones; interactive ones are separate client islands |
| `components/lab/` | The seven Lab experiments. Each loads only when its tab is opened |
| `components/three/` | WebGL: the shared canvas (`Scene.tsx`), the hero sculpture and the chrome shader |
| `app/[lang]/work/[slug]/` | Case study pages (generated from `work.projects`) |
| `app/api/contact/route.ts` | Receives project briefs and sends them by e-mail |
| `scripts/pages.mjs` | Generates the full-page previews in `public/work/pages/` (`npm run art`) |
| `docs/screenshots/` | Desktop (1440 px) and mobile (390 px) screenshots of every section |

## Change the text

Every visible string is in `content/site.ts`. Edit it and the page updates; no component changes needed. House style: no em-dashes, and one label per intent ("Start a project" is the only contact call to action).

## Add a project

1. Add an entry to `work.projects` in `content/site.ts` with a unique `slug`.
2. Put a tall full-page screenshot (1440 px wide, PNG/WebP/SVG) in `public/work/pages/` and point `page` at it. It scrolls inside the browser frame on hover and on the case study page.
3. Remove `sample: true` for real client work, and fill in `result` with real numbers only.

The home page shows four projects in a fixed editorial layout (`Work` in `components/home/sections.tsx`). For a fifth, add an `<article>` block there. Case study pages and the sitemap pick up new projects automatically.

## Contact form

Briefs are sent with [Resend](https://resend.com) when these environment variables are set:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO` | Inbox that receives briefs (defaults to `hello@weberv.com`) |
| `CONTACT_FROM` | Required. Sender on a domain verified in Resend, e.g. `WebERV <briefs@weberv.com>` |
| `NEXT_PUBLIC_SITE_URL` | The live domain, used for canonical URLs, sitemap and structured data |

Without `RESEND_API_KEY` and `CONTACT_FROM` the form still works: it offers to open the visitor's mail app with the brief filled in. The API validates every field, caps lengths and drops bot submissions with a honeypot, rejects cross-site posts and limits each IP to 5 briefs per 10 minutes.

## Performance notes

- Text and layout render as static HTML first. three.js, GSAP and Lenis load on the first interaction, or after 1.2 s of idle (WebGL) or on first scroll (scroll libraries).
- Machines without a real GPU (software WebGL) get the static hero.
- `prefers-reduced-motion` turns off smooth scrolling, the horizontal process scroll, scroll-linked effects, the cursor and all looping animation.
- The Performance section measures this page live in the visitor's browser (Web Vitals, transfer size, frame rate).

## Hidden details

- Type `weberv` anywhere on the page to toggle blueprint mode.
- The favicon is drawn live: its bars load in, and keep moving while the tab is in the background.
- The nav wordmark folds down to its three bars as you scroll; hover unfolds it.
- The 404 is a physics toy.

## Still to do (TODO)

Search the code for `TODO` to find each one.

- Real e-mail address (confirm `hello@weberv.com` exists)
- Social links: LinkedIn, Instagram, Behance, Dribbble, GitHub
- Stepra: URL, brand colour, confirmed challenge wording, stack, and results at launch
- Projects 02 to 04 are **sample projects** from the brief: replace them with real client work and real screenshots
- The testimonial is a **placeholder**: replace it with an approved client quote (name, role, company)
- Oliver's surname and role in the About section
- `NEXT_PUBLIC_SITE_URL` and the Resend variables in Vercel
- Slovak version: add `"sk"` to `locales` in `content/site.ts` with a translated copy
