import type { MetadataRoute } from "next";
import { siteUrl, work } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...work.projects.map((p) => ({ url: `${siteUrl}/work/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
