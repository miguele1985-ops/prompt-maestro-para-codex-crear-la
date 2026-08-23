import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/administracion", "/admin-login", "/api/admin", "/pago-licencia"],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
