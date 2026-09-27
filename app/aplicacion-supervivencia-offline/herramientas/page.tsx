import Link from "next/link";
import { allContentPages } from "@/content/pages";
import { practicalGuides } from "@/content/practical-guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { readAdminContent } from "@/lib/admin-content";
export const dynamic = "force-dynamic";
export const runtime = "edge";
export const metadata = pageMetadata({
  title: "Herramientas personales de la aplicación Android",
  description:
    "Inventario, documentos, batería, contactos, mapas y respaldo: manual de las funciones de Modo Crisis Survival para Android.",
  slug: "aplicacion-supervivencia-offline/herramientas",
});
export default async function AppTools() {
  const saved = await readAdminContent().catch(() => null);
  const page = saved?.pages?.find((p) => p.slug === "herramientas-supervivencia") ?? allContentPages.find((p) => p.slug === "herramientas-supervivencia")!;
  return (
    <div className="editorial-library">
      <div className="journal-section portal-manual">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "App", href: "/aplicacion-supervivencia-offline" },
            {
              label: "Herramientas personales",
              href: "/aplicacion-supervivencia-offline/herramientas",
            },
          ]}
        />
        <h1>Herramientas personales de Android</h1>
        <p className="portal-app-notice">
          Disponible en la aplicación. Estas funciones no se ejecutan en el navegador.
        </p>
        {page.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {page.highlights ? (
          <ul>
            {page.highlights.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null}
        {page.sections?.map((s) => (
          <details key={s.title}>
            <summary>{s.title}</summary>
            {s.image ? <img src={s.image} alt={s.imageAlt || s.title} loading="lazy" /> : null}
            <p>{s.body}</p>
            {s.items ? (
              <ul>
                {s.items.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
            {s.steps ? (
              <ol>
                {s.steps.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            ) : null}
            {s.tips ? (
              <ul>
                {s.tips.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
            {s.warning ? <p>{s.warning}</p> : null}
            {s.buttonHref ? <Link href={s.buttonHref}>{s.buttonLabel}</Link> : null}
          </details>
        ))}
        <h2>Capturas de las funciones</h2>
        {practicalGuides.map((g) => (
          <details key={g.slug}>
            <summary>{g.title}</summary>
            <img
              src={`/screenshots/app/${g.image}.jpg`}
              alt={`Función en Android: ${g.title}`}
              loading="lazy"
            />
            <p>
              <Link href={`/preparacion-practica/${g.slug}`}>Guía práctica y lista web</Link>
            </p>
          </details>
        ))}
        <p>
          <Link href="/herramientas-supervivencia">Usar las herramientas web</Link> ·{" "}
          <Link href="/descargar">Descargar la app</Link>
        </p>
      </div>
    </div>
  );
}
