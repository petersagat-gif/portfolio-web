import type { Locale } from "./i18n";

// To add a project: copy one entry, give it a unique `slug`, drop a full-page screenshot
// (or a muted .mp4) into /public/work and point `media` at it. Order here = order on the site.

type CaseText = { line: string; problem: string; did: string; result: string };

export type Project = {
  slug: string;
  name: string;
  url: string;
  year: string;
  role: string;
  stack: string;
  /** Tall full-page screenshot (scrolls inside the 3D screen) or a short muted video. */
  media: { type: "image" | "video"; src: string; poster?: string };
  /** Screen tint used for hover glow and the case-study accent. */
  accent: string;
  text: Record<Locale, CaseText>;
  todo?: boolean;
};

const todoText = (n: string): Record<Locale, CaseText> => ({
  en: {
    line: `TODO: one line about ${n}`,
    problem: "TODO: what wasn’t working for the client.",
    did: "TODO: what you designed and built.",
    result: "TODO: the outcome. Only real numbers, or leave this out.",
  },
  sk: {
    line: `TODO: jedna veta o projekte ${n}`,
    problem: "TODO: čo klientovi nefungovalo.",
    did: "TODO: čo ste navrhli a postavili.",
    result: "TODO: výsledok. Len skutočné čísla, alebo túto časť vynechajte.",
  },
});

export const projects: Project[] = [
  {
    slug: "stepra",
    name: "Stepra",
    url: "https://example.com/TODO-stepra",
    year: "TODO",
    role: "Founder, front end & back end",
    stack: "TODO",
    media: { type: "image", src: "/work/stepra.svg" },
    accent: "#3DDC97", // TODO: Stepra brand colour
    text: {
      en: {
        line: "A job marketplace I founded and build end to end.",
        problem: "TODO: the hiring problem Stepra solves.",
        did: "TODO: what you built (front end, back end, data).",
        result: "TODO: current status. Only real numbers.",
      },
      sk: {
        line: "Pracovný marketplace, ktorý som založil a staviam od A po Z.",
        problem: "TODO: aký problém pri hľadaní práce Stepra rieši.",
        did: "TODO: čo ste postavili (frontend, backend, dáta).",
        result: "TODO: aktuálny stav. Len skutočné čísla.",
      },
    },
    todo: true,
  },
  ...(["client-1", "client-2", "client-3"] as const).map((slug, i) => ({
    slug,
    name: `Client site 0${i + 1}`, // TODO: real client name
    url: "https://example.com/TODO",
    year: "TODO",
    role: "Design & development",
    stack: "TODO",
    media: { type: "image" as const, src: `/work/${slug}.svg` },
    accent: ["#C8553D", "#2E6BE6", "#D9A441"][i],
    text: todoText(`Client site 0${i + 1}`),
    todo: true,
  })),
];

/** Before/after pairs for the comparison sliders. TODO: replace with real client redesigns. */
export const comparisons = [
  {
    name: "TODO: client name",
    before: "/compare/todo-before.svg",
    after: "/compare/todo-after.svg",
    todo: true,
  },
];
