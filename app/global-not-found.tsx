import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";
import { fontVars } from "./fonts";
import "./globals.css";

// Unmatched URLs skip the normal layout tree, so this file brings its own html, fonts and styles.
export const metadata: Metadata = { title: "404 | WebERV", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en" data-stage="wireframe" className={fontVars}>
      <body>
        <div className="guides" aria-hidden />
        <NotFoundView />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
