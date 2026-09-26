import type { BlogPost } from "@/content/blog";
import originalIndex from "@/content/editorial-index.json";
export type EditorialIndex = {
  toc: { id: string; title: string }[];
  words: number;
  readingMinutes: number;
  summary: string;
  sourceFile: string;
  sources: { title: string; url: string }[];
};
export const articleIndex = originalIndex as Record<string, EditorialIndex>;
export const topics = [
  "Todos",
  "Agua",
  "Hogar y familia",
  "Energía y comunicación",
  "Naturaleza",
  "Equipo",
  "Calculadoras",
  "Aplicación",
] as const;
export function articleTopic(post: Pick<BlogPost, "slug" | "category" | "title">): string {
  const value = `${post.slug} ${post.category}`.toLowerCase();
  if (value.includes("calculadora")) return "Calculadoras";
  if (/comparativa|comprar|mochila|botiquin|kit-/.test(value)) return "Equipo";
  if (/agua|lluvia|potabiliza/.test(value)) return "Agua";
  if (/plantas|setas|animales|nudos|naturaleza/.test(value)) return "Naturaleza";
  if (/bateria|powerbank|radio|apagon|cobertura|energia|comunicacion/.test(value))
    return "Energía y comunicación";
  if (/aplicacion|app-|mbtiles|mapas-offline/.test(value)) return "Aplicación";
  return "Hogar y familia";
}
export function readingMinutes(post: BlogPost) {
  return (
    articleIndex[post.slug]?.readingMinutes ??
    Math.max(
      2,
      Math.ceil(
        post.sections
          .map((s) => s.body + " " + (s.bullets || []).join(" "))
          .join(" ")
          .split(/\s+/).length / 200,
      ),
    )
  );
}
export function relatedArticles(post: BlogPost, posts: BlogPost[]) {
  const explicit = new Set(post.relatedLinks?.map((link) => link.href) ?? []);
  const tokens = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3 && !["para", "como", "supervivencia", "emergencia", "emergencias"].includes(word));
  const terms = new Set(tokens([post.title, ...post.keywords].join(" ")));
  const score = (candidate: BlogPost) => {
    const overlap = new Set(tokens([candidate.title, ...candidate.keywords].join(" ")).filter((word) => terms.has(word))).size;
    return (explicit.has(`/blog/${candidate.slug}`) ? 100 : 0) +
      (articleTopic(candidate) === articleTopic(post) ? 10 : 0) + Math.min(overlap, 20);
  };
  return posts
    .filter((p) => p.slug !== post.slug)
    .sort(
      (a, b) => score(b) - score(a),
    )
    .slice(0, 3);
}
