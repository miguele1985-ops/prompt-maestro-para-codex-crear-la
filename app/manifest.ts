import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.appName} Web`,
    short_name: "Modo Crisis",
    description: "PWA informativa de la web. La aplicación completa se descarga por separado.",
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.colors.background,
    theme_color: siteConfig.colors.primary,
    icons: [
      { src: "/brand/logo.jpg", sizes: "192x192", type: "image/jpeg" },
      { src: "/brand/logo.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
  };
}
