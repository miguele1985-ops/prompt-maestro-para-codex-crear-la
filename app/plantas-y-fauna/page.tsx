import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlantPhotoGallery } from "@/components/PlantPhotoGallery";
import { plantLibrary } from "@/content/mobile-field-library";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Plantas y fauna: observar, aprender y evitar confusiones", description: "Imágenes de plantas de la app, ejercicios de observación y guías sobre confusiones botánicas, setas y fauna. Sin recomendaciones de consumo por fotografía.", slug: "plantas-y-fauna", image: "/images/from-app/diente-de-leon.jpg" });
export default function NaturePage() {
  return <div className="editorial-library"><div className="journal-section">
    <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Guías", href: "/guias-supervivencia" }, { label: "Plantas y fauna", href: "/plantas-y-fauna" }]} />
    <header className="editorial-library-heading"><p className="journal-kicker">Cuaderno de campo</p><h1>Plantas y fauna</h1><p>Aprender a observar empieza por reconocer lo que todavía no sabes. Compara el conjunto, registra el entorno y deja la identificación abierta cuando falten datos.</p></header>
    <div className="field-safety"><strong>Observar no es autorizar el consumo.</strong><p>No comas plantas, frutos ni setas por su parecido con estas imágenes. No pruebes sabores ni preparados para resolver una duda y no manipules especies desconocidas. Ante una emergencia, contacta con el 112.</p></div>
    <PlantPhotoGallery />
    {plantLibrary.map((plant) => <section className="plant-field-entry" id={plant.id} key={plant.id}>
      <a className="plant-photo-link" href={plant.image} target="_blank" rel="noopener noreferrer" aria-label={`Abrir imagen completa de ${plant.name}`}>
        <picture><source type="image/webp" srcSet={`${plant.image.replace('.jpg','-360.webp')} 360w, ${plant.image.replace('.jpg','-576.webp')} 576w, ${plant.image.replace('.jpg','-960.webp')} 960w`} sizes="(max-width:700px) 90vw, 360px" /><img src={plant.image} alt={plant.alt} width={1024} height={1280} loading="lazy" /></picture>
      </a>
      <div><p className="journal-kicker">Observación, no recolección</p><h2>{plant.name}</h2><p><em>{plant.scientificName}</em></p><h3>Qué observar</h3><p>{plant.observation}</p><h3>Límites de esta ficha</h3><p>{plant.limit}</p><h3>Ejercicio de campo</h3><p>{plant.exercise}</p><a href={plant.source} target="_blank" rel="noopener noreferrer">{plant.sourceLabel}</a><p className="app-media-credit">Imagen incluida en la aplicación y facilitada para esta web. La fuente botánica enlazada no certifica la identidad de esta imagen.</p></div>
    </section>)}
    <section className="guide-topic"><h2>Antes de acercarte, recolectar o consumir</h2><ul>
      <li><Link href="/supervivencia/plantas-comestibles-y-peligrosas-que-se-pueden-confundir">Plantas que pueden confundirse</Link><p>Por qué un parecido no resuelve una identificación.</p></li>
      <li><Link href="/supervivencia/setas-comestibles-vs-toxicas-identificacion-sin-falsas-reglas">Setas: descarta las falsas reglas</Link><p>Los límites de fotografías y aplicaciones.</p></li>
      <li><Link href="/supervivencia/animales-venenosos-de-espana-cuales-hay-y-que-hacer">Fauna: distancia y prevención</Link><p>No captures un animal para identificarlo.</p></li>
      <li><Link href="/nudos">Catálogo de nudos útiles</Link><p>Otra forma de aprender del material de la app.</p></li>
    </ul></section>
    <p><Link href="/aplicacion-supervivencia-offline">Conoce las funciones de consulta offline de Modo Crisis Survival</Link></p>
  </div></div>;
}
