import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { allContentPages } from "@/content/pages";
import { siteConfig } from "@/content/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    ...allContentPages.map((page) => ({
      url: `${base}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page.slug === "descargar" ? 0.9 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}