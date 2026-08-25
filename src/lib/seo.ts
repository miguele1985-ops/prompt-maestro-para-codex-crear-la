import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";

export function absoluteUrl(path = "/") {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  slug = "",
  keywords = [],
  image = "/og.jpg",
  imageAlt = siteConfig.appName,
}: {
  title: string;
  description: string;
  slug?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
}): Metadata {
  const path = slug ? `/${slug}` : "/";
  const fullTitle = title.includes(siteConfig.appName) ? title : `${title} | ${siteConfig.appName}`;
  const socialImage = absoluteUrl(image);
  const socialImageHeight = image === "/og.jpg" ? 630 : 750;

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.seo.keywords, ...keywords],
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.appName,
      images: [{ url: socialImage, width: 1200, height: socialImageHeight, alt: imageAlt }],
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organizationName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl(siteConfig.logo),
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.supportEmail,
      contactType: "customer support",
    },
  };
}

export function appJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: siteConfig.appName,
    operatingSystem: "Android",
    applicationCategory: "UtilitiesApplication",
    description: siteConfig.seo.description,
    downloadUrl: absoluteUrl(siteConfig.apkUrl),
    softwareVersion: siteConfig.currentVersion,
    offers: { "@type": "Offer", price: "Configurar antes de publicar", priceCurrency: "EUR" },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.appName,
    url: siteConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.siteUrl}/guias-supervivencia?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
