import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { allContentPages } from "@/content/pages";
import { siteConfig } from "@/content/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/comparativas`, changeFrequency: "monthly", priority: 0.72 },
    { url: `${base}/checklists`, changeFrequency: "monthly", priority: 0.6 },
    ...allContentPages.map((page) => ({
      url: `${base}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: page.slug === "descargar" ? 0.9 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      ...(post.updatedAt || post.publishedAt ? { lastModified: new Date((post.updatedAt ?? post.publishedAt)!) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
