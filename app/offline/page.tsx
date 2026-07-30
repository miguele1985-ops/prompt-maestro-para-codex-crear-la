import Link from "next/link";

export default function OfflinePage() {
  return (
    <section className="page-hero">
      <p className="eyebrow">PWA web</p>
      <h1>Página offline de la web</h1>
      <p>Esta página pertenece a la PWA informativa. La aplicación Android completa se descarga por separado.</p>
      <Link className="button primary" href="/descargar">Descargar aplicación Android</Link>
    </section>
  );
}
