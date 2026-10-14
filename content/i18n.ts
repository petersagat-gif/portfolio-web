// All site copy lives here. `sk` is typed against `en`, so a missing translation is a type error.
// Anything marked TODO is a placeholder Peter still needs to confirm or supply.

export const locales = ["en", "sk"] as const;
export type Locale = (typeof locales)[number];
export const hasLocale = (l: string): l is Locale => (locales as readonly string[]).includes(l);

/** EN lives at the root ("/"), SK under "/sk". */
export const localePath = (lang: Locale, path = "/") =>
  lang === "en" ? path : `/sk${path === "/" ? "" : path}`;

const en = {
  meta: {
    title: "Peter Šagát — websites for businesses, from sketch to launch",
    description:
      "I design and build fast, distinctive websites for businesses in Slovakia and across Europe, from first wireframe to live site. Websites from €350.",
  },
  nav: {
    skip: "Skip to content",
    cta: "Let’s talk",
    soundOn: "Sound on",
    soundOff: "Sound off",
    switchTo: "Slovenčina",
    switchShort: "SK",
    home: "Peter Šagát, home",
  },
  hero: {
    role: "Web designer & developer — Slovakia",
    first: "Peter",
    last: "Šagát",
    pitch: "Websites for businesses, from first sketch to launch. Scroll and watch one get built.",
    available: "Taking on new projects", // TODO: confirm availability wording/month
    scroll: "Scroll",
    loading: "Building",
  },
  process: {
    label: "How a website gets built",
    stages: [
      {
        name: "Wireframe",
        body: "Structure first. Where the content goes, what people click, what they read first — before a single colour.",
      },
      {
        name: "Design",
        body: "Then type, colour and rhythm. A visual identity built for your business, not pulled from a template.",
      },
      {
        name: "Live",
        body: "Then it ships: fast, responsive, easy to find on Google. Like the site you’re scrolling right now.",
      },
    ],
  },
  work: {
    title: "Things I’ve built",
    intro: "A startup, a studio and the site you’re on. Client work joins this list as it launches.",
    open: "Open case study",
    visit: "Visit live site",
    problem: "The problem",
    did: "What I did",
    result: "Result",
    year: "Year",
    role: "Role",
    stack: "Stack",
    next: "Next project",
    back: "All work",
  },
  compare: {
    title: "Before / After",
    intro: "What modernising a business site looks like. Drag the handle to compare.",
    caption: "Illustration: a typical early-2000s site and the same business, redesigned.",
    before: "Before",
    after: "After",
    handle: "Comparison position",
  },
  toolkit: {
    title: "Toolkit",
    intro: "Drag to spin it. Hover or tap a skill to see how I use it.",
    skills: [
      ["Next.js", "My default for business sites: fast pages, good SEO, easy to grow."],
      ["React", "Interfaces built from small, reusable pieces."],
      ["TypeScript", "Catches mistakes before your visitors do."],
      ["Tailwind CSS", "Consistent spacing and colour on every page."],
      ["Three.js / R3F", "3D scenes, like the one on this page."],
      ["GSAP", "Scroll animation that guides attention instead of stealing it."],
      ["UI/UX design", "Layouts planned around what your customers need to find."],
      ["Supabase & Postgres", "Databases, logins and file storage when a site needs a back end."],
      ["Vercel & Railway", "Deploys in minutes, with a preview of every change."],
      ["Resend", "Transactional e-mail that actually reaches the inbox."],
      ["Forms → Calendar", "Booking flows: a Google Form entry becomes a calendar event."],
      ["SEO", "Metadata, structured data and speed, so people can find you."],
      ["Modernisation", "Rebuilding outdated sites without losing what already works."],
    ] as [string, string][],
  },
  stepra: {
    label: "My startup",
    body: "A job marketplace I’m building from the ground up — front end, back end, all of it. It runs under my company, SK PROFESSIONAL s.r.o.",
    roles: "Founder · Front end · Back end",
    cta: "Visit Stepra",
  },
  about: {
    label: "About",
    title: "Student. Founder. Builder.",
    body: [
      "I’m Peter, a student based in Slovakia. Together with Oliver I run Weberv, where we build and modernise websites for businesses in Slovakia and across Europe.",
      "When I’m not on client work, I’m building Stepra. I like websites that load fast, read clearly and make people want to get in touch.",
    ],
  },
  pricing: {
    label: "Pricing",
    from: "Websites from",
    price: "€350",
    body: "A clear starting price for a small business website. Need more? Tell me what you have in mind and I’ll send a quote.",
    // TODO: confirm what the €350 package includes
    included: [
      "Custom design — no templates",
      "Works on every screen size",
      "Fast loading and basic SEO",
      "Contact or booking form",
      "Launch on your domain",
    ],
    cta: "Start your website",
  },
  contact: {
    label: "Contact",
    title: "Ready when you are.",
    body: "Tell me about your business and what you need. Book a short call, or just write.",
    cta: "Let’s build your website",
    book: "Book a call",
    copy: "Copy e-mail",
    copied: "E-mail copied",
    elsewhere: "Elsewhere",
  },
  footer: {
    line: "Building websites as Weberv",
    top: "Back to top",
  },
};

