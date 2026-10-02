import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { allContentPages } from "@/content/pages";
import { siteConfig } from "@/content/site-config";
import { practicalGuides } from "@/content/practical-guides";
import { portalTopics, portalContent } from "@/content/portal";
import { topicDirectory } from "@/content/topic-directory";
import { catalogPageHref, paginatedCatalogs } from '@/content/catalogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/mapa-web`, changeFrequency: 'weekly', priority: 0.8 },
    ...paginatedCatalogs().map(({catalog, page}) => ({ url: `${base}${catalogPageHref(catalog, page)}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
    { url: `${base}/temas`, changeFrequency: "weekly", priority: 0.8 },
    ...topicDirectory.map(t => ({ url: `${base}/temas/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${base}/calendario-lunar`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/codigo-morse`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/aplicacion-supervivencia-offline/herramientas`, changeFrequency: "monthly", priority: 0.6 },
    ...portalTopics.filter(t=>portalContent.some(p=>p.kind==='Guía'&&p.topic===t[0])).map(t=>({url:`${base}/guias-supervivencia/${t[0]}`,changeFrequency:'monthly' as const,priority:0.7})),
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/supervivencia`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/comparativas`, changeFrequency: "monthly", priority: 0.72 },
    { url: `${base}/checklists`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/nudos`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/senales-en-grupo`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/preparacion-practica`, changeFrequency: "monthly", priority: 0.7 },
    ...practicalGuides.map(guide=>({url:`${base}/preparacion-practica/${guide.slug}`,changeFrequency:"monthly" as const,priority:0.65})),
    ...allContentPages.map((page) => ({
      url: `${base}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: page.slug === "descargar" ? 0.9 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/supervivencia/${post.slug}`,
      images: [`${base}${post.image}`],
      ...(post.updatedAt || post.publishedAt ? { lastModified: new Date((post.updatedAt ?? post.publishedAt)!) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}
