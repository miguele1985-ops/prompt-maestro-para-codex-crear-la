import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <p className="eyebrow">404</p>
      <h1>Página no encontrada</h1>
      <p>Puede que el contenido haya cambiado de dirección. Busca una guía o explora el mapa de contenidos.</p>
      <Link className="button primary" href="/">Volver al inicio</Link>
      <nav className="article-actions" aria-label="Encontrar contenido"><Link href="/buscar">Buscar una guía</Link><Link href="/mapa-web">Mapa de contenidos</Link><Link href="/empieza-aqui">Empezar a prepararte</Link></nav>
    </section>
  );
}
