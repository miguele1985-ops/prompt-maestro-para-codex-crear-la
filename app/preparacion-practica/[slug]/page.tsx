import Link from "next/link";
import { notFound } from "next/navigation";
import { practicalGuides } from "@/content/practical-guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { PracticeActions } from "@/components/PracticeActions";
import { ArticleEquipment } from "@/components/ArticleEquipment";
import { monetizationPolicy } from "@/lib/monetization";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { editorialCover } from "@/content/portal";
import { AppDownloadActions } from "@/components/AppDownloadActions";
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
    <SeoJsonLd data={{'@context':'https://schema.org','@type':'Article',headline:guide.title,description:guide.summary,image:absoluteUrl(editorialCover(slug).image),mainEntityOfPage:absoluteUrl(`/preparacion-practica/${slug}`),author:{'@type':'Organization',name:'Modo Crisis Survival',url:absoluteUrl('/sobre-nosotros')}}} />
    <Breadcrumbs items={[{label:"Inicio",href:"/"},{label:"Guías",href:"/guias-supervivencia"},{label:"Preparación práctica",href:"/preparacion-practica"},{label:guide.title,href:`/preparacion-practica/${slug}`}]} />
    <header className="editorial-library-heading"><p className="journal-kicker">{guide.category}</p><h1>{guide.title}</h1><p>{guide.summary}</p></header>
    <div className="practical-introduction"><p>{guide.introduction}</p><figure><ResponsiveImage src={editorialCover(slug).image} alt={editorialCover(slug).alt} width={576} height={360} sizes="(max-width:700px) 90vw, 360px" loading="eager" /><figcaption>Captura del módulo correspondiente de Modo Crisis Survival.</figcaption></figure></div>
    <div className="editorial-prose">{guide.sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}</div>
    <p className="field-safety">{guide.mistake}</p>
    <PracticeActions title={guide.title} tasks={guide.tasks} slug={slug} />
    {monetizationPolicy(`/preparacion-practica/${slug}`).affiliate ? <ArticleEquipment slug={slug} /> : null}
    <section className="guide-topic"><h2>Continúa con un paso relacionado</h2><Link href={`/preparacion-practica/${next.slug}`}>{next.title}</Link></section>
    <section className="editorial-app-cta"><div><h2>Lleva tu preparación contigo</h2><p>Consulta guías y recursos offline desde la aplicación Android.</p><AppDownloadActions /></div></section>
    <p className="commercial-info">Guía editorial adaptada de los módulos de Modo Crisis Survival. No es un protocolo para una emergencia activa ni una inspección técnica. <Link href="/aplicacion-supervivencia-offline/herramientas">Ver funciones y capturas de Android</Link>.</p>
  </article></div>;
}
