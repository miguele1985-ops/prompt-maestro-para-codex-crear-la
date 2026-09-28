import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { KnotLibrary } from "@/components/KnotLibrary";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Nudos útiles: 19 fichas por función y límites de uso", description: "Catálogo educativo de nudos de la app: lazos, topes, amarres, uniones y tensado. Aprende a distinguir funciones y límites antes de practicar.", slug: "nudos", image: "/images/blog/practica-cuerda-natural.jpg" });
export default function KnotsPage() {
  return <div className="editorial-library"><div className="journal-section">
    <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Guías", href: "/guias-supervivencia" }, { label: "Nudos", href: "/nudos" }]} />
    <header className="editorial-library-heading"><p className="journal-kicker">De la app a tu práctica</p><h1>Nudos útiles</h1><p>No todos los nudos resuelven el mismo problema. Antes de memorizar una secuencia, distingue si necesitas un tope, un lazo, una unión o un amarre.</p></header>
    <div className="field-introduction">
      <img src="/images/blog/practica-cuerda-natural-960.webp" alt="Práctica con cuerda sin carga sobre una mesa. Imagen ilustrativa generada con IA." width={960} height={640} />
      <div><h2>Aprender una función, no una promesa de seguridad</h2><p>Estas 19 fichas parten del catálogo de la aplicación y se han adaptado a una consulta web. Sirven para ordenar conceptos y detectar límites; no sustituyen un curso ni describen una maniobra de rescate.</p><p>Practica en una mesa, con cuerda sin carga y sin personas ni animales sujetos. Para técnicas verticales, utiliza formación y documentación específica del equipo.</p><Link href="/supervivencia/5-nudos-basicos-de-supervivencia-que-merece-la-pena-practicar">Leer la guía de cinco nudos para empezar</Link></div>
    </div>
    <KnotLibrary />
    <section className="editorial-review-note"><h2>Fuentes y límites del material</h2><p>Catálogo adaptado de Modo Crisis Survival. Las láminas de la app pendientes de revisión técnica no se muestran como instrucciones paso a paso.</p><p><a href="https://www.petzl.com/PT/es/Sport/Nudos?ActivityName=Descenso-de-barrancos" target="_blank" rel="noopener noreferrer">Petzl: documentación técnica de nudos y advertencias de formación</a></p><Link href="/aplicacion-supervivencia-offline">Conocer la aplicación y sus recursos offline</Link></section>
  </div></div>;
}
