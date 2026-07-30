import Link from "next/link";
import { siteConfig } from "@/content/site-config";

const footerLinks = [
  ["/funciones", "Funciones"],
  ["/guias-supervivencia", "Guías"],
  ["/herramientas-supervivencia", "Herramientas personales"],
  ["/recursos-avanzados", "Recursos avanzados"],
  ["/con-uso-de-internet", "Con uso de Internet"],
  ["/aprendizaje-supervivencia", "Aprendizaje"],
  ["/ia-enciclopedia", "IA y enciclopedia"],
  ["/donaciones", "Donaciones"],
  ["/descargar", "Descarga"],
  ["/contacto", "Contacto"],
  ["/seguridad", "Seguridad"],
  ["/privacidad", "Privacidad"],
  ["/cookies", "Cookies"],
  ["/aviso-legal", "Aviso legal"],
  ["/condiciones", "Condiciones"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{siteConfig.appName}</strong>
        <p>
          Modo Crisis Survival es una aplicación de preparación y supervivencia offline diseñada para ayudar a organizar información, herramientas y recursos ante emergencias.
        </p>
        <p>Versión: {siteConfig.currentVersion}</p>
      </div>
      <nav aria-label="Navegación de pie de página">
        {footerLinks.map(([href, label]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
      <p className="copyright">© {new Date().getFullYear()} {siteConfig.organizationName}. Configurar datos legales antes de publicar.</p>
    </footer>
  );
}
