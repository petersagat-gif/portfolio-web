import type { Metadata, Viewport } from "next";
import Chrome from "@/components/Chrome";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import { locales, meta, siteUrl } from "@/content/site";
import { fontVars } from "../fonts";
import "../globals.css";

// Decide WebGL vs. static before first paint so fallbacks never shift the layout. Free on purpose:
// no WebGL context is created here; the real GPU check runs later, off the critical path.
const detect = `if(window.WebGLRenderingContext&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('has-3d')`;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: meta.title, template: "%s | WebERV" },
  description: meta.description,
  keywords: meta.keywords,
  applicationName: "WebERV",
  openGraph: {
    type: "website",
    siteName: "WebERV",
    locale: "en_GB",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "WebERV" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0b0b0c", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: detect }} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-paper px-4 py-2 text-ink">
          Skip to content
        </a>
        <Nav />
        {children}
        <Chrome />
        <Cursor />
      </body>
    </html>
  );
}
