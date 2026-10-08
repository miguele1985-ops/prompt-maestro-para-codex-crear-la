import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import EditorialPolicyPage from "../app/politica-editorial/page";
import { articleQualityRevisions } from "../src/content/article-quality-revisions";
import { blogPosts } from "../src/content/blog";
import { Footer } from "../src/components/Footer";
import sitemap from "../app/sitemap";
import nextConfig from "../next.config";
import ArticlePage from "../app/supervivencia/[slug]/page";

describe("AdSense technical and editorial improvements", () => {
  it("authorizes the actual publisher with a plain-text ads.txt", () => {
    const text = readFileSync("public/ads.txt", "utf8");
    expect(text).toBe("google.com, pub-7330652876943268, DIRECT, f08c47fec0942fa0\n");
    expect(readFileSync("app/layout.tsx", "utf8")).toContain("ca-pub-7330652876943268");
    expect(text).not.toMatch(/<|ca-pub-/);
  });

  it("publishes specific exercises and sources on the same four guide URLs", () => {
    expect(Object.keys(articleQualityRevisions)).toHaveLength(4);
    for (const [slug, revision] of Object.entries(articleQualityRevisions)) {
      const post = blogPosts.find(item => item.slug === slug)!;
      expect(post.sections).toEqual(revision.sections);
      expect(post.sources?.length).toBeGreaterThan(0);
      expect(post.updatedAt).toBe("2026-10-08");
      expect(post.sections).toHaveLength(6);
      // Regression check for the specific new material, not an AdSense word-count requirement.
      expect(post.sections.map(section => section.body).join(" ").split(/\s+/).length).toBeGreaterThan(300);
      expect(post.relatedLinks?.every(link => link.href.startsWith("/"))).toBe(true);
    }
  });

  it("makes responsibility and commercial limitations visible and discoverable", () => {
    const document = new DOMParser().parseFromString(renderToStaticMarkup(<EditorialPolicyPage />), "text/html");
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector("#responsable")?.textContent).toContain("Miguel Ángel");
    expect(document.querySelector('a[href="mailto:migueleclip@gmail.com"]')).not.toBeNull();
    expect(document.body.textContent).toContain("no son ensayos propios");
    expect(document.body.textContent).toContain("asistencia de inteligencia artificial");
    expect(renderToStaticMarkup(<Footer />)).toContain('href="/politica-editorial"');
    expect(sitemap().some(entry => entry.url.endsWith("/politica-editorial"))).toBe(true);
  });

  it("renders the four organizational exercises without generic shopping blocks", async () => {
    for (const slug of Object.keys(articleQualityRevisions)) {
      const markup = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug }) }));
      expect(markup).not.toContain('id="equipo-articulo"');
      expect(markup).toContain('href="/politica-editorial#responsable"');
      expect(markup).toContain("Actualizado");
    }
  });

  it("keeps only the three development previews out of search", async () => {
    const previews = ["/vista-previa-web.html", "/inicio-editorial-revisado.html", "/inicio-remoto.html"];
    const headers = await nextConfig.headers!();
    const cloudflareHeaders = readFileSync("public/_headers", "utf8");
    for (const source of previews) {
      expect(headers.find(entry => entry.source === source)?.headers).toContainEqual({ key: "X-Robots-Tag", value: "noindex" });
      expect(cloudflareHeaders).toContain(`${source}\n  X-Robots-Tag: noindex`);
    }
    expect(headers.some(entry => entry.source === "/supervivencia/:path*" && entry.headers.some(header => /noindex/.test(header.value)))).toBe(false);
  });
});
