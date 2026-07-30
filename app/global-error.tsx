"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="es">
      <body>
        <section className="page-hero">
          <p className="eyebrow">500</p>
          <h1>Algo no ha funcionado</h1>
          <p>Prueba de nuevo o vuelve al inicio.</p>
          <button className="button primary" type="button" onClick={reset}>Reintentar</button>
        </section>
      </body>
    </html>
  );
}
