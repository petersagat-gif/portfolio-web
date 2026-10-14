import type { Metadata, Viewport } from "next";
import { Anybody, Martian_Mono, Schibsted_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { dictionaries, hasLocale, locales, siteUrl } from "@/content/i18n";
import Nav from "@/components/Nav";
import Chrome from "@/components/Chrome";
import Cursor from "@/components/Cursor";
import "../globals.css";

// Self-hosted at build time by next/font (no requests to Google at runtime).
const display = Anybody({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-anybody",
});
const sans = Schibsted_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-schibsted" });
const mono = Martian_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-martian", preload: false });

// Decide 3D vs. static before first paint so fallbacks never cause layout shift.
const detect3d = `try{var c=document.createElement('canvas'),g=c.getContext('webgl2')||c.getContext('webgl');if(g&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('has-3d')}var x=g&&g.getExtension('WEBGL_lose_context');x&&x.loseContext()}catch(e){}`;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = dictionaries[lang].meta;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.title, template: "%s — Peter Šagát" },
    description: t.description,
    openGraph: {
      type: "website",
      siteName: "Peter Šagát",
      locale: lang === "sk" ? "sk_SK" : "en_GB",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Peter Šagát" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#0b0d12", colorScheme: "dark" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = dictionaries[lang];

  return (
    <html
      lang={lang}
      data-stage="wireframe"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: detect3d }} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded bg-paper px-4 py-2 text-ink">
          {t.nav.skip}
        </a>
        <div className="guides" aria-hidden />
        <Nav lang={lang} t={t.nav} />
        {children}
        <Chrome />
        <Cursor open={t.nav.cursorOpen} drag={t.nav.cursorDrag} />
      </body>
    </html>
  );
}
