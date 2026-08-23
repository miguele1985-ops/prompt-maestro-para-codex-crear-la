"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  ListPlus,
  LogOut,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { AdminLicensingPanel } from "@/components/AdminLicensingPanel";
import { changelog, downloadInfo } from "@/content/downloads";
import { allContentPages } from "@/content/pages";
import { siteConfig } from "@/content/site-config";
import type { CounterBreakdown, SiteStats } from "@/lib/counters";
import type { BugReport } from "@/lib/bug-reports";
import type { ChangelogEntry, ContentPage } from "@/types/content";

type AdminTab = "constructor" | "sitio" | "seo" | "descarga" | "paginas" | "actualizaciones" | "multimedia" | "licencias" | "avanzado";

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
    amount5Url: string;
    amount10Url: string;
    amount15Url: string;
    customAmountUrl: string;
    paypalHostedButtonId: string;
    qrImage: string;
    donatedEuros: string;
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
  latestVersion: string;
  latestBuild: string;
  minimumSupportedVersion: string;
  updateTitle: string;
  updateMessage: string;
  releaseNotesUrl: string;
  enabled: boolean;
  force: boolean;
  date: string;
  size: string;
  minimumAndroidVersion: string;
  sha256: string;
  permissions: string[];
  installSteps: string[];
  resources: DownloadResource[];
};

type DownloadResource = {
  label: string;
  url: string;
  size: string;
  description: string;
};

type AdminData = {
  site: Partial<SiteEditor>;
  download: Partial<DownloadEditor>;
  changelog: ChangelogEntry[];
  pages: ContentPage[];
};

type PageSection = NonNullable<ContentPage["sections"]>[number];

const adminTabs: Array<{ id: AdminTab; label: string; helper: string; icon: typeof Settings }> = [
  { id: "constructor", label: "Constructor", helper: "Vista tipo WordPress para editar lo importante", icon: Settings },
  { id: "sitio", label: "Portada y marca", helper: "Nombre, logo, textos, botones y colores", icon: Settings },
  { id: "paginas", label: "Páginas", helper: "Textos, secciones, imágenes, botones y avisos", icon: FileText },
  { id: "multimedia", label: "Imágenes", helper: "Logo, capturas, vídeos y recursos visuales", icon: ImageIcon },
  { id: "descarga", label: "Descargas", helper: "URL externa del APK, version, tamano e instalacion", icon: Download },
  { id: "licencias", label: "Licencias", helper: "Modo gratis, mensajes y codigos", icon: ShieldCheck },
  { id: "actualizaciones", label: "Actualizaciones", helper: "Historial de versiones editable", icon: ListPlus },
  { id: "seo", label: "SEO", helper: "Google, metadatos y palabras clave", icon: Search },
  { id: "avanzado", label: "Avanzado", helper: "JSON completo para ajustes finos", icon: ShieldCheck },
];

const emptyStats: SiteStats = {
  configured: false,
  visits: { today: 0, week: 0, month: 0, total: 0 },
  downloads: { today: 0, week: 0, month: 0, total: 0 },
  donations: { today: 0, week: 0, month: 0, total: 0 },
  message: "Cargando contadores reales...",
};

