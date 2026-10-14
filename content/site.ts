// All WebERV copy and data in one place. Anything marked TODO still needs a real value.
// House style: no em-dashes, no filler verbs, one label per intent ("Start a project" for contact).

export const locales = ["en"] as const; // add "sk" here (and a dictionary) to bring Slovak back
export type Locale = (typeof locales)[number];
export const hasLocale = (l: string): l is Locale => (locales as readonly string[]).includes(l);
export const localePath = (_lang: Locale, path = "/") => path;

/** Canonical origin for metadata, sitemap and structured data. TODO: set NEXT_PUBLIC_SITE_URL to the real domain. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const CTA = "Start a project";
export const EMAIL = "hello@weberv.com"; // TODO: confirm this mailbox exists

export const meta = {
  title: "WebERV | Digital experiences built to be remembered",
  description:
    "WebERV is a digital studio for premium websites, interactive 3D and WebGL experiences, motion design, UI/UX, custom web applications, AI integration and automation.",
  keywords: [
    "WebERV",
    "web development company",
    "creative web development",
    "interactive website development",
    "web design agency",
    "digital studio",
    "3D website development",
    "WebGL development",
    "AI website development",
    "UI UX studio",
    "motion web design",
    "custom web applications",
    "automation development",
  ],
};

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#capabilities" },
  { label: "Lab", href: "/#lab" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const hero = {
  headline: "Digital experiences built to be remembered.",
  sub: "Design, technology, motion and intelligent systems, combined into websites and products that look exceptional and perform better.",
  primary: "Explore our work",
};

export const statement = {
  lines: ["We don't just build websites.", "We build digital environments where design, technology and motion work together."],
  body: "WebERV works with ambitious companies, startups and organisations that want digital products that feel different, communicate clearly and perform reliably.",
};

export const capabilities = [
  { id: "design", name: "Web Design", body: "Premium visual design, responsive interfaces and conversion-focused experiences." },
  { id: "dev", name: "Web Development", body: "Modern, high-performance websites and applications built with current technologies." },
  { id: "ux", name: "UI / UX", body: "Interfaces designed around clarity, usability and strong visual hierarchy." },
  { id: "motion", name: "Motion Design", body: "Cinematic interaction, animation and storytelling built directly into digital products." },
  { id: "3d", name: "3D & Interactive", body: "WebGL, Three.js, interactive objects, spatial experiences and immersive interfaces." },
  { id: "ai", name: "AI Integration", body: "AI assistants, intelligent interfaces, content systems and AI-powered workflows." },
  { id: "auto", name: "Automation", body: "Business process automation, integrations and custom digital workflows." },
  { id: "brand", name: "Branding & Direction", body: "Digital-first identity systems, visual languages and brand experiences." },
] as const;
export type CapabilityId = (typeof capabilities)[number]["id"];

export type Project = {
  slug: string;
  name: string;
  industry: string;
  services: string[];
  challenge: string;
  solution: string;
  tech: string[];
  result: string;
  /** Tall page render shown inside the browser frame (scrolls on hover). */
  page: string;
  accent: string;
  /** Sample projects from the brief: shown with a "Sample project" label until real work replaces them. */
  sample?: boolean;
  url?: string;
};

export const work = {
  title: "Selected Work",
  subtitle: "Different problems. Different industries. One standard.",
  projects: [
    {
      slug: "stepra",
      name: "Stepra",
      industry: "International recruitment platform",
      services: ["Product strategy", "UX / UI", "Web development", "Platform architecture", "Automation"],
      challenge: "Hiring across borders is slow and fragmented. Candidates and companies need one place that does the matching and the paperwork.", // TODO: confirm wording with Stepra
      solution: "A recruitment platform designed and engineered end to end by WebERV: product, interface, back end and the automations behind it.",
      tech: ["Next.js", "TypeScript", "TODO: confirm stack"],
      result: "In active development. Results published at launch.", // TODO: real numbers only
      page: "/work/pages/stepra.svg",
      accent: "#3DDC97", // TODO: Stepra brand colour
      url: "", // TODO: Stepra URL
    },
    {
      slug: "residence",
      name: "Project 02",
      industry: "Luxury real estate digital experience",
      services: ["Creative direction", "3D", "WebGL", "Motion", "Development"],
      challenge: "Selling homes before they exist means making buyers feel a space they cannot visit yet.",
      solution: "An explorable 3D residence with daylight that follows the clock, floor-plan transitions and a booking flow for private viewings.",
      tech: ["Three.js", "React Three Fiber", "GSAP", "Next.js"],
      result: "Results shared on request.",
      page: "/work/pages/residence.svg",
      accent: "#C9B38A",
      sample: true,
    },
    {
      slug: "startup",
      name: "Project 03",
      industry: "Technology startup platform",
      services: ["Branding", "UX", "Frontend development", "AI integration"],
      challenge: "A technical product with a vague story: investors and first customers could not explain what it did.",
      solution: "A sharper brand, an interactive product walkthrough and an AI assistant that answers questions about the product in its own docs.",
      tech: ["Next.js", "TypeScript", "AI APIs", "Vercel"],
      result: "Results shared on request.",
      page: "/work/pages/startup.svg",
      accent: "#3D5BFF",
      sample: true,
    },
    {
      slug: "corporate",
      name: "Project 04",
      industry: "Corporate interactive experience",
      services: ["Strategy", "Design", "Motion", "Web development"],
      challenge: "An annual report nobody read: forty pages of PDF for a company with a genuinely good story.",
      solution: "A scroll-driven story with live data visualisation, chaptered navigation and a print-ready version generated from the same content.",
      tech: ["Next.js", "D3", "GSAP", "Headless CMS"],
      result: "Results shared on request.",
      page: "/work/pages/corporate.svg",
      accent: "#E4573D",
      sample: true,
    },
  ] satisfies Project[],
};

