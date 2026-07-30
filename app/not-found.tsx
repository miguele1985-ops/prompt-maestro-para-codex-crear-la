import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <p className="eyebrow">404</p>
      <h1>Página no encontrada</h1>
      <p>La ruta solicitada no existe o todavía no se ha publicado.</p>
      <Link className="button primary" href="/">Volver al inicio</Link>
    </section>
  );
}
