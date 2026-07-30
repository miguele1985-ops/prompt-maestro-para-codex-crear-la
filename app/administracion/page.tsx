"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  FileUp,
  Image as ImageIcon,
  ListPlus,
  LogOut,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { changelog, downloadInfo } from "@/content/downloads";
import { allContentPages } from "@/content/pages";
import { siteConfig } from "@/content/site-config";
import type { ChangelogEntry, ContentPage } from "@/types/content";

type AdminTab = "sitio" | "seo" | "descarga" | "paginas" | "actualizaciones" | "multimedia" | "avanzado";

type SiteEditor = {
  appName: string;
  slogan: string;
  description: string;
  siteUrl: string;
  supportEmail: string;
  contactEmail: string;
  organizationName: string;
  legalOwner: string;
  logo: string;
  heroImage: string;
  videoPoster: string;
  presentationVideo: string;
  apkUrl: string;
  alternativeApkUrl: string;
  currentVersion: string;
  apkSize: string;
  apkSha256: string;
  lastUpdated: string;
  minimumAndroidVersion: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    militaryGreen: string;
    warning: string;
    danger: string;
    text: string;
  };
  social: {
    whatsapp: string;
    telegram: string;
    x: string;
    youtube: string;
  };
  donations: {
    enabled: boolean;
    primaryUrl: string;
    paypalUrl: string;
    bizumInfo: string;
    kofiUrl: string;
    patreonUrl: string;
    note: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

type DownloadEditor = {
  name: string;
  icon: string;
  apkUrl: string;
  alternativeUrl: string;
  version: string;
  date: string;
  size: string;
  minimumAndroidVersion: string;
  sha256: string;
  permissions: string[];
  installSteps: string[];
};

type AdminData = {
  site: Partial<SiteEditor>;
  download: Partial<DownloadEditor>;
  changelog: ChangelogEntry[];
  pages: ContentPage[];
};

type PageSection = NonNullable<ContentPage["sections"]>[number];

const tabs: Array<{ id: AdminTab; label: string; helper: string; icon: typeof Settings }> = [
  { id: "sitio", label: "Web", helper: "Nombre, textos, colores y contacto", icon: Settings },
  { id: "seo", label: "SEO", helper: "Google, metadatos y palabras clave", icon: Search },
  { id: "descarga", label: "APK", helper: "Archivo, versión, permisos e instalación", icon: Download },
  { id: "paginas", label: "Páginas", helper: "Textos, secciones, imágenes y avisos", icon: FileText },
  { id: "actualizaciones", label: "Actualizaciones", helper: "Historial de versiones editable", icon: ListPlus },
  { id: "multimedia", label: "Multimedia", helper: "Rutas de imágenes, capturas y vídeo", icon: ImageIcon },
  { id: "avanzado", label: "Avanzado", helper: "JSON completo para ajustes finos", icon: ShieldCheck },
];

const emptySection: PageSection = {
  title: "Nueva opción",
  body: "Explica qué hace esta opción, cuándo se usa y por qué aporta valor.",
  items: ["Función pendiente de completar"],
  steps: ["Abrir la sección en la aplicación", "Revisar las opciones disponibles"],
  tips: ["Añadir consejo útil"],
  warning: "",
  image: "/screenshots/placeholder-screenshot.svg",
  imageAlt: "Captura pendiente de sustituir",
};

const emptyPage: ContentPage = {
  slug: "nueva-pagina",
  title: "Nueva página",
  eyebrow: "Configurar",
  description: "Descripción pendiente de añadir.",
  body: ["Primer párrafo pendiente de editar."],
  highlights: ["Pendiente de completar"],
  sections: [emptySection],
  cta: "Descargar Modo Crisis Survival",
  seoTitle: "Nueva página",
  seoDescription: "Metadescripción pendiente de editar.",
  keywords: ["Pendiente de añadir"],
};

function listToText(value?: string[]) {
  return (value || []).join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function parseJson<T>(value: string, fallback: T) {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("sitio");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [site, setSite] = useState<SiteEditor>({
    appName: siteConfig.appName,
    slogan: siteConfig.slogan,
    description: siteConfig.description,
    siteUrl: siteConfig.siteUrl,
    supportEmail: siteConfig.supportEmail,
    contactEmail: siteConfig.contactEmail,
    organizationName: siteConfig.organizationName,
    legalOwner: siteConfig.legalOwner,
    logo: siteConfig.logo,
    heroImage: siteConfig.heroImage,
    videoPoster: siteConfig.videoPoster,
    presentationVideo: siteConfig.presentationVideo,
    apkUrl: siteConfig.apkUrl,
    alternativeApkUrl: siteConfig.alternativeApkUrl,
    currentVersion: siteConfig.currentVersion,
    apkSize: siteConfig.apkSize,
    apkSha256: siteConfig.apkSha256,
    lastUpdated: siteConfig.lastUpdated,
    minimumAndroidVersion: siteConfig.minimumAndroidVersion,
    colors: siteConfig.colors,
    social: siteConfig.social,
    donations: siteConfig.donations,
    seo: siteConfig.seo,
  });
  const [download, setDownload] = useState<DownloadEditor>({
    ...downloadInfo,
    permissions: [...downloadInfo.permissions],
    installSteps: [...downloadInfo.installSteps],
  });
  const [entries, setEntries] = useState<ChangelogEntry[]>(changelog);
  const [pages, setPages] = useState<ContentPage[]>(allContentPages);
  const [selectedSlug, setSelectedSlug] = useState(allContentPages[0]?.slug || emptyPage.slug);
  const [advancedJson, setAdvancedJson] = useState(pretty({ site, download, changelog: entries, pages }));

  const selectedPage = useMemo(
    () => pages.find((page) => page.slug === selectedSlug) || pages[0] || emptyPage,
    [pages, selectedSlug],
  );

  useEffect(() => {
    let active = true;

    async function verifySession() {
      const response = await fetch("/api/admin/session", { cache: "no-store" }).catch(() => null);
      if (!active) return;
      if (!response?.ok) {
        window.location.href = `/admin-login?next=${encodeURIComponent("/administracion")}`;
        return;
      }
      setCheckingSession(false);
    }

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => {
    const pending = [
      site.supportEmail,
      site.contactEmail,
      site.legalOwner,
      download.size,
      download.sha256,
      download.date,
    ].filter((value) => /pendiente|configurar|añadir/i.test(value || "")).length;
    const totalSections = pages.reduce((sum, page) => sum + (page.sections?.length || 0), 0);
    return { pending, pages: pages.length, sections: totalSections };
  }, [download.date, download.sha256, download.size, pages, site.contactEmail, site.legalOwner, site.supportEmail]);

  function setSiteField<K extends keyof SiteEditor>(key: K, value: SiteEditor[K]) {
    setSite((current) => ({ ...current, [key]: value }));
  }

  function setDownloadField<K extends keyof DownloadEditor>(key: K, value: DownloadEditor[K]) {
    setDownload((current) => ({ ...current, [key]: value }));
  }

  function updatePage(nextPage: ContentPage) {
    setPages((current) => current.map((page) => (page.slug === selectedSlug ? nextPage : page)));
    setSelectedSlug(nextPage.slug);
  }

  function updatePageField<K extends keyof ContentPage>(key: K, value: ContentPage[K]) {
    updatePage({ ...selectedPage, [key]: value });
  }

  function updateSection(index: number, patch: Partial<PageSection>) {
    const sections = [...(selectedPage.sections || [])];
    sections[index] = { ...sections[index], ...patch };
    updatePage({ ...selectedPage, sections });
  }

  function addSection() {
    updatePage({ ...selectedPage, sections: [...(selectedPage.sections || []), { ...emptySection }] });
  }

  function removeSection(index: number) {
    updatePage({ ...selectedPage, sections: (selectedPage.sections || []).filter((_, itemIndex) => itemIndex !== index) });
  }

  function addPage() {
    const slug = `nueva-pagina-${Date.now()}`;
    const next = { ...emptyPage, slug, title: "Nueva página pendiente", seoTitle: "Nueva página pendiente" };
    setPages((current) => [...current, next]);
    setSelectedSlug(slug);
  }

  function duplicatePage() {
    const slug = `${selectedPage.slug}-copia-${Date.now()}`;
    const next = { ...selectedPage, slug, title: `${selectedPage.title} copia` };
    setPages((current) => [...current, next]);
    setSelectedSlug(slug);
  }

  function removePage() {
    if (pages.length <= 1) return;
    const nextPages = pages.filter((page) => page.slug !== selectedPage.slug);
    setPages(nextPages);
    setSelectedSlug(nextPages[0]?.slug || emptyPage.slug);
  }

  function addChangelogEntry() {
    setEntries((current) => [
      {
        version: "Añadir versión actual",
        date: "Pendiente de añadir",
        title: "Nueva actualización",
        changes: ["Cambio pendiente de describir"],
        fixes: [],
        downloadUrl: download.apkUrl,
      },
      ...current,
    ]);
  }

  function updateChangelog(index: number, patch: Partial<ChangelogEntry>) {
    setEntries((current) => current.map((entry, itemIndex) => (itemIndex === index ? { ...entry, ...patch } : entry)));
  }

  function removeChangelog(index: number) {
    setEntries((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function refreshAdvancedJson() {
    setAdvancedJson(pretty({ site, download, changelog: entries, pages }));
    setStatus("JSON avanzado actualizado con los datos actuales del panel.");
  }

  function applyAdvancedJson() {
    const parsed = parseJson<AdminData | null>(advancedJson, null);
    if (!parsed) {
      setStatus("El JSON avanzado no es válido. Revisa comas, comillas y corchetes.");
      return;
    }
    if (parsed.site) setSite((current) => ({ ...current, ...parsed.site }));
    if (parsed.download) setDownload((current) => ({ ...current, ...parsed.download }));
    if (Array.isArray(parsed.changelog)) setEntries(parsed.changelog);
    if (Array.isArray(parsed.pages) && parsed.pages.length) {
      setPages(parsed.pages);
      setSelectedSlug(parsed.pages[0].slug);
    }
    setStatus("JSON avanzado aplicado al borrador. Pulsa Guardar cambios para publicarlo en archivos.");
  }

  async function saveAll() {
    setSaving(true);
    setStatus("");
    const payload: AdminData = {
      site,
      download,
      changelog: entries,
      pages,
    };

    const response = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({ message: "Respuesta no válida." }));
    setSaving(false);
    setStatus(result.message || (response.ok ? "Cambios guardados." : "No se pudo guardar."));
  }

  async function uploadApk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    form.set("version", download.version);
    form.set("date", download.date);
    const response = await fetch("/api/admin/apk", {
      method: "POST",
      body: form,
    });
    const result = await response.json().catch(() => ({ message: "Respuesta no válida." }));
    setUploading(false);
    setStatus(result.message || (response.ok ? "APK guardado." : "No se pudo subir el APK."));
    if (response.ok) {
      setSite((current) => ({
        ...current,
        currentVersion: result.version,
        lastUpdated: result.date,
        apkSize: result.size,
        apkSha256: result.sha256,
        apkUrl: result.apkUrl,
      }));
      setDownload((current) => ({
        ...current,
        version: result.version,
        date: result.date,
        size: result.size,
        sha256: result.sha256,
        apkUrl: result.apkUrl,
      }));
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin-login";
  }

  if (checkingSession) {
    return (
      <section className="page-hero admin-login-page">
        <div className="admin-login-card">
          <ShieldCheck aria-hidden />
          <p className="eyebrow">Acceso restringido</p>
          <h1>Comprobando sesion</h1>
          <p>Un momento, estamos verificando el acceso al panel de administracion.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero admin-hero admin-workspace-hero">
        <p className="eyebrow">Administración protegida</p>
        <h1>Centro de control de la web</h1>
        <p>
          Modifica textos, páginas, capturas, SEO, colores, APK y actualizaciones desde formularios claros. Guarda cuando lo tengas listo y la web leerá estos cambios desde el archivo central de administración.
        </p>
      </section>

      <section className="content-band admin-dashboard">
        <div className="admin-topbar">
          <div className="admin-metric">
            <span>Páginas</span>
            <strong>{completion.pages}</strong>
            <p>Secciones editables: {completion.sections}</p>
          </div>
          <div className="admin-metric">
            <span>APK</span>
            <strong>{download.version}</strong>
            <p>{download.size}</p>
          </div>
          <div className="admin-metric">
            <span>Pendiente</span>
            <strong>{completion.pending}</strong>
            <p>Campos por revisar antes de publicar</p>
          </div>
          <div className="admin-actions-card">
            <button className="button secondary" type="button" onClick={logout}>
              <LogOut aria-hidden /> Salir
            </button>
            <button className="button primary" type="button" onClick={saveAll} disabled={saving}>
              <Save aria-hidden /> {saving ? "Guardando..." : "Guardar todo"}
            </button>
          </div>
        </div>

        {status ? <p className="admin-status admin-floating-status" role="status">{status}</p> : null}

        <div className="admin-shell">
          <aside className="admin-nav" aria-label="Áreas de administración">
            <div className="admin-nav-intro">
              <ShieldCheck aria-hidden />
              <div>
                <strong>Modo editor</strong>
                <p>Protegido por sesión. No indexado.</p>
              </div>
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className="admin-tab"
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon aria-hidden />
                  <span>
                    <strong>{tab.label}</strong>
                    <small>{tab.helper}</small>
                  </span>
                </button>
              );
            })}
          </aside>

          <div className="admin-main">
            {activeTab === "sitio" ? (
              <section className="admin-panel admin-editor-panel">
                <PanelTitle icon={<Settings aria-hidden />} title="Identidad, textos principales y colores" description="Estos campos controlan la marca, el mensaje principal, correos, redes y la paleta de la web." />
                <div className="admin-form-grid">
                  <TextField label="Nombre de la aplicación" value={site.appName} onChange={(value) => setSiteField("appName", value)} />
                  <TextField label="Dominio oficial" value={site.siteUrl} onChange={(value) => setSiteField("siteUrl", value)} />
                  <TextField label="Correo de soporte" value={site.supportEmail} onChange={(value) => setSiteField("supportEmail", value)} />
                  <TextField label="Correo de contacto" value={site.contactEmail} onChange={(value) => setSiteField("contactEmail", value)} />
                  <TextField label="Titular / organización" value={site.organizationName} onChange={(value) => setSiteField("organizationName", value)} />
                  <TextField label="Responsable legal" value={site.legalOwner} onChange={(value) => setSiteField("legalOwner", value)} />
                </div>
                <TextArea label="Frase principal" value={site.slogan} rows={3} onChange={(value) => setSiteField("slogan", value)} />
                <TextArea label="Descripción comercial" value={site.description} rows={5} onChange={(value) => setSiteField("description", value)} />
                <div className="admin-form-grid colors-grid">
                  {Object.entries(site.colors).map(([key, value]) => (
                    <label key={key} className="color-field">
                      <span>{key}</span>
                      <input type="color" value={value} onChange={(event) => setSiteField("colors", { ...site.colors, [key]: event.target.value })} />
                      <input value={value} onChange={(event) => setSiteField("colors", { ...site.colors, [key]: event.target.value })} />
                    </label>
                  ))}
                </div>
                <div className="admin-form-grid">
                  <TextField label="WhatsApp" value={site.social.whatsapp} onChange={(value) => setSiteField("social", { ...site.social, whatsapp: value })} />
                  <TextField label="Telegram" value={site.social.telegram} onChange={(value) => setSiteField("social", { ...site.social, telegram: value })} />
                  <TextField label="X / Twitter" value={site.social.x} onChange={(value) => setSiteField("social", { ...site.social, x: value })} />
                  <TextField label="YouTube" value={site.social.youtube} onChange={(value) => setSiteField("social", { ...site.social, youtube: value })} />
                </div>
                <div className="admin-subpanel">
                  <h3>Donaciones</h3>
                  <p>Configura enlaces reales antes de publicar. Si quedan pendientes, la portada enviará a la página explicativa.</p>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={site.donations.enabled}
                      onChange={(event) => setSiteField("donations", { ...site.donations, enabled: event.target.checked })}
                    />
                    Activar bloque de donaciones
                  </label>
                  <div className="admin-form-grid">
                    <TextField label="Enlace principal de donación" value={site.donations.primaryUrl} onChange={(value) => setSiteField("donations", { ...site.donations, primaryUrl: value })} />
                    <TextField label="PayPal" value={site.donations.paypalUrl} onChange={(value) => setSiteField("donations", { ...site.donations, paypalUrl: value })} />
                    <TextField label="Bizum / instrucciones" value={site.donations.bizumInfo} onChange={(value) => setSiteField("donations", { ...site.donations, bizumInfo: value })} />
                    <TextField label="Ko-fi" value={site.donations.kofiUrl} onChange={(value) => setSiteField("donations", { ...site.donations, kofiUrl: value })} />
                    <TextField label="Patreon" value={site.donations.patreonUrl} onChange={(value) => setSiteField("donations", { ...site.donations, patreonUrl: value })} />
                  </div>
                  <TextArea label="Texto explicativo de donaciones" value={site.donations.note} rows={4} onChange={(value) => setSiteField("donations", { ...site.donations, note: value })} />
                </div>
              </section>
            ) : null}

            {activeTab === "seo" ? (
              <section className="admin-panel admin-editor-panel">
                <PanelTitle icon={<Search aria-hidden />} title="SEO global" description="Edita el título general, metadescripción y palabras clave. Las páginas también tienen su SEO propio." />
                <TextField label="Título SEO principal" value={site.seo.title} onChange={(value) => setSiteField("seo", { ...site.seo, title: value })} />
                <TextArea label="Meta descripción principal" value={site.seo.description} rows={4} onChange={(value) => setSiteField("seo", { ...site.seo, description: value })} />
                <ListEditor label="Palabras clave principales" value={site.seo.keywords} onChange={(value) => setSiteField("seo", { ...site.seo, keywords: value })} />
              </section>
            ) : null}

            {activeTab === "descarga" ? (
              <section className="admin-panel admin-editor-panel">
                <PanelTitle icon={<Smartphone aria-hidden />} title="Descarga de Android y datos del APK" description="Sube el archivo oficial o cambia manualmente versión, tamaño, hash, permisos e instrucciones." />
                <form className="apk-upload-card" onSubmit={uploadApk}>
                  <TextField label="Versión" value={download.version} onChange={(value) => setDownloadField("version", value)} />
                  <TextField label="Fecha de actualización" value={download.date} onChange={(value) => setDownloadField("date", value)} />
                  <label>
                    Archivo APK
                    <input name="apk" type="file" accept=".apk,application/vnd.android.package-archive" />
                  </label>
                  <button className="button primary" type="submit" disabled={uploading}>
                    <FileUp aria-hidden /> {uploading ? "Subiendo..." : "Subir APK oficial"}
                  </button>
                </form>
                <div className="admin-form-grid">
                  <TextField label="Nombre mostrado" value={download.name} onChange={(value) => setDownloadField("name", value)} />
                  <TextField label="Ruta del icono" value={download.icon} onChange={(value) => setDownloadField("icon", value)} />
                  <TextField label="Ruta del APK" value={download.apkUrl} onChange={(value) => setDownloadField("apkUrl", value)} />
                  <TextField label="Enlace alternativo" value={download.alternativeUrl} onChange={(value) => setDownloadField("alternativeUrl", value)} />
                  <TextField label="Tamaño" value={download.size} onChange={(value) => setDownloadField("size", value)} />
                  <TextField label="Android mínimo" value={download.minimumAndroidVersion} onChange={(value) => setDownloadField("minimumAndroidVersion", value)} />
                </div>
                <TextArea label="Hash SHA-256" value={download.sha256} rows={3} onChange={(value) => setDownloadField("sha256", value)} />
                <ListEditor label="Permisos que explica la página de descarga" value={download.permissions} onChange={(value) => setDownloadField("permissions", value)} />
                <ListEditor label="Pasos de instalación" value={download.installSteps} onChange={(value) => setDownloadField("installSteps", value)} />
              </section>
            ) : null}

            {activeTab === "paginas" ? (
              <section className="admin-panel admin-editor-panel">
                <PanelTitle icon={<FileText aria-hidden />} title="Editor de páginas y opciones de la aplicación" description="Cada página puede tener texto principal, destacados, SEO y tantas secciones visuales como necesites." />
                <div className="admin-page-toolbar">
                  <label>
                    Página
                    <select value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>
                      {pages.map((page) => <option key={page.slug} value={page.slug}>{page.title} · /{page.slug}</option>)}
                    </select>
                  </label>
                  <button className="button secondary" type="button" onClick={addPage}><Plus aria-hidden /> Nueva</button>
                  <button className="button secondary" type="button" onClick={duplicatePage}><ListPlus aria-hidden /> Duplicar</button>
                  <button className="button secondary danger-button" type="button" onClick={removePage}><Trash2 aria-hidden /> Eliminar</button>
                  <a className="button secondary" href={`/${selectedPage.slug}`} target="_blank" rel="noreferrer"><Eye aria-hidden /> Ver</a>
                </div>
                <div className="admin-form-grid">
                  <TextField label="URL / slug" value={selectedPage.slug} onChange={(value) => updatePageField("slug", slugify(value) || selectedPage.slug)} />
                  <TextField label="Título" value={selectedPage.title} onChange={(value) => updatePageField("title", value)} />
                  <TextField label="Etiqueta superior" value={selectedPage.eyebrow || ""} onChange={(value) => updatePageField("eyebrow", value)} />
                  <TextField label="CTA opcional" value={selectedPage.cta || ""} onChange={(value) => updatePageField("cta", value)} />
                </div>
                <TextArea label="Descripción de la página" value={selectedPage.description} rows={4} onChange={(value) => updatePageField("description", value)} />
                <ListEditor label="Párrafos principales" value={selectedPage.body} onChange={(value) => updatePageField("body", value)} />
                <ListEditor label="Destacados / chips" value={selectedPage.highlights || []} onChange={(value) => updatePageField("highlights", value)} />
                <div className="admin-form-grid">
                  <TextField label="Título SEO de esta página" value={selectedPage.seoTitle} onChange={(value) => updatePageField("seoTitle", value)} />
                  <TextField label="Meta descripción de esta página" value={selectedPage.seoDescription} onChange={(value) => updatePageField("seoDescription", value)} />
                </div>
                <ListEditor label="Palabras clave de esta página" value={selectedPage.keywords || []} onChange={(value) => updatePageField("keywords", value)} />
                <div className="section-editor-header">
                  <h3>Secciones visuales</h3>
                  <button className="button secondary" type="button" onClick={addSection}><Plus aria-hidden /> Añadir sección</button>
                </div>
                <div className="section-editor-list">
                  {(selectedPage.sections || []).map((section, index) => (
                    <article className="section-editor-card" key={`${selectedPage.slug}-${index}`}>
                      <div className="section-editor-top">
                        <strong>Sección {index + 1}</strong>
                        <button className="icon-danger" type="button" onClick={() => removeSection(index)} aria-label="Eliminar sección">
                          <Trash2 aria-hidden />
                        </button>
                      </div>
                      <TextField label="Título de la sección" value={section.title} onChange={(value) => updateSection(index, { title: value })} />
                      <TextArea label="Explicación" value={section.body} rows={5} onChange={(value) => updateSection(index, { body: value })} />
                      <div className="admin-form-grid">
                        <TextField label="Imagen o captura" value={section.image || ""} onChange={(value) => updateSection(index, { image: value })} />
                        <TextField label="Texto alternativo" value={section.imageAlt || ""} onChange={(value) => updateSection(index, { imageAlt: value })} />
                      </div>
                      <ListEditor label="Qué permite hacer" value={section.items || []} onChange={(value) => updateSection(index, { items: value })} />
                      <ListEditor label="Cómo usarlo paso a paso" value={section.steps || []} onChange={(value) => updateSection(index, { steps: value })} />
                      <ListEditor label="Consejos para sacarle partido" value={section.tips || []} onChange={(value) => updateSection(index, { tips: value })} />
                      <TextArea label="Aviso o limitación" value={section.warning || ""} rows={3} onChange={(value) => updateSection(index, { warning: value })} />
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "actualizaciones" ? (
              <section className="admin-panel admin-editor-panel">
                <PanelTitle icon={<ListPlus aria-hidden />} title="Actualizaciones y changelog" description="Añade versiones con novedades, correcciones y enlace de descarga sin tocar archivos de código." />
                <button className="button secondary" type="button" onClick={addChangelogEntry}><Plus aria-hidden /> Añadir versión</button>
                <div className="changelog-editor-list">
                  {entries.map((entry, index) => (
                    <article className="section-editor-card" key={`${entry.version}-${index}`}>
                      <div className="section-editor-top">
                        <strong>{entry.version}</strong>
                        <button className="icon-danger" type="button" onClick={() => removeChangelog(index)} aria-label="Eliminar actualización">
                          <Trash2 aria-hidden />
                        </button>
                      </div>
                      <div className="admin-form-grid">
                        <TextField label="Versión" value={entry.version} onChange={(value) => updateChangelog(index, { version: value })} />
                        <TextField label="Fecha" value={entry.date} onChange={(value) => updateChangelog(index, { date: value })} />
                        <TextField label="Título" value={entry.title} onChange={(value) => updateChangelog(index, { title: value })} />
                        <TextField label="Enlace de descarga" value={entry.downloadUrl || ""} onChange={(value) => updateChangelog(index, { downloadUrl: value })} />
                      </div>
                      <ListEditor label="Novedades" value={entry.changes} onChange={(value) => updateChangelog(index, { changes: value })} />
                      <ListEditor label="Correcciones" value={entry.fixes || []} onChange={(value) => updateChangelog(index, { fixes: value })} />
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "multimedia" ? (
              <section className="admin-panel admin-editor-panel">
                <PanelTitle icon={<ImageIcon aria-hidden />} title="Imágenes, capturas y vídeo" description="Cambia las rutas de los recursos usados por la portada y la descarga. Las capturas de cada página se editan dentro del editor de páginas." />
                <div className="media-preview-grid">
                  <MediaPath title="Logo" value={site.logo} onChange={(value) => setSiteField("logo", value)} />
                  <MediaPath title="Imagen principal" value={site.heroImage} onChange={(value) => setSiteField("heroImage", value)} />
                  <MediaPath title="Poster de vídeo" value={site.videoPoster} onChange={(value) => setSiteField("videoPoster", value)} />
                  <MediaPath title="Vídeo de presentación" value={site.presentationVideo} onChange={(value) => setSiteField("presentationVideo", value)} />
                  <MediaPath title="Icono de descarga" value={download.icon} onChange={(value) => setDownloadField("icon", value)} />
                </div>
                <p className="admin-help">
                  Guarda imágenes en <code>/public/images</code>, capturas en <code>/public/screenshots</code>, vídeos en <code>/public/videos</code> y usa rutas como <code>/screenshots/app/home.jpg</code>.
                </p>
              </section>
            ) : null}

            {activeTab === "avanzado" ? (
              <section className="admin-panel admin-editor-panel">
                <PanelTitle icon={<ShieldCheck aria-hidden />} title="Modo avanzado JSON" description="Úsalo solo para copiar, revisar o pegar un bloque completo. El editor visual es más seguro para el día a día." />
                <div className="admin-page-toolbar">
                  <button className="button secondary" type="button" onClick={refreshAdvancedJson}>Actualizar JSON desde formularios</button>
                  <button className="button secondary" type="button" onClick={applyAdvancedJson}>Aplicar JSON al borrador</button>
                </div>
                <textarea className="advanced-json" value={advancedJson} onChange={(event) => setAdvancedJson(event.target.value)} rows={30} spellCheck={false} />
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

function PanelTitle({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="admin-panel-title">
      {icon}
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (value: string) => void }) {
  return (
    <label>
      {label}
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ListEditor({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return (
    <label>
      {label}
      <textarea value={listToText(value)} rows={6} onChange={(event) => onChange(textToList(event.target.value))} />
      <small className="field-help">Una línea por elemento.</small>
    </label>
  );
}

function MediaPath({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value);
  return (
    <article className="media-path-card">
      <div className="media-preview">
        {isImage ? <img src={value} alt="" /> : <VideoLabel />}
      </div>
      <TextField label={title} value={value} onChange={onChange} />
    </article>
  );
}

function VideoLabel() {
  return (
    <div className="video-label">
      <Smartphone aria-hidden />
      <span>Vídeo o archivo</span>
    </div>
  );
}
