import { Anybody, Martian_Mono, Schibsted_Grotesk } from "next/font/google";

// Self-hosted at build time by next/font (no requests to Google at runtime).
const display = Anybody({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-anybody" });
const sans = Schibsted_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-schibsted" });
const mono = Martian_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-martian", preload: false });

/** Class names that expose the three font families as CSS variables. */
export const fontVars = `${display.variable} ${sans.variable} ${mono.variable}`;
