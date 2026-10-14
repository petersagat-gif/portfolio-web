import type { Metadata, Viewport } from "next";
import { dictionaries, hasLocale, locales, siteUrl } from "@/content/i18n";
import Nav from "@/components/Nav";
import Chrome from "@/components/Chrome";
import Cursor from "@/components/Cursor";
import { fontVars } from "../fonts";
import "../globals.css";

// Decide 3D vs. static before first paint so fallbacks never shift the layout. Kept free on purpose:
// no WebGL context here. The real GPU check runs later, off the critical path (see Stage3D).
const detect3d = `if(window.WebGLRenderingContext&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('has-3d')`;

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
  // An unknown first segment (e.g. /some-typo) still gets the site chrome in English; the page
  // below then calls notFound(), so the designed 404 renders instead of a bare default page.
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "en";
  const t = dictionaries[lang];

  return (
    <html
      lang={lang}
      data-stage="wireframe"
      className={fontVars}
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
