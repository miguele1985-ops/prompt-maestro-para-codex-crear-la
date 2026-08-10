import adminOverrides from "./admin-overrides.json";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

const baseSiteConfig = {
  appName: "Modo Crisis Survival",
  slogan: "Tu tel\u00e9fono puede quedarse sin cobertura. Tu preparaci\u00f3n no deber\u00eda desaparecer con ella.",
  description:
    "Aplicaci\u00f3n de supervivencia offline, preparaci\u00f3n familiar, mapas MBTiles, gu\u00edas, bot\u00f3n SOS, calculadoras, inventarios, IA local opcional y herramientas para emergencias.",
  siteUrl: "https://dominio-pendiente.example",
  apkUrl: "/downloads/modo-crisis-survival.apk",
  alternativeApkUrl: "Configurar antes de publicar",
  currentVersion: "V 1.0",
  apkSize: "2 GB",
  apkSha256: "Pendiente de a\u00f1adir",
  lastUpdated: "Pendiente de a\u00f1adir",
  minimumAndroidVersion: "Android 8 o superior",
  supportEmail: "migueleclip@gmail.com",
  contactEmail: "migueleclip@gmail.com",
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
    note: "Las donaciones son voluntarias y ayudan a mantener el desarrollo, los recursos, las actualizaciones y el soporte del proyecto. La app sigue siendo completa para todos.",
  },
  seo: {
    title: "Modo Crisis Survival: aplicaciÃƒÆ’Ã‚Â³n de supervivencia offline y emergencias",
    description:
    "Aplicaci\u00f3n de supervivencia offline, preparaci\u00f3n familiar, mapas MBTiles, gu\u00edas, bot\u00f3n SOS, calculadoras, inventarios, IA local opcional y herramientas para emergencias.",
    keywords: [
      "aplicaciÃƒÆ’Ã‚Â³n de supervivencia offline",
      "app de supervivencia",
      "aplicaciÃƒÆ’Ã‚Â³n para emergencias",
      "aplicaciÃƒÆ’Ã‚Â³n sin Internet",
      "guÃƒÆ’Ã‚Â­as de supervivencia",
      "mapas offline de EspaÃƒÆ’Ã‚Â±a",
      "app para apagones",
      "preparaciÃƒÆ’Ã‚Â³n familiar ante emergencias",
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
  { label: "GuÃƒÆ’Ã‚Â­as", href: "/guias-supervivencia" },
  { label: "Blog", href: "/blog" },
  { label: "Herramientas", href: "/herramientas-supervivencia" },
  { label: "Recursos", href: "/recursos-avanzados" },
  { label: "Internet", href: "/con-uso-de-internet" },
  { label: "Aprendizaje", href: "/aprendizaje-supervivencia" },
  { label: "IA y enciclopedia", href: "/ia-enciclopedia" },
  { label: "Donar", href: "/donaciones" },
];
