import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { siteConfig } from "@/content/site-config";
import { appJsonLd, organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
});

export const viewport: Viewport = {
  themeColor: siteConfig.colors.background,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#main">Saltar al contenido</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CookieBanner />
        <SeoJsonLd data={[organizationJsonLd(), websiteJsonLd(), appJsonLd()]} />
      </body>
    </html>
  );
}