export type Dict = typeof en;

const sk: Dict = {
  meta: {
    title: "Peter Šagát — weby pre firmy, od náčrtu po spustenie",
    description:
      "Navrhujem a staviam rýchle, výrazné weby pre firmy na Slovensku a v Európe, od prvého wireframu po živú stránku. Weby od 350 €.",
  },
  nav: {
    skip: "Preskočiť na obsah",
    cta: "Napíšte mi",
    soundOn: "Zvuk zapnutý",
    soundOff: "Zvuk vypnutý",
    switchTo: "English",
    switchShort: "EN",
    home: "Peter Šagát, domov",
  },
  hero: {
    role: "Webdizajnér a vývojár — Slovensko",
    first: "Peter",
    last: "Šagát",
    pitch: "Weby pre firmy, od prvého náčrtu po spustenie. Skrolujte a pozrite sa, ako jeden vzniká.",
    available: "Prijímam nové projekty", // TODO: potvrdiť dostupnosť
    scroll: "Skrolujte",
    loading: "Staviam",
  },
  process: {
    label: "Ako vzniká web",
    stages: [
      {
        name: "Wireframe",
        body: "Najprv štruktúra. Kde bude obsah, na čo ľudia kliknú, čo si prečítajú ako prvé — skôr než padne prvá farba.",
      },
      {
        name: "Dizajn",
        body: "Potom písmo, farby a rytmus. Vizuálna identita pre vašu firmu, nie stiahnutá zo šablóny.",
      },
      {
        name: "Live",
        body: "A potom ide von: rýchly, responzívny, ľahko dohľadateľný na Googli. Ako web, ktorý práve skrolujete.",
      },
    ],
  },
  work: {
    title: "Čo staviam",
    intro: "Startup, štúdio a web, na ktorom práve ste. Klientske projekty pribudnú, keď sa spustia.",
    open: "Otvoriť prípadovú štúdiu",
    visit: "Navštíviť web",
    problem: "Problém",
    did: "Čo som urobil",
    result: "Výsledok",
    year: "Rok",
    role: "Rola",
    stack: "Technológie",
    next: "Ďalší projekt",
    back: "Všetky projekty",
  },
  compare: {
    title: "Pred / Po",
    intro: "Takto vyzerá modernizácia firemného webu. Potiahnite posúvač a porovnajte.",
    caption: "Ilustrácia: typický web zo začiatku 2000-tych rokov a tá istá firma po redizajne.",
    before: "Pred",
    after: "Po",
    handle: "Pozícia porovnania",
  },
  toolkit: {
    title: "Nástroje",
    intro: "Potiahnutím ich roztočíte. Prejdite myšou alebo ťuknite na nástroj a uvidíte, na čo ho používam.",
    skills: [
      ["Next.js", "Môj základ pre firemné weby: rýchle stránky, dobré SEO, ľahko sa rozširujú."],
      ["React", "Rozhrania poskladané z malých, znovupoužiteľných častí."],
      ["TypeScript", "Odhalí chyby skôr, než ich nájdu vaši návštevníci."],
      ["Tailwind CSS", "Jednotné rozostupy a farby na každej stránke."],
      ["Three.js / R3F", "3D scény, ako je tá na tejto stránke."],
      ["GSAP", "Animácie pri skrolovaní, ktoré vedú pozornosť, nie ju kradnú."],
      ["UI/UX dizajn", "Rozloženie navrhnuté podľa toho, čo potrebujú nájsť vaši zákazníci."],
      ["Supabase & Postgres", "Databázy, prihlasovanie a úložisko, keď web potrebuje backend."],
      ["Vercel & Railway", "Nasadenie za pár minút a náhľad každej zmeny."],
      ["Resend", "Transakčné e-maily, ktoré naozaj dorazia do schránky."],
      ["Formuláre → Kalendár", "Rezervácie: z vyplneného Google Formulára je udalosť v kalendári."],
      ["SEO", "Metadáta, štruktúrované dáta a rýchlosť, aby vás ľudia našli."],
      ["Modernizácia", "Prerábam zastarané weby bez toho, aby sa stratilo, čo už funguje."],
    ],
  },
  stepra: {
    label: "Môj startup",
    body: "Pracovný marketplace, ktorý staviam od základov — frontend, backend, všetko. Beží pod mojou firmou SK PROFESSIONAL s.r.o.",
    roles: "Zakladateľ · Frontend · Backend",
    cta: "Navštíviť Stepru",
  },
  about: {
    label: "O mne",
    title: "Študent. Zakladateľ. Staviteľ.",
    body: [
      "Som Peter, študent zo Slovenska. S Oliverom vedieme Weberv — staviame a modernizujeme weby pre firmy na Slovensku a v Európe.",
      "Keď nerobím pre klientov, staviam Stepru. Mám rád weby, ktoré sa rýchlo načítajú, dobre sa čítajú a ľudí presvedčia, aby sa ozvali.",
    ],
  },
  pricing: {
    label: "Cena",
    from: "Weby od",
    price: "350 €",
    body: "Jasná štartovacia cena za menší firemný web. Potrebujete viac? Napíšte, čo máte v pláne, a pošlem cenovú ponuku.",
    // TODO: potvrdiť, čo balík za 350 € obsahuje
    included: [
      "Dizajn na mieru — žiadne šablóny",
      "Funguje na každej veľkosti obrazovky",
      "Rýchle načítanie a základné SEO",
      "Kontaktný alebo rezervačný formulár",
      "Spustenie na vašej doméne",
    ],
    cta: "Začnime váš web",
  },
  contact: {
    label: "Kontakt",
    title: "Môžeme začať.",
    body: "Napíšte mi o svojej firme a o tom, čo potrebujete. Rezervujte si krátky hovor alebo mi jednoducho napíšte.",
    cta: "Postavme váš web",
    book: "Rezervovať hovor",
    copy: "Kopírovať e-mail",
    copied: "E-mail skopírovaný",
    elsewhere: "Inde",
  },
  footer: {
    line: "Weby staviam pod značkou Weberv",
    top: "Späť hore",
  },
};

export const dictionaries: Record<Locale, Dict> = { en, sk };

/** Contact details and links. TODO: replace every placeholder below. */
export const contact = {
  email: "hello@example.com", // TODO: real e-mail
  bookingUrl: "https://forms.gle/TODO", // TODO: Google Form that feeds Google Calendar
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/TODO" },
    { label: "GitHub", href: "https://github.com/TODO" },
    { label: "Instagram", href: "https://www.instagram.com/TODO" },
  ],
  stepraUrl: "https://example.com/TODO-stepra", // TODO: Stepra URL
};

/** Canonical origin for metadata, sitemap and hreflang. TODO: set NEXT_PUBLIC_SITE_URL once the domain is known. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
