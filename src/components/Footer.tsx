import Link from "next/link";
import { siteConfig } from "@/content/site-config";

const footerColumns = [
  {
    title: "Explorar",
    links: [
      ["/temas", "Todos los temas"],
      ["/mapa-web", "Mapa de contenidos"],
      ["/supervivencia", "Artículos"],
      ["/guias-supervivencia", "Guías"],
      ["/herramientas-supervivencia", "Herramientas"],
      ["/comparativas", "Comparativas"],
    ],
  },
  {
    title: "App",
    links: [
      ["/aplicacion-supervivencia-offline", "Conocer la app"],
      ["/centro-descargas", "Centro de descargas"],
      ["/descargar", "Descarga"],
      ["/preguntas-frecuentes", "Preguntas frecuentes"],
    ],
  },
  {
    title: "Proyecto",
    links: [["/sobre-nosotros", "Sobre nosotros"], ["/donaciones", "Donaciones"], ["/contacto", "Contacto"]],
  },
  {
    title: "Legal",
    links: [
      ["/aviso-legal", "Aviso legal"],
      ["/privacidad", "Privacidad"],
      ["/condiciones", "Condiciones"],
      ["/cookies", "Cookies"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>{siteConfig.appName}</strong>
        <p>
          Guías de supervivencia, preparación familiar y comparativas de equipo. Aprende en la web y lleva tus recursos contigo con nuestra aplicación offline.
        </p>
        <Link href="/aplicacion-supervivencia-offline">Conoce la aplicación para Android</Link>
      </div>
      <nav className="footer-columns" aria-label="Navegación de pie de página">
        {footerColumns.map((column) => (
          <div className="footer-column" key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>
        ))}
      </nav>
      <p className="copyright">© {new Date().getFullYear()} Modo Crisis Survival</p>
    </footer>
  );
}