const emptySection: PageSection = {
  title: "Nueva opción",
  body: "Explica qué hace esta opción, cuándo se usa y por qué aporta valor.",
  items: ["Función pendiente de completar"],
  steps: ["Abrir la sección en la aplicación", "Revisar las opciones disponibles"],
  tips: ["Añadir consejo útil"],
  warning: "",
  image: "/screenshots/placeholder-screenshot.svg",
  imageAlt: "Captura pendiente de sustituir",
  buttonLabel: "",
  buttonHref: "",
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
  ctaHref: "/descargar",
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
  const [activeTab, setActiveTab] = useState<AdminTab>("constructor");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
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
  const [realStats, setRealStats] = useState<SiteStats>(emptyStats);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [reportsStatus, setReportsStatus] = useState("Cargando reportes de fallos...");
  const [download, setDownload] = useState<DownloadEditor>({
    ...downloadInfo,
    latestVersion: "1.0.0",
    latestBuild: "1",
    minimumSupportedVersion: "1.0.0",
    updateTitle: "Actualizacion disponible",
    updateMessage: "Hay una nueva version de Modo Crisis Survival disponible. Descargala desde la web oficial para mantener la app actualizada.",
    releaseNotesUrl: "/actualizaciones",
    enabled: true,
    force: false,
    permissions: [...downloadInfo.permissions],
    installSteps: [...downloadInfo.installSteps],
    resources: [...downloadInfo.resources],
  });
  const [entries, setEntries] = useState<ChangelogEntry[]>(changelog);
  const [pages, setPages] = useState<ContentPage[]>(allContentPages);
  const [selectedSlug, setSelectedSlug] = useState(allContentPages[0]?.slug || emptyPage.slug);
  const [advancedJson, setAdvancedJson] = useState(pretty({ site, download, changelog: entries, pages }));

  const selectedPage = useMemo(
    () => pages.find((page) => page.slug === selectedSlug) || pages[0] || emptyPage,
    [pages, selectedSlug],
  );

  const mediaAssets = useMemo(() => {
    const items = [
      { label: "Logo", value: site.logo, group: "Marca" },
      { label: "Imagen principal", value: site.heroImage, group: "Portada" },
      { label: "Poster de video", value: site.videoPoster, group: "Video" },
      { label: "QR donaciones", value: site.donations.qrImage, group: "Donaciones" },
      { label: "Icono de descarga", value: download.icon, group: "Descarga" },
      ...pages.flatMap((page) =>
        (page.sections || [])
          .filter((section) => section.image)
          .map((section) => ({
            label: section.title,
            value: section.image || "",
            group: page.title,
          })),
      ),
    ];

    return items.filter((item, index, source) => item.value && source.findIndex((candidate) => candidate.value === item.value) === index);
  }, [download.icon, pages, site.donations.qrImage, site.heroImage, site.logo, site.videoPoster]);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      const response = await fetch("/api/admin/session", { cache: "no-store" }).catch(() => null);
      if (!active) return;
      if (!response?.ok) {
        window.location.href = `/admin-login?next=${encodeURIComponent("/administracion")}`;
        return;
      }
      fetch("/api/stats", { cache: "no-store" })
        .then(async (statsResponse) => {
          const text = await statsResponse.text();
          const stats = text ? (JSON.parse(text) as SiteStats) : null;
          if (!statsResponse.ok || !stats) {
            throw new Error(stats?.message || text || `Error ${statsResponse.status} al leer contadores.`);
          }
          return stats;
        })
        .then((stats: SiteStats) => setRealStats(stats))
        .catch((error) =>
          setRealStats({
            configured: false,
            visits: { today: 0, week: 0, month: 0, total: 0 },
            downloads: { today: 0, week: 0, month: 0, total: 0 },
            donations: { today: 0, week: 0, month: 0, total: 0 },
            message:
              error instanceof Error
                ? error.message
                : "No se pudieron cargar los contadores reales. Revisa variables y permisos de Cloudflare KV.",
          }),
        );
      fetch("/api/admin/reports", { cache: "no-store" })
        .then(async (reportsResponse) => {
          const result = await reportsResponse.json().catch(() => ({}));
          if (!reportsResponse.ok || !result.ok) {
            throw new Error(result.message || "No se pudieron cargar los reportes de fallos.");
          }
          setBugReports(Array.isArray(result.reports) ? result.reports : []);
          setReportsStatus(result.reports?.length ? "Reportes cargados." : "No hay reportes de fallos guardados.");
        })
        .catch((error) => {
          setBugReports([]);
          setReportsStatus(error instanceof Error ? error.message : "No se pudieron cargar los reportes de fallos.");
        });      fetch("/api/admin/content", { cache: "no-store" })
        .then((contentResponse) => contentResponse.json())
        .then((result: { ok?: boolean; data?: AdminData | null; message?: string }) => {
          if (!result.ok || !result.data) return;
          if (result.data.site) setSite((current) => ({ ...current, ...result.data?.site }));
          if (result.data.download) setDownload((current) => ({ ...current, ...result.data?.download }));
          if (Array.isArray(result.data.changelog)) setEntries(result.data.changelog);
          if (Array.isArray(result.data.pages) && result.data.pages.length) {
            setPages(result.data.pages);
            setSelectedSlug(result.data.pages[0].slug);
          }
          setStatus(result.message || "Contenido editable cargado desde Cloudflare KV.");
        })
        .catch(() => null);
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

  function updateDownloadResource(index: number, patch: Partial<DownloadResource>) {
    setDownload((current) => ({
      ...current,
      resources: current.resources.map((resource, itemIndex) => (itemIndex === index ? { ...resource, ...patch } : resource)),
    }));
  }

  function addDownloadResource() {
    setDownload((current) => ({
      ...current,
      resources: [
        ...current.resources,
        {
          label: "Nuevo recurso descargable",
          url: "Configurar antes de publicar",
          size: "Pendiente",
          description: "Explica que archivo es, para que sirve y como se usa en la app.",
        },
      ],
    }));
  }

  function removeDownloadResource(index: number) {
    setDownload((current) => ({
      ...current,
      resources: current.resources.filter((_, itemIndex) => itemIndex !== index),
    }));
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

  function updatePageSectionMedia(pageSlug: string, index: number, patch: Partial<PageSection>) {
    setPages((current) =>
      current.map((page) => {
        if (page.slug !== pageSlug) return page;
        const sections = [...(page.sections || [])];
        sections[index] = { ...sections[index], ...patch };
        return { ...page, sections };
      }),
    );
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
    setStatus("JSON avanzado aplicado al borrador. Pulsa Guardar cambios para guardarlo en Cloudflare KV.");
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
    const result = await response.json().catch(() => ({ message: "Respuesta no valida." }));
    setSaving(false);
    setStatus(result.message || (response.ok ? "Cambios guardados." : "No se pudo guardar."));
  }

  function showApkUrlHelp() {
    setStatus("Cloudflare Pages no puede guardar APK grandes desde el panel. Sube el archivo a Cloudflare R2 u otro alojamiento, pega aqui la URL publica y pulsa Guardar cambios.");
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
      <section className="page-hero admin-hero admin-workspace-hero admin-cms-hero">
        <p className="eyebrow">Administración protegida</p>
        <h1>Gestiona Supervivencia Offline sin tocar código</h1>
        <p>
          Modifica textos, páginas, capturas, SEO, colores, APK y actualizaciones desde formularios claros. Guarda cuando lo tengas listo y la web leerá estos cambios desde el archivo central de administración.
        </p>
      </section>

      <section className="content-band admin-dashboard admin-cms-dashboard">
        <div className="admin-cms-header">
          <div>
            <p className="eyebrow">Escritorio</p>
            <h2>Panel de administración</h2>
            <p>
              Gestiona la web como en un panel tipo WordPress: cambia portada, páginas, fotos, botones, colores,
              descargas, SEO y actualizaciones desde formularios sencillos.
            </p>
          </div>
          <button className="button primary" type="button" onClick={saveAll} disabled={saving}>
            <Save aria-hidden /> {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        <div className="admin-quick-grid" aria-label="Accesos rápidos del panel">
          <button type="button" onClick={() => setActiveTab("sitio")}>
            <Settings aria-hidden />
            <strong>Portada</strong>
            <span>Nombre, frase principal, botones, donaciones y colores.</span>
          </button>
          <button type="button" onClick={() => setActiveTab("paginas")}>
            <FileText aria-hidden />
            <strong>Páginas</strong>
            <span>Textos, secciones, imágenes, avisos y enlaces internos.</span>
          </button>
          <button type="button" onClick={() => setActiveTab("multimedia")}>
            <ImageIcon aria-hidden />
            <strong>Fotos y vídeos</strong>
            <span>Logo, capturas de la app, portada y recursos visuales.</span>
          </button>
          <button type="button" onClick={() => setActiveTab("descarga")}>
            <Download aria-hidden />
            <strong>Descargas</strong>
            <span>URL externa del APK, version, tamano, hash e instalacion.</span>
          </button>
          <button type="button" onClick={() => setActiveTab("sitio")}>
            <Settings aria-hidden />
            <strong>Colores</strong>
            <span>Fondo, verde, naranja, avisos, peligro y texto.</span>
          </button>
          <button type="button" onClick={() => setActiveTab("seo")}>
            <Search aria-hidden />
            <strong>SEO</strong>
            <span>Títulos, descripción para Google y palabras clave.</span>
          </button>
        </div>

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
          <div className="admin-metric admin-counter-card">
            <span><TrendingUp aria-hidden /> Visitas web</span>
            <CounterBreakdownView stats={realStats.visits} />
            <p>{realStats.configured ? "Registradas automaticamente" : "KV sin configurar"}</p>
          </div>
          <div className="admin-metric admin-counter-card">
            <span><Download aria-hidden /> Descargas</span>
            <CounterBreakdownView stats={realStats.downloads} />
            <p>Enlace oficial del APK</p>
          </div>
          <div className="admin-metric admin-counter-card">
            <span>Clics en donar</span>
            <CounterBreakdownView stats={realStats.donations} />
            <p>Botones de donacion</p>
          </div>
          <div className="admin-metric admin-counter-card">
            <span>Euros donados</span>
            <strong>{formatEuros(site.donations.donatedEuros)}</strong>
            <p>Contador manual editable</p>
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
        {!realStats.configured ? (
          <p className="admin-status admin-floating-status" role="status">
            {realStats.message}
          </p>
        ) : null}


        <section className="admin-reports-panel" aria-labelledby="admin-reports-title">
          <div className="admin-reports-heading">
            <div>
              <p className="eyebrow">Mensajes</p>
              <h2 id="admin-reports-title">Reportes de fallos</h2>
              <p>Mensajes enviados desde las páginas de descarga y centro de descargas.</p>
            </div>
            <strong>{bugReports.length.toLocaleString("es-ES")}</strong>
          </div>
          {bugReports.length ? (
            <div className="admin-reports-list">
              {bugReports.slice(0, 20).map((report) => (
                <article className="admin-report-card" key={report.id}>
                  <div>
                    <strong>{report.source}</strong>
                    <time dateTime={report.createdAt}>{formatReportDate(report.createdAt)}</time>
                  </div>
                  <p>{report.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-status admin-floating-status">{reportsStatus}</p>
          )}
        </section>
        <div className="admin-shell">
          <aside className="admin-nav" aria-label="Áreas de administración">
            <div className="admin-nav-intro">
              <ShieldCheck aria-hidden />
              <div>
                <strong>Modo editor</strong>
                <p>Protegido por sesión. No indexado.</p>
              </div>
            </div>
            {adminTabs.map((tab) => {
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
            {activeTab === "constructor" ? (
              <section className="admin-panel admin-editor-panel admin-builder-panel">
                <PanelTitle
                  icon={<Settings aria-hidden />}
                  title="Constructor visual"
                  description="Edita lo mas importante de la web desde una pantalla sencilla: portada, botones, fotos, donaciones, recursos descargables y paginas."
                />
                <div className="builder-layout">
                  <div className="builder-column">
                    <article className="builder-card">
                      <h3>Portada y marca</h3>
                      <div className="admin-form-grid">
                        <TextField label="Nombre de la app" value={site.appName} onChange={(value) => setSiteField("appName", value)} />
                        <TextField label="Logo" value={site.logo} onChange={(value) => setSiteField("logo", value)} />
                        <TextField label="Imagen principal" value={site.heroImage} onChange={(value) => setSiteField("heroImage", value)} />
                      </div>
                      <TextArea label="Frase principal" value={site.slogan} rows={3} onChange={(value) => setSiteField("slogan", value)} />
                      <TextArea label="Descripcion corta de portada" value={site.description} rows={4} onChange={(value) => setSiteField("description", value)} />
                    </article>

                    <article className="builder-card">
                      <h3>Botones y descargas</h3>
                      <div className="admin-form-grid">
                        <TextField label="Enlace APK" value={download.apkUrl} onChange={(value) => setDownloadField("apkUrl", value)} />
                  <TextField label="Version" value={download.version} onChange={(value) => setDownloadField("version", value)} />
                  <TextField label="Build para aviso en app" value={download.latestBuild} onChange={(value) => setDownloadField("latestBuild", value)} />
                </div>
              </article>

                    <article className="builder-card">
                      <h3>Donaciones</h3>
                      <div className="admin-form-grid">
                        <TextField label="Boton 5 euros" value={site.donations.amount5Url} onChange={(value) => setSiteField("donations", { ...site.donations, amount5Url: value })} />
                        <TextField label="Boton 10 euros" value={site.donations.amount10Url} onChange={(value) => setSiteField("donations", { ...site.donations, amount10Url: value })} />
                        <TextField label="Boton 15 euros" value={site.donations.amount15Url} onChange={(value) => setSiteField("donations", { ...site.donations, amount15Url: value })} />
                        <TextField label="Otra cantidad" value={site.donations.customAmountUrl} onChange={(value) => setSiteField("donations", { ...site.donations, customAmountUrl: value })} />
                        <TextField label="PayPal hosted button ID" value={site.donations.paypalHostedButtonId} onChange={(value) => setSiteField("donations", { ...site.donations, paypalHostedButtonId: value })} />
                        <TextField label="Imagen QR" value={site.donations.qrImage} onChange={(value) => setSiteField("donations", { ...site.donations, qrImage: value })} />
                        <TextField label="Euros donados manualmente" value={site.donations.donatedEuros} onChange={(value) => setSiteField("donations", { ...site.donations, donatedEuros: value })} />
                      </div>
                      <TextArea label="Explicacion corta para donar" value={site.donations.note} rows={4} onChange={(value) => setSiteField("donations", { ...site.donations, note: value })} />
                    </article>
                  </div>

                  <div className="builder-column">
                    <article className="builder-card">
                      <h3>Paginas</h3>
                      <div className="builder-page-grid">
                        {pages.map((page) => (
                          <button
                            className={selectedSlug === page.slug ? "builder-page-card active" : "builder-page-card"}
                            key={page.slug}
                            type="button"
                            onClick={() => {
                              setSelectedSlug(page.slug);
                              setActiveTab("paginas");
                            }}
                          >
                            <strong>{page.title}</strong>
                            <span>/{page.slug}</span>
                          </button>
                        ))}
                      </div>
                      <button className="button secondary" type="button" onClick={addPage}>
                        <Plus aria-hidden /> Crear pagina nueva
                      </button>
                    </article>

                    <article className="builder-card">
                      <h3>Recursos descargables</h3>
                      <div className="builder-resource-stack">
                        {download.resources.map((resource, index) => (
                          <div className="builder-resource-row" key={`${resource.label}-${index}`}>
                            <TextField label="Nombre" value={resource.label} onChange={(value) => updateDownloadResource(index, { label: value })} />
                            <TextField label="URL" value={resource.url} onChange={(value) => updateDownloadResource(index, { url: value })} />
                            <TextField label="Tamano" value={resource.size} onChange={(value) => updateDownloadResource(index, { size: value })} />
                            <TextArea label="Descripcion" value={resource.description} rows={3} onChange={(value) => updateDownloadResource(index, { description: value })} />
                            <button className="button secondary danger-button" type="button" onClick={() => removeDownloadResource(index)}>
                              <Trash2 aria-hidden /> Quitar recurso
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="button secondary" type="button" onClick={addDownloadResource}>
                        <Plus aria-hidden /> Anadir recurso
                      </button>
                    </article>

                    <article className="builder-card">
                      <h3>Biblioteca de imagenes usadas</h3>
                      <div className="builder-media-grid">
                        {mediaAssets.map((asset) => (
                          <div className="builder-media-card" key={asset.value}>
                            <span>{asset.group}</span>
                            <strong>{asset.label}</strong>
                            {/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(asset.value) ? <img src={asset.value} alt="" /> : null}
                            <code>{asset.value}</code>
                          </div>
                        ))}
                      </div>
                      <button className="button secondary" type="button" onClick={() => setActiveTab("multimedia")}>
                        Editar rutas de imagenes
                      </button>
                    </article>
                  </div>
                </div>
              </section>
            ) : null}

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
                <div className="admin-subpanel">
                  <h3>Contadores reales</h3>
                  <p>
                    Las visitas y descargas se registran automaticamente en Cloudflare KV. Los clics en donar se suman cuando un visitante pulsa un boton de donacion.
                  </p>
                </div>
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
                    <TextField label="Euros donados manualmente" value={site.donations.donatedEuros} onChange={(value) => setSiteField("donations", { ...site.donations, donatedEuros: value })} />
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
                <PanelTitle icon={<Smartphone aria-hidden />} title="Descarga de Android por URL externa" description="Cloudflare Pages no guarda APK grandes desde el panel. Sube el APK a Cloudflare R2, a tu dominio de descargas o a otro alojamiento, pega aqui la URL publica y guarda los cambios." />
                <div className="apk-upload-card apk-url-card">
                  <TextField label="Version" value={download.version} onChange={(value) => setDownloadField("version", value)} />
                  <TextField label="Fecha de actualizacion" value={download.date} onChange={(value) => setDownloadField("date", value)} />
                  <TextField label="URL oficial del APK" value={download.apkUrl} onChange={(value) => setDownloadField("apkUrl", value)} />
                  <TextField label="Enlace alternativo" value={download.alternativeUrl} onChange={(value) => setDownloadField("alternativeUrl", value)} />
                  <TextField label="Tamano del APK" value={download.size} onChange={(value) => setDownloadField("size", value)} />
                  <TextField label="Hash SHA-256 opcional" value={download.sha256} onChange={(value) => setDownloadField("sha256", value)} />
                  <div className="admin-help-card">
                    <strong>Como publicar una APK grande</strong>
                    <p>Sube el archivo APK a Cloudflare R2, a descargas.modocrisissurvival.com o al alojamiento que uses para archivos grandes. Copia la URL publica directa, pegala aqui como URL oficial del APK y pulsa Guardar cambios.</p>
                    <p>La web y el aviso de actualizacion de la app usaran este enlace para enviar al usuario a la descarga correcta.</p>
                  </div>
                  <div className="admin-inline-actions">
                    {download.apkUrl ? (
                      <a className="button secondary" href={download.apkUrl} target="_blank" rel="noreferrer">
                        <Eye aria-hidden /> Probar enlace del APK
                      </a>
                    ) : null}
                    <button className="button secondary" type="button" onClick={showApkUrlHelp}>
                      <Download aria-hidden /> Ver instrucciones
                    </button>
                  </div>
                </div>
                <div className="admin-form-grid">
                  <TextField label="Nombre mostrado" value={download.name} onChange={(value) => setDownloadField("name", value)} />
                  <TextField label="Ruta del icono" value={download.icon} onChange={(value) => setDownloadField("icon", value)} />
                  <TextField label="Android minimo" value={download.minimumAndroidVersion} onChange={(value) => setDownloadField("minimumAndroidVersion", value)} />
                </div>
                <div className="admin-subpanel">
                  <h3>Aviso de actualizacion dentro de la app</h3>
                  <p>
                    La app consulta /app-version.json. Cuando publiques una APK nueva en Cloudflare R2 u otro alojamiento, sube aqui la version o build y usa la misma URL oficial del APK.
                  </p>
                  <div className="admin-form-grid">
                    <TextField label="Ultima version disponible" value={download.latestVersion} onChange={(value) => setDownloadField("latestVersion", value)} />
                    <TextField label="Build disponible" value={download.latestBuild} onChange={(value) => setDownloadField("latestBuild", value)} />
                    <TextField label="Version minima soportada" value={download.minimumSupportedVersion} onChange={(value) => setDownloadField("minimumSupportedVersion", value)} />
                    <TextField label="URL de descarga para la app" value={download.apkUrl} onChange={(value) => setDownloadField("apkUrl", value)} />
                    <TextField label="URL de notas de version" value={download.releaseNotesUrl} onChange={(value) => setDownloadField("releaseNotesUrl", value)} />
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={download.enabled}
                        onChange={(event) => setDownloadField("enabled", event.target.checked)}
                      />
                      Aviso activado
                    </label>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={download.force}
                        onChange={(event) => setDownloadField("force", event.target.checked)}
                      />
                      Forzar actualizacion
                    </label>
                  </div>
                  <TextField label="Titulo del aviso" value={download.updateTitle} onChange={(value) => setDownloadField("updateTitle", value)} />
                  <TextArea label="Mensaje que vera el usuario en la app" value={download.updateMessage} rows={4} onChange={(value) => setDownloadField("updateMessage", value)} />
                  <div className="admin-help-card">
                    <strong>Ejemplo para una APK nueva</strong>
                    <code>{`{"enabled":true,"latestVersion":"1.0.2","latestBuild":3,"downloadUrl":"https://supervivenciaoffline.com/descargar","force":false}`}</code>
                  </div>
                </div>
                <div className="admin-subpanel">
                  <h3>Recursos grandes descargables</h3>
                  <p>Mapas MBTiles, modelos de IA local u otros archivos grandes que se descargan desde el centro de descargas.</p>
                  <div className="builder-resource-stack">
                    {download.resources.map((resource, index) => (
                      <article className="builder-resource-row" key={`${resource.label}-${index}`}>
                        <TextField label="Nombre del recurso" value={resource.label} onChange={(value) => updateDownloadResource(index, { label: value })} />
                        <TextField label="URL de descarga" value={resource.url} onChange={(value) => updateDownloadResource(index, { url: value })} />
                        <TextField label="Tamano" value={resource.size} onChange={(value) => updateDownloadResource(index, { size: value })} />
                        <TextArea label="Descripcion" value={resource.description} rows={3} onChange={(value) => updateDownloadResource(index, { description: value })} />
                        <button className="button secondary danger-button" type="button" onClick={() => removeDownloadResource(index)}>
                          <Trash2 aria-hidden /> Quitar recurso
                        </button>
                      </article>
                    ))}
                  </div>
                  <button className="button secondary" type="button" onClick={addDownloadResource}>
                    <Plus aria-hidden /> Anadir recurso descargable
                  </button>
                </div>
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
                  <TextField label="Enlace del CTA" value={selectedPage.ctaHref || ""} onChange={(value) => updatePageField("ctaHref", value)} />
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
                      <div className="admin-form-grid">
                        <TextField label="Texto del boton" value={section.buttonLabel || ""} onChange={(value) => updateSection(index, { buttonLabel: value })} />
                        <TextField label="Enlace del boton" value={section.buttonHref || ""} onChange={(value) => updateSection(index, { buttonHref: value })} />
                      </div>
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
                <div className="admin-subpanel">
                  <h3>Fotos y capturas de todas las paginas</h3>
                  <p className="admin-help">Cambia cualquier imagen de una seccion sin entrar pagina por pagina.</p>
                  <div className="admin-media-section-list">
                    {pages.flatMap((page) =>
                      (page.sections || []).map((section, index) => (
                        <article className="media-section-card" key={`${page.slug}-${index}`}>
                          <div>
                            <span className="admin-editor-kicker">/{page.slug}</span>
                            <strong>{section.title}</strong>
                            <small>{page.title}</small>
                          </div>
                          <MediaPath title="Imagen o captura" value={section.image || ""} onChange={(value) => updatePageSectionMedia(page.slug, index, { image: value })} />
                          <TextField label="Texto alternativo" value={section.imageAlt || ""} onChange={(value) => updatePageSectionMedia(page.slug, index, { imageAlt: value })} />
                        </article>
                      )),
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === "licencias" ? <AdminLicensingPanel /> : null}

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

function CounterBreakdownView({ stats }: { stats: CounterBreakdown }) {
  const items = [
    { label: "Hoy", value: stats.today },
    { label: "Semana", value: stats.week },
    { label: "Mes", value: stats.month },
    { label: "Total", value: stats.total },
  ];

  return (
    <dl className="admin-counter-breakdown">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value.toLocaleString("es-ES")}</dd>
        </div>
      ))}
    </dl>
  );
}

function formatEuros(value: string) {
  const normalized = String(value || "0")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  const amount = Number.parseFloat(normalized);

  if (!Number.isFinite(amount)) return "0 €";

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}


function formatReportDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return date.toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  });
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
