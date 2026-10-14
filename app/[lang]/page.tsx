import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { contact, dictionaries, hasLocale, localePath, siteUrl } from "@/content/i18n";
import { projects } from "@/content/projects";
import Stage3D from "@/components/Stage3D";
import { Marquee } from "@/components/Art";
import { About, Compare, Contact, Footer, Hero, Pricing, Process, Stepra, Toolkit, Work } from "@/components/sections";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      canonical: lang === "sk" ? "/sk" : "/",
      languages: { en: "/", sk: "/sk", "x-default": "/" },
    },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = dictionaries[lang];

  // Person + Organization structured data. TODO: add sameAs links and the real domain.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Peter Šagát",
        url: siteUrl,
        jobTitle: lang === "sk" ? "Webdizajnér a vývojár" : "Web designer & developer",
        address: { "@type": "PostalAddress", addressCountry: "SK" },
        worksFor: { "@id": `${siteUrl}/#weberv` },
        knowsAbout: t.toolkit.skills.map(([name]) => name),
        sameAs: contact.links.map((l) => l.href).filter((h) => !h.includes("TODO")),
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#weberv`,
        name: "Weberv",
        url: siteUrl,
        founder: { "@id": `${siteUrl}/#person` },
        areaServed: ["SK", "EU"],
      },
      {
        "@type": "Organization",
        name: "Stepra",
        founder: { "@id": `${siteUrl}/#person` },
        parentOrganization: { "@type": "Organization", name: "SK PROFESSIONAL s.r.o." },
      },
    ],
  };

  return (
    <>
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {/* Hero → process → work share one sticky 3D stage. */}
        <div className="relative">
          <div data-world className="pointer-events-none sticky top-0 -mb-[100svh] h-svh" aria-hidden />
          <Hero t={t} />
          <Process t={t} />
          <Work lang={lang} t={t} />
        </div>
        <Marquee variant="ticker" items={t.marquee.services} />
        <Compare t={t} />
        <Toolkit t={t} />
        <Stepra t={t} />
        <About t={t} />
        <Pricing t={t} />
        <Marquee variant="band" items={[t.contact.cta, t.contact.cta, t.contact.cta]} />
        <Contact t={t} />
        <Reveal />
      </main>
      <Stage3D
        screens={projects.map((p) => ({
          href: localePath(lang, `/work/${p.slug}`),
          src: p.media.src,
          video: p.media.type === "video",
          accent: p.accent,
        }))}
        copy={{
          first: t.hero.first,
          last: t.hero.last,
          pitch: t.hero.pitch,
          role: t.hero.role,
          cta: t.contact.cta,
          nav: t.nav.cta,
        }}
      />
      <Footer t={t} />
    </>
  );
}
