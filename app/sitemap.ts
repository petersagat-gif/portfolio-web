import type { MetadataRoute } from "next";
import { localePath, locales, siteUrl } from "@/content/i18n";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...projects.map((p) => `/work/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: siteUrl + localePath(lang, path),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, siteUrl + localePath(l, path)])),
      },
    })),
  );
}
