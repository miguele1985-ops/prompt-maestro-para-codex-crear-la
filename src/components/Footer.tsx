import Link from "next/link";
import { siteConfig } from "@/content/site-config";

const footerColumns = [
  {
    title: "Funciones",
    links: [
      ["/funciones", "Funciones"],
      ["/guias-supervivencia", "Guías"],
      ["/herramientas-supervivencia", "Herramientas"],
      ["/recursos-avanzados", "Recursos avanzados"],
      ["/con-uso-de-internet", "Con uso de Internet"],
    ],
  },
  {
    title: "App",
    links: [
      ["/aprendizaje-supervivencia", "Aprendizaje"],
      ["/ia-enciclopedia", "IA y enciclopedia"],
      ["/centro-descargas", "Centro de descargas"],
      ["/descargar", "Descarga"],
      ["/donaciones", "Donaciones"],
    ],
  },
  {
    title: "Legal y contacto",
    links: [
      ["/aviso-legal", "Aviso legal"],
      ["/privacidad", "Privacidad"],
      ["/contacto", "Contacto"],
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
          Modo Crisis Survival es una aplicación de preparación y supervivencia offline diseñada para ayudar a organizar información, herramientas y recursos ante emergencias.
        </p>
        <p>Versión: V 1.0</p>
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