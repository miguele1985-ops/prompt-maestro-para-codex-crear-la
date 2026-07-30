import adminOverrides from "./admin-overrides.json";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

const baseSiteConfig = {
  appName: "Modo Crisis Survival",
  slogan: "Tu teléfono puede quedarse sin cobertura. Tu preparación no debería desaparecer con ella.",
  description:
    "Aplicación de supervivencia offline, preparación familiar, mapas MBTiles, guías, botón SOS, calculadoras, inventarios, IA local opcional y herramientas para emergencias.",
  siteUrl: "https://dominio-pendiente.example",
  apkUrl: "/downloads/modo-crisis-survival.apk",
  alternativeApkUrl: "Configurar antes de publicar",
  currentVersion: "v4.0 Ultra · confirmar APK final",
  apkSize: "Pendiente de añadir",
  apkSha256: "Pendiente de añadir",
  lastUpdated: "Pendiente de añadir",
  minimumAndroidVersion: "Android 8 o superior",
  supportEmail: "Añadir correo de soporte",
  contactEmail: "Añadir correo de contacto",
  organizationName: "Configurar titular del sitio",
  legalOwner: "Configurar antes de publicar",
  logo: "/brand/logo.jpg",
  heroImage: "/screenshots/app/home.jpg",
  videoPoster: "/images/video-poster-placeholder.svg",
  presentationVideo: "/videos/README.md",
  colors: {
    background: "#090a08",
    surface: "#171817",
    primary: "#ff7a18",
    militaryGreen: "#668f1f",
    warning: "#f5b638",
    danger: "#c52228",
    text: "#f5fff8",
  },
  social: {
    whatsapp: "",
    telegram: "",
    x: "",
    youtube: "",
  },
  donations: {
    enabled: true,
    primaryUrl: "Configurar antes de publicar",
    paypalUrl: "Configurar antes de publicar",
    bizumInfo: "Configurar antes de publicar",
    kofiUrl: "Configurar antes de publicar",
    patreonUrl: "Configurar antes de publicar",
    note: "Las donaciones son voluntarias y ayudan a mantener el desarrollo, los recursos, las actualizaciones y el soporte del proyecto. No desbloquean funciones adicionales.",
  },
  seo: {
    title: "Modo Crisis Survival: aplicación de supervivencia offline y emergencias",
    description:
      "Descubre Modo Crisis Survival, la aplicación de supervivencia offline con mapas, guías, botón SOS, planes familiares, alertas, inventarios, calculadoras y más de 300 artículos para emergencias.",
    keywords: [
      "aplicación de supervivencia offline",
      "app de supervivencia",
      "aplicación para emergencias",
      "aplicación sin Internet",
      "guías de supervivencia",
      "mapas offline de España",
      "app para apagones",
      "preparación familiar ante emergencias",
      "mapas MBTiles",
      "app de emergencias para Android",
    ],
  },
};

const siteOverrides = adminOverrides.site as Partial<typeof baseSiteConfig>;

export const siteConfig = {
  ...baseSiteConfig,
  ...siteOverrides,
  siteUrl: configuredSiteUrl || siteOverrides.siteUrl || baseSiteConfig.siteUrl,
  colors: {
    ...baseSiteConfig.colors,
    ...siteOverrides.colors,
  },
  social: {
    ...baseSiteConfig.social,
    ...siteOverrides.social,
  },
  donations: {
    ...baseSiteConfig.donations,
    ...siteOverrides.donations,
  },
  seo: {
    ...baseSiteConfig.seo,
    ...siteOverrides.seo,
    keywords: siteOverrides.seo?.keywords?.length ? siteOverrides.seo.keywords : baseSiteConfig.seo.keywords,
  },
};

export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Guías", href: "/guias-supervivencia" },
  { label: "Herramientas", href: "/herramientas-supervivencia" },
  { label: "Recursos", href: "/recursos-avanzados" },
  { label: "Internet", href: "/con-uso-de-internet" },
  { label: "Aprendizaje", href: "/aprendizaje-supervivencia" },
  { label: "IA y enciclopedia", href: "/ia-enciclopedia" },
  { label: "Donar", href: "/donaciones" },
];
