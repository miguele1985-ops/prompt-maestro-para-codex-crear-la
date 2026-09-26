import Link from "next/link";
import { notFound } from "next/navigation";
import { practicalGuides } from "@/content/practical-guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { PracticeActions } from "@/components/PracticeActions";
import { ArticleEquipment } from "@/components/ArticleEquipment";
import { monetizationPolicy } from "@/lib/monetization";
import { pageMetadata } from "@/lib/seo";
export const dynamicParams=false;
export function generateStaticParams(){return practicalGuides.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const guide=practicalGuides.find(item=>item.slug===slug);if(!guide)return {};
  return pageMetadata({title:guide.title,description:guide.summary,slug:`preparacion-practica/${slug}`});
}
export default async function PracticalGuidePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;const guide=practicalGuides.find(item=>item.slug===slug);if(!guide)notFound();
  const next=practicalGuides.find(item=>item.slug===guide.next)!;
  return <div className="editorial-library"><article className="journal-section practical-article">
    <Breadcrumbs items={[{label:"Inicio",href:"/"},{label:"Preparación práctica",href:"/preparacion-practica"},{label:guide.title,href:`/preparacion-practica/${slug}`}]} />
    <header className="editorial-library-heading"><p className="journal-kicker">{guide.category}</p><h1>{guide.title}</h1><p>{guide.summary}</p></header>
    <div className="practical-introduction"><p>{guide.introduction}</p><figure><a href={`/screenshots/app/${guide.image}.jpg`}><ResponsiveImage src={`/screenshots/app/${guide.image}.jpg`} alt={`Captura de la app relacionada con ${guide.title}`} sizes="(max-width:700px) 220px, 260px" loading="eager" /></a><figcaption>La función en la app. Abrir captura completa.</figcaption></figure></div>
    <div className="editorial-prose">{guide.sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}</div>
    <p className="field-safety">{guide.mistake}</p>
    <PracticeActions title={guide.title} tasks={guide.tasks} slug={slug} />
    {monetizationPolicy(`/preparacion-practica/${slug}`).affiliate ? <ArticleEquipment slug={slug} /> : null}
    <section className="guide-topic"><h2>Continúa con un paso relacionado</h2><Link href={`/preparacion-practica/${next.slug}`}>{next.title}</Link><p><Link href="/aplicacion-supervivencia-offline">Conoce la app y sus recursos offline</Link></p><p><Link href="/descargar">Descargar la aplicación para Android</Link></p></section>
    <p className="commercial-info">Guía editorial adaptada de los módulos de Modo Crisis Survival, con capturas de la aplicación. No es un protocolo para una emergencia activa ni una inspección técnica.</p>
  </article></div>;
}
