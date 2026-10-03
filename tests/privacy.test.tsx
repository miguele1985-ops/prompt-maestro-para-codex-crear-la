import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PrivacyPage, { metadata } from "../app/privacidad/page";
import { appPrivacy } from "../src/content/app-privacy";

describe("Google Play privacy policy", () => {
  it("renders every supplied paragraph and the responsible person's contact", () => {
    const document = new DOMParser().parseFromString(renderToStaticMarkup(<PrivacyPage />), "text/html");
    const app = document.querySelector('article[aria-label="Privacidad de la app Android"]')!;
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector("time")?.getAttribute("datetime")).toBe("2026-10-03");
    expect(appPrivacy.sections).toHaveLength(10);
    for (const section of appPrivacy.sections) {
      expect(app.textContent).toContain(section.title);
      expect(app.textContent).toContain(section.body);
    }
    expect(app.querySelector('a[href="mailto:migueleclip@gmail.com"]')).not.toBeNull();
    expect(app.querySelector(`a[href="${appPrivacy.publicationUrl}"]`)).not.toBeNull();
  });

  it("makes external references clickable and keeps web privacy separate", () => {
    const document = new DOMParser().parseFromString(renderToStaticMarkup(<PrivacyPage />), "text/html");
    for (const href of ["https://open-meteo.com/en/terms", "https://developers.google.com/ml-kit/android-data-disclosure", "https://policies.google.com/privacy", "https://www.aepd.es"]) {
      expect(document.querySelector(`a[href="${href}"]`)).not.toBeNull();
    }
    const web = document.querySelector('section[aria-labelledby="web-privacy-title"]')!;
    expect(web.textContent).toContain("Privacidad de la web");
    expect(web.textContent).toContain("Datos que se pueden recoger");
    expect(web.querySelectorAll("h3").length).toBeGreaterThan(0);
    expect(metadata.alternates?.canonical).toBe("https://www.modocrisissurvival.com/privacidad");
  });
});
