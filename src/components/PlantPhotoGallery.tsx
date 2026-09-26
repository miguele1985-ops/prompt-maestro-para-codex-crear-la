import Link from "next/link";
import { plantLibrary } from "@/content/mobile-field-library";

export function PlantPhotoGallery() {
  return <section className="app-plant-gallery" aria-labelledby="app-plants-heading">
    <h2 id="app-plants-heading">Observación botánica: imágenes de la app</h2>
    <p>Estas imágenes ayudan a observar detalles, no a decidir qué comer. Una identificación requiere más información que el parecido con una fotografía.</p>
    <div className="app-plant-grid">
      {plantLibrary.map((plant) => <figure key={plant.id}>
        <Link href={`/plantas-y-fauna#${plant.id}`}>
          <picture><source type="image/webp" srcSet={`${plant.image.replace('.jpg', '-360.webp')} 360w, ${plant.image.replace('.jpg', '-576.webp')} 576w`} sizes="(max-width:700px) 90vw, 260px" />
            <img src={plant.image} alt={plant.alt} width={1024} height={1280} loading="lazy" />
          </picture>
          <figcaption><strong>{plant.name}</strong><em>{plant.scientificName}</em></figcaption>
        </Link>
      </figure>)}
    </div>
    <p className="app-media-credit">Material de la aplicación Modo Crisis Survival, facilitado para esta web. No es una certificación de identidad ni comestibilidad.</p>
  </section>;
}
