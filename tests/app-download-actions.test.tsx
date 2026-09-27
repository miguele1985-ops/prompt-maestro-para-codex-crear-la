import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppDownloadActions } from "../src/components/AppDownloadActions";
import { officialApkUrl } from "../src/content/site-config";
import { downloadInfo } from "../src/content/downloads";

describe("App download calls to action", () => {
  it("offers the official APK, current version and separate information links", () => {
    const html = renderToStaticMarkup(<AppDownloadActions />);
    expect(html).toContain(`href="${officialApkUrl}"`);
    expect(html).toContain("Descargar app para Android");
    expect(html).toContain(downloadInfo.version);
    expect(html).toContain('href="/aplicacion-supervivencia-offline"');
    expect(html).toContain('href="/descargar"');
  });
});
