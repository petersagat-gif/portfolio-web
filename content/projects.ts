import type { Locale } from "./i18n";

// To add a project: copy an entry, give it a unique `slug` and put its cover in /public/work.
// `media.src` can be a 16:10 cover, a tall full-page screenshot (it scrolls inside the 3D screen)
// or a short muted .mp4. Order here = order on the site.

type CaseText = { line: string; problem: string; did: string; result: string };

export type Project = {
  slug: string;
  name: string;
  /** Live URL. Empty = no "visit" button (e.g. for this site itself). */
  url: string;
  year: string;
  role: string;
  stack: string;
  media: { type: "image" | "video"; src: string; poster?: string };
  /** Tint for the screen glow and the case-study accent. */
  accent: string;
  text: Record<Locale, CaseText>;
};

export const projects: Project[] = [
  {
    slug: "stepra",
    name: "Stepra",
    url: "", // TODO: Stepra URL
    year: "TODO",
    role: "Founder · front end · back end",
    stack: "TODO",
    media: { type: "image", src: "/work/stepra.svg" },
    accent: "#3DDC97", // TODO: Stepra brand colour
    text: {
      en: {
        line: "A job marketplace I founded and build end to end.",
        problem: "TODO: the hiring problem Stepra solves.",
        did: "I build all of it myself: the interface people use and the back end behind it. Stepra runs under my company, SK PROFESSIONAL s.r.o.",
        result: "TODO: where Stepra is today. Only real numbers.",
      },
      sk: {
        line: "Pracovný marketplace, ktorý som založil a staviam od A po Z.",
        problem: "TODO: aký problém pri hľadaní práce Stepra rieši.",
        did: "Všetko staviam sám: rozhranie, ktoré ľudia používajú, aj backend za ním. Stepra beží pod mojou firmou SK PROFESSIONAL s.r.o.",
        result: "TODO: kde je Stepra dnes. Len skutočné čísla.",
      },
    },
  },
  {
    slug: "weberv",
    name: "Weberv",
    url: "", // TODO: Weberv URL
    year: "TODO",
    role: "Co-founder · design · development",
    stack: "Next.js · Tailwind · Vercel",
    media: { type: "image", src: "/work/weberv.svg" },
    accent: "#3D5BFF",
    text: {
      en: {
        line: "The studio I run with Oliver: websites for businesses in Slovakia and across Europe.",
        problem: "Plenty of good businesses are let down by websites that are slow, dated or hard to find.",
        did: "We design, build and modernise business sites, from first wireframe to launch: hosting, SEO and booking flows included.",
        result: "TODO: client sites, added here as they launch.",
      },
      sk: {
        line: "Štúdio, ktoré vediem s Oliverom: weby pre firmy na Slovensku a v Európe.",
        problem: "Veľa dobrých firiem brzdí web, ktorý je pomalý, zastaraný alebo sa nedá nájsť.",
        did: "Navrhujeme, staviame a modernizujeme firemné weby od prvého wireframu po spustenie, vrátane hostingu, SEO a rezervácií.",
        result: "TODO: klientske weby, pribudnú sem po spustení.",
      },
    },
  },
  {
    slug: "this-site",
    name: "This site",
    url: "",
    year: "2026",
    role: "Design · 3D · development",
    stack: "Next.js 16 · React Three Fiber · GSAP",
    media: { type: "image", src: "/work/this-site.svg" },
    accent: "#FFC93C",
    text: {
      en: {
        line: "The site you’re on: a 3D, scroll-driven introduction, built from scratch.",
        problem: "A portfolio has a few seconds to prove the craft, not just describe it.",
        did: "A 3D browser drawn in code that assembles as you scroll, English and Slovak versions, structured data for search, and static pages so it still loads fast.",
        result: "TODO: Lighthouse scores, filled in after the performance pass.",
      },
      sk: {
        line: "Web, na ktorom práve ste: 3D predstavenie riadené skrolovaním, postavené od nuly.",
        problem: "Portfólio má pár sekúnd na to, aby remeslo dokázalo, nie ho len opísalo.",
        did: "3D prehliadač nakreslený v kóde, ktorý sa pri skrolovaní poskladá, anglická a slovenská verzia, štruktúrované dáta pre vyhľadávače a statické stránky, aby sa načítal rýchlo.",
        result: "TODO: skóre z Lighthouse, doplním po optimalizácii.",
      },
    },
  },
];

// Display name per language (only "This site" is translated).
export const projectName = (p: Project, lang: Locale) => (p.slug === "this-site" && lang === "sk" ? "Tento web" : p.name);

/** Before/after sliders. The current pair is an illustration, not a client. TODO: add real redesigns. */
export const comparisons = [
  { id: "illustration", before: "/compare/illustration-before.svg", after: "/compare/illustration-after.svg" },
];