export const lab = {
  heading: "Don't take our word for it. Play with it.",
  experiments: [
    { id: "particles", name: "Particle field", hint: "Move through the wordmark. Press to scatter it." },
    { id: "object", name: "3D object", hint: "Drag to spin. Double-click to change shape." },
    { id: "physics", name: "Type physics", hint: "Grab a letter and throw it." },
    { id: "liquid", name: "Liquid shader", hint: "Stir the surface with your cursor." },
    { id: "scroll", name: "Scroll-driven", hint: "Scroll inside the panel. No JavaScript runs it." },
    { id: "ai", name: "AI interface", hint: "Describe a project. Concept with scripted answers." },
    { id: "generative", name: "Generative", hint: "Every press draws a new piece from a new seed." },
  ],
} as const;
export type ExperimentId = (typeof lab)["experiments"][number]["id"];

export const tech = {
  heading: "Technology is chosen around the problem, not around trends.",
  layers: [
    {
      name: "Experience",
      items: [
        ["React", "Component architecture for every interface we ship."],
        ["Next.js", "Our default framework: static where it can be, dynamic where it must be."],
        ["TypeScript", "Types across the stack, so changes stay safe."],
        ["Three.js", "Real-time 3D in the browser."],
        ["WebGL", "Custom shaders when a library would be the bottleneck."],
        ["GSAP", "Scroll choreography and timelines."],
        ["Framer Motion", "Interface motion that follows component state."],
      ],
    },
    {
      name: "Logic",
      items: [
        ["Node.js", "Server code, APIs and background jobs."],
        ["Python", "Data work, scripts and machine learning glue."],
        ["REST APIs", "Plain, predictable integrations."],
        ["GraphQL", "When a client needs exactly the data it asks for."],
        ["AI APIs", "Assistants, search and content systems on top of language models."],
      ],
    },
    {
      name: "Data & infrastructure",
      items: [
        ["Supabase", "Auth, storage and Postgres with row-level security."],
        ["PostgreSQL", "The database we trust with real data."],
        ["Cloud", "Deploys on Vercel and Railway, previews for every change."],
        ["Automation", "Workflows that connect forms, calendars, CRMs and email."],
      ],
    },
  ] as { name: string; items: [string, string][] }[],
};

export const steps = [
  { verb: "Discover", body: "We understand the business, users, market and objectives." },
  { verb: "Design", body: "We define the experience, visual system and interaction language." },
  { verb: "Build", body: "We develop the product with modern technologies and performance-focused architecture." },
  { verb: "Refine", body: "We test, optimise and polish every interaction." },
  { verb: "Launch", body: "The product goes live with analytics, monitoring and infrastructure ready." },
  { verb: "Evolve", body: "We keep improving the product based on real-world usage." },
];

export const why = {
  statements: ["Design without engineering is decoration.", "Engineering without design is forgettable.", "We combine both."],
  points: [
    "Custom-built experiences",
    "Strong visual identity",
    "Modern technical architecture",
    "Motion and interaction expertise",
    "Fast iteration",
    "AI-native workflows",
    "Performance optimisation",
    "Scalable systems",
    "International mindset",
  ],
};

export const performance = {
  heading: "Impressive can still be fast.",
  sub: "Everything below is measured live, in your browser, on this page.",
  built: [
    ["Responsive architecture", "One layout system from 320 px to 4K."],
    ["SEO-ready", "Metadata, structured data, sitemap and clean URLs."],
    ["Optimised assets", "Vector art, self-hosted fonts, nothing unused."],
    ["Lazy loading", "3D, animation libraries and lab experiments load when needed."],
    ["Efficient animation", "Transforms, opacity and CSS scroll timelines first."],
    ["Accessible interactions", "Keyboard, screen readers and reduced motion respected."],
  ],
};

export const about = {
  heading: "WebERV exists because most digital experiences look the same.",
  body: [
    "We combine engineering, visual design, motion and emerging technologies to build digital products with their own identity.",
    "We work across disciplines because modern digital products need more than one: design thinking, engineering, storytelling, interaction and technology working as one system.",
  ],
  team: [
    { name: "Peter Šagát", role: "Co-founder. Design and engineering." },
    { name: "Oliver", role: "Co-founder. TODO: role" }, // TODO: Oliver's surname and role
  ],
};

export const testimonials = [
  {
    quote: "WebERV didn't just redesign our website. They changed how our company presents itself digitally.",
    name: "TODO: client name",
    role: "TODO: role",
    company: "TODO: company",
    placeholder: true,
  },
];

export const contact = {
  heading: "Have something ambitious in mind?",
  sub: "Let's build it.",
  types: ["Website", "Web application", "E-commerce", "UI/UX", "Motion design", "3D / WebGL", "AI integration", "Automation", "Brand identity", "Other"],
  budgets: ["Under €5k", "€5k-15k", "€15k-40k", "€40k+", "Not sure yet"],
};

export const footer = {
  disciplines: ["Design", "Development", "Motion", "Technology"],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/TODO" },
    { label: "Instagram", href: "https://www.instagram.com/TODO" },
    { label: "Behance", href: "https://www.behance.net/TODO" },
    { label: "Dribbble", href: "https://dribbble.com/TODO" },
    { label: "GitHub", href: "https://github.com/TODO" },
  ],
  closing: "Built by WebERV. Obviously.",
};
