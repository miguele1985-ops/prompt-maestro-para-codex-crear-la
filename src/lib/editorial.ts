import type { BlogPost } from "@/content/blog";
import originalIndex from "@/content/editorial-index.json";
export type EditorialIndex = { toc: {id:string;title:string}[]; words:number; readingMinutes:number; summary:string; sourceFile:string; sources:{title:string;url:string}[] };
export const articleIndex = originalIndex as Record<string,EditorialIndex>;
export const topics = ["Todos", "Agua", "Hogar y familia", "Energía y comunicación", "Naturaleza", "Equipo", "Calculadoras", "Aplicación"] as const;
export function articleTopic(post: Pick<BlogPost,'slug'|'category'|'title'>): string {
  const value = `${post.slug} ${post.category}`.toLowerCase();
  if(value.includes('calculadora')) return 'Calculadoras';
  if(/comparativa|comprar|mochila|botiquin|kit-/.test(value)) return 'Equipo';
  if(/agua|lluvia|potabiliza/.test(value)) return 'Agua';
  if(/plantas|setas|animales|nudos|naturaleza/.test(value)) return 'Naturaleza';
  if(/bateria|powerbank|radio|apagon|cobertura|energia|comunicacion/.test(value)) return 'Energía y comunicación';
  if(/aplicacion|app-|mbtiles|mapas-offline/.test(value)) return 'Aplicación';
  return 'Hogar y familia';
}
export function readingMinutes(post: BlogPost) {
  return articleIndex[post.slug]?.readingMinutes ?? Math.max(2,Math.ceil(post.sections.map(s=>s.body+' '+(s.bullets||[]).join(' ')).join(' ').split(/\s+/).length/200));
}
export function relatedArticles(post: BlogPost, posts: BlogPost[]) {
  return posts.filter(p=>p.slug!==post.slug).sort((a,b)=>Number(articleTopic(b)===articleTopic(post))-Number(articleTopic(a)===articleTopic(post))).slice(0,3);
}
