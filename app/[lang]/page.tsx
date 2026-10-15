import GL from "@/components/GL";
import Reveal from "@/components/Reveal";
import Capabilities from "@/components/home/Capabilities";
import Technology from "@/components/home/Technology";
import {
  About,
  Footer,
  Hero,
  Performance,
  Process,
  StartProject,
  Statement,
  Testimonial,
  Why,
  Work,
} from "@/components/home/sections";
import Lab from "@/components/lab/Lab";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { about, capabilities, footer, hasLocale, meta, siteUrl } from "@/content/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home({ params }: PageProps<"/[lang]">) {
  // Unknown first segments (e.g. /some-typo) land here via the [lang] route: show the 404.
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Organization + services + website, for search engines and AI answer engines.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#weberv`,
        name: "WebERV",
        url: siteUrl,
        description: meta.description,
        slogan: "Digital experiences built to be remembered.",
        logo: `${siteUrl}/icon.svg`,
        image: `${siteUrl}/og.png`,
        areaServed: "Worldwide",
        knowsAbout: meta.keywords.filter((k) => k !== "WebERV"),
        founder: about.team.filter((m) => !m.role.includes("TODO")).map((m) => ({ "@type": "Person", name: m.name })),
        sameAs: footer.socials.map((s) => s.href).filter((h) => !h.includes("TODO")),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: capabilities.map((c) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: c.name, description: c.body },
          })),
        },
      },
      { "@type": "WebSite", "@id": `${siteUrl}/#site`, url: siteUrl, name: "WebERV", publisher: { "@id": `${siteUrl}/#weberv` } },
    ],
  };

  return (
    <>
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Hero />
        <Statement />
        <Capabilities />
        <Work />
        <Lab />
        <Technology />
        <Process />
        <Why />
        <Performance />
        <About />
        <Testimonial />
        <StartProject />
        <Reveal />
      </main>
      <Footer />
      <GL />
    </>
  );
}
