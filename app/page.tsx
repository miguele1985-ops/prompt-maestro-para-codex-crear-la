import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Droplets, Backpack, Smartphone, Download } from "lucide-react";
import { blogPosts, type BlogPost } from "@/content/blog";
import { affiliateDisclosure, amazonSearchUrl } from "@/content/affiliate";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Modo Crisis Survival | Supervivencia, guías y equipo", description: "Consejos de supervivencia y preparación para casa y montaña. Artículos completos, comparativas de equipo y una app para llevar tus recursos sin conexión." });

const picks = ["mejores-mochilas-de-emergencia-72h-en-espana-2026", "filtros-de-agua-portatiles-cuales-funcionan-de-verdad", "evacuacion-de-vivienda-checklist-paso-a-paso", "radios-de-manivela-y-a-pilas-para-emergencias"];
const field = ["5-nudos-basicos-de-supervivencia-que-merece-la-pena-practicar", "plantas-comestibles-y-peligrosas-que-se-pueden-confundir", "mascotas-en-emergencias-apagon-calor-y-evacuacion"];
function posts(slugs: string[]) { return slugs.map(slug => blogPosts.find(p => p.slug === slug)).filter((p): p is BlogPost => Boolean(p)); }
function ArticleCard({ post }: { post: BlogPost }) {
  return <article className="journal-story"><Link href={`/blog/${post.slug}`}><ResponsiveImage src={post.image} alt={post.imageAlt} width={576} height={360} sizes="(max-width: 700px) 94vw, (max-width: 1000px) 46vw, 320px" loading="lazy" /><div className="journal-story-copy"><span className="journal-kicker">{post.category} · {post.readingTime}</span><h3>{post.title}</h3><p>{post.excerpt}</p><span className="journal-read">Leer artículo <ArrowRight size={16} aria-hidden /></span></div></Link></article>;
}

export default function HomePage() {
  return <div className="survival-journal">
    <section className="journal-cover">
      <picture><source media="(max-width: 700px)" srcSet="/images/editorial/preparacion-800.webp" /><img src="/images/editorial/preparacion-1600.webp" alt="Mochila, mapa y equipo de preparación junto a un sendero de montaña. Imagen ilustrativa creada con IA." width={1536} height={1024} fetchPriority="high" /></picture>
      <div className="journal-cover-copy"><p className="journal-kicker">Preparación cotidiana · Vida al aire libre</p><h1>Modo Crisis Survival</h1><p className="journal-deck">Aprende a prepararte.<br />Sal ahí fuera con más recursos.</p><p>Guías de supervivencia, consejos para tu hogar y criterios para elegir el equipo que de verdad necesitas.</p><div className="journal-actions"><Link className="journal-primary" href="#lecturas"><BookOpen size={18} aria-hidden /> Explorar las guías</Link><Link className="journal-light" href="/comparativas">Elegir equipo <ArrowRight size={18} aria-hidden /></Link></div></div>
      <span className="journal-photo-credit">Imagen ilustrativa generada con IA</span>
    </section>
    <nav className="journal-topics" aria-label="Explorar por necesidad">
      <Link href="/blog/como-prepararse-para-un-apagon"><BookOpen aria-hidden /> Preparar tu hogar</Link><Link href="/blog/filtros-de-agua-portatiles-cuales-funcionan-de-verdad"><Droplets aria-hidden /> Agua y suministros</Link><Link href="/blog/mejores-mochilas-de-emergencia-72h-en-espana-2026"><Backpack aria-hidden /> Mochila y equipo</Link><Link href="/recursos-avanzados"><Compass aria-hidden /> Orientación y recursos</Link>
    </nav>
    <section className="journal-section" id="lecturas"><div className="journal-heading"><div><p className="journal-kicker">Empieza por lo importante</p><h2>Prepararse también se aprende</h2></div><Link href="/blog">Todos los artículos <ArrowRight size={18} aria-hidden /></Link></div><div className="journal-grid">{posts(picks).map(post => <ArticleCard key={post.slug} post={post} />)}</div></section>
    <section className="journal-equipment"><div className="journal-section"><div className="journal-heading"><div><p className="journal-kicker">Compra con criterio</p><h2>Menos improvisación. Mejor equipo.</h2></div><Link href="/comparativas">Ver comparativas <ArrowRight size={18} aria-hidden /></Link></div><p className="journal-intro">Capacidad, autonomía, peso y mantenimiento: conoce qué revisar antes de comprar.</p><div className="journal-products">{[
      { title: "Mochilas de emergencia", image: "mochila-emergencia-72h-comparativa", slug: picks[0], query: "mochila emergencia 72 horas", text: "El volumen importa, pero poder llevarla cargada importa más." },
      { title: "Filtros de agua", image: "filtros-agua-portatiles-comparativa", slug: picks[1], query: "filtro agua portatil supervivencia", text: "Entiende los límites de cada tecnología y el coste de los recambios." },
      { title: "Radios de emergencia", image: "radio-manivela-pilas-emergencia", slug: picks[3], query: "radio emergencia pilas manivela", text: "Compara alimentación, recepción y facilidad de uso." },
    ].map(item => <article key={item.slug}><img src={`/images/blog/${item.image}-576.webp`} alt={`Imagen ilustrativa de ${item.title.toLowerCase()}`} width={576} height={360} loading="lazy" /><h3>{item.title}</h3><p>{item.text}</p><Link href={`/blog/${item.slug}`}>Leer la comparativa <ArrowRight size={16} aria-hidden /></Link><a href={amazonSearchUrl(item.query)} rel="sponsored noopener noreferrer" target="_blank">Ver opciones en Amazon <ArrowRight size={16} aria-hidden /></a></article>)}</div><p className="journal-disclosure">{affiliateDisclosure} Las imágenes son ilustrativas; no representan pruebas propias ni modelos concretos.</p></div></section>
    <section className="journal-section"><div className="journal-heading"><div><p className="journal-kicker">Conocimiento práctico</p><h2>En casa, en ruta y en la naturaleza</h2></div><Link href="/guias-supervivencia">Biblioteca de guías <ArrowRight size={18} aria-hidden /></Link></div><div className="journal-grid journal-grid-three">{posts(field).map(post => <ArticleCard key={post.slug} post={post} />)}</div></section>
    <section className="journal-app"><div className="journal-section journal-app-inner"><img src="/screenshots/app/home-360.webp" width={360} height={780} alt="Pantalla de inicio de Modo Crisis Survival para Android" loading="lazy" /><div><p className="journal-kicker"><Smartphone size={18} aria-hidden /> También contigo, sin cobertura</p><h2>Tu preparación cabe en el móvil</h2><p>La aplicación Modo Crisis Survival reúne guías, mapas offline, calculadoras y planes familiares. Prepara tus recursos antes de salir y consúltalos cuando no tengas Internet.</p><div className="journal-actions"><Link className="journal-primary" href="/aplicacion-supervivencia-offline">Conocer la aplicación <ArrowRight size={18} aria-hidden /></Link><Link className="journal-light" href="/descargar"><Download size={18} aria-hidden /> Descargar para Android</Link></div><nav aria-label="Recursos de la aplicación"><Link href="/actualizaciones">Actualizaciones</Link><Link href="/centro-descargas">Mapas y descargas</Link><Link href="/preguntas-frecuentes">Preguntas frecuentes</Link></nav></div></div></section>
  </div>;
}
