import type { MetadataRoute } from "next";
import { allContentPages } from "@/content/pages";
import { siteConfig } from "@/content/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...allContentPages.map((page) => ({
      url: `${base}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page.slug === "descargar" ? 0.9 : 0.7,
    })),
  ];
}
