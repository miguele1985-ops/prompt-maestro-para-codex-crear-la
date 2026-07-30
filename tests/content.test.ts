import { describe, expect, it } from "vitest";
import { faqs } from "../src/content/faqs";
import { features } from "../src/content/features";
import { allContentPages } from "../src/content/pages";
import { siteConfig } from "../src/content/site-config";
import { appJsonLd, websiteJsonLd } from "../src/lib/seo";

describe("content architecture", () => {
  it("contains the required main routes", () => {
    const slugs = allContentPages.map((page) => page.slug);
    expect(slugs).toEqual(expect.arrayContaining([
      "funciones",
      "modo-crisis",
      "aplicacion-supervivencia-offline",
      "guias-supervivencia",
      "mapas-offline",
      "preparacion-familiar",
      "herramientas-supervivencia",
      "recursos-avanzados",
      "con-uso-de-internet",
      "aprendizaje-supervivencia",
      "inteligencia-artificial-offline",
      "ia-enciclopedia",
      "descargar",
      "preguntas-frecuentes",
      "actualizaciones",
      "contacto",
      "aviso-legal",
      "privacidad",
      "cookies",
      "condiciones",
      "seguridad",
    ]));
  });

  it("does not use fabricated testimonials", () => {
    expect(features.length).toBeGreaterThan(10);
    expect(JSON.stringify(allContentPages).toLowerCase()).not.toContain("testimonio");
  });

  it("keeps missing commercial data explicit", () => {
    expect(siteConfig.currentVersion).toMatch(/Añadir|Pendiente|confirmar/);
    expect(siteConfig.apkSha256).toMatch(/Pendiente/);
  });

  it("has visible FAQ content for schema", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(25);
    expect(faqs.every((faq) => faq.question && faq.answer)).toBe(true);
  });

  it("generates base structured data", () => {
    expect(appJsonLd()).toMatchObject({ "@type": "MobileApplication", name: siteConfig.appName });
    expect(websiteJsonLd()).toMatchObject({ "@type": "WebSite", name: siteConfig.appName });
  });
});
