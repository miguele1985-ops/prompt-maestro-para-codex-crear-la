import { appPrivacy } from "@/content/app-privacy";
import { allContentPages } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Política de privacidad de Modo Crisis Survival",
  description: "Privacidad de la versión Android de Google Play: datos locales, permisos, chat, servicios externos, conservación y derechos. Información de privacidad de la web.",
  slug: "privacidad",
});

// Only the policy's explicit source URLs become links; no HTML is injected.
const policyLinks = [
  "https://open-meteo.com/en/terms",
  "https://developers.google.com/ml-kit/android-data-disclosure",
  "https://policies.google.com/privacy",
  "www.aepd.es",
];
function PolicyText({ text }: { text: string }) {
  const link = policyLinks.find((url) => text.includes(url));
  if (!link) return <>{text}</>;
  const index = text.indexOf(link);
  return <>{text.slice(0, index)}<a href={link.startsWith("https://") ? link : `https://${link}`}>{link}</a><PolicyText text={text.slice(index + link.length)} /></>;
}

export default function PrivacyPage() {
  const webPrivacy = allContentPages.find((page) => page.slug === "privacidad")!;
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Modo Crisis Survival</p>
        <h1>{appPrivacy.title}</h1>
        <p>{appPrivacy.version}. Actualizada: <time dateTime={appPrivacy.updatedAt}>{appPrivacy.updatedAt}</time></p>
      </header>
      <article className={`content-band ${styles.policy}`} aria-label="Privacidad de la app Android">
        <dl className={styles.details}>
          <div><dt>Responsable</dt><dd>{appPrivacy.responsible}</dd></div>
          <div><dt>Contacto</dt><dd><a href={`mailto:${appPrivacy.email}`}>{appPrivacy.email}</a></dd></div>
          <div><dt>URL de publicacion</dt><dd><a href={appPrivacy.publicationUrl}>{appPrivacy.publicationUrl}</a></dd></div>
        </dl>
        <p>Esta política corresponde a la versión Android de Google Play. La información sobre la privacidad de la web figura al final de esta página.</p>
        {appPrivacy.sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2>{section.title}</h2>
            <p><PolicyText text={section.body} /></p>
          </section>
        ))}
      </article>
      <section className={`content-band ${styles.policy} ${styles.webPolicy}`} aria-labelledby="web-privacy-title">
        <h2 id="web-privacy-title">Privacidad de la web</h2>
        {webPrivacy.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {webPrivacy.sections?.map((section) => (
          <section key={section.title} className={styles.section}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
            {section.items ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            {section.warning ? <p>{section.warning}</p> : null}
          </section>
        ))}
      </section>
    </>
  );
}
