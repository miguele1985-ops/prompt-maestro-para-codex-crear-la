import Link from "next/link";
export function WebToolsLinks() {
  return (
    <section className="content-band web-tools-links">
      <h2>Calculadoras que puedes usar aquí</h2>
      <div>
        {[
          ["calculadora-captacion-lluvia-supervivencia", "Captación de lluvia"],
          ["calculadora-sensacion-termica-frio-calor", "Sensación térmica"],
          ["calculadora-horas-luz-ruta", "Horas de luz"],
          ["calculadora-velocidad-necesaria-ruta", "Velocidad necesaria"],
          ["calculadora-gestion-agua-supervivencia", "Reserva de agua"],
          ["calculadora-energia-powerbank-emergencia", "Autonomía de energía"],
        ].map(([slug, title]) => (
          <Link key={slug} href={`/blog/${slug}#calculadora`}>
            {title}
          </Link>
        ))}
      </div>
      <p>
        <Link href="/checklists">Lista de preparación imprimible</Link>
      </p>
    </section>
  );
}
