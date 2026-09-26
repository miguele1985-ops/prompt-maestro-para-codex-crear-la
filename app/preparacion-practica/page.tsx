import Link from "next/link";
import { practicalGuides } from "@/content/practical-guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { pageMetadata } from "@/lib/seo";
export const metadata=pageMetadata({title:`Preparación práctica: ${practicalGuides.length} guías del hogar y el grupo`,description:"Inventario, documentos, mapas offline, batería, revisiones, huerto y ejercicios familiares. Guías adaptadas de la app con listas descargables.",slug:"preparacion-practica"});
export default function PracticalLibrary() {
  return <div className="editorial-library"><div className="journal-section">
    <Breadcrumbs items={[{label:"Inicio",href:"/"},{label:"Preparación práctica",href:"/preparacion-practica"}]} />
    <header className="editorial-library-heading"><p className="journal-kicker">Del plan a la práctica</p><h1>Una mejora concreta cada vez</h1><p>No necesitas empezar comprando. Revisa lo que tienes, acuerda cómo usarlo y prueba las pequeñas cosas antes de necesitarlas.</p></header>
    <div className="practical-guide-grid">{practicalGuides.map(guide=><article key={guide.slug}><Link href={`/preparacion-practica/${guide.slug}`}><ResponsiveImage src={`/screenshots/app/${guide.image}.jpg`} alt={`Captura de la aplicación: ${guide.title}`} sizes="(max-width:700px) 110px, 140px" loading="lazy" /><div><span className="journal-kicker">{guide.category}</span><h2>{guide.title}</h2><p>{guide.summary}</p><span className="journal-read">Abrir guía y lista de acciones</span></div></Link></article>)}</div>
    <section className="guide-topic"><h2>Más recursos de la aplicación, también en la web</h2><div className="journal-utilities"><Link href="/senales-en-grupo">14 láminas de comunicación en grupo</Link><Link href="/nudos">19 fichas de nudos por función</Link><Link href="/plantas-y-fauna">Observación de plantas con imágenes</Link><Link href="/checklists">16 listas de preparación</Link></div></section>
    <p>Contenido adaptado del material de Modo Crisis Survival. Las capturas muestran la app; las listas de estas guías funcionan en la web y no se sincronizan con ella.</p>
  </div></div>;
}
