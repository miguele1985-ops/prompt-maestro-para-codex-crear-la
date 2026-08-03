import adminOverrides from "./admin-overrides.json";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

const baseSiteConfig = {
  appName: "Modo Crisis Survival",
  slogan: "Tu telÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©fono puede quedarse sin cobertura. Tu preparaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n no deberÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a desaparecer con ella.",
  description:
    "AplicaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de supervivencia offline, preparaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n familiar, mapas MBTiles, guÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­as, botÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n SOS, calculadoras, inventarios, IA local opcional y herramientas para emergencias.",
  siteUrl: "https://dominio-pendiente.example",
  apkUrl: "/downloads/modo-crisis-survival.apk",
  alternativeApkUrl: "Configurar antes de publicar",
  currentVersion: "V 1.0",
  apkSize: "2 GB",
  apkSha256: "Pendiente de aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±adir",
  lastUpdated: "Pendiente de aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±adir",
  minimumAndroidVersion: "Android 8 o superior",
  supportEmail: "AÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±adir correo de soporte",
  contactEmail: "AÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±adir correo de contacto",
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
    title: "Modo Crisis Survival: aplicaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de supervivencia offline y emergencias",
    description:
      "Descubre Modo Crisis Survival, la aplicaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de supervivencia offline con mapas, guÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­as, botÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n SOS, planes familiares, alertas, inventarios, calculadoras y mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡s de 300 artÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­culos para emergencias.",
    keywords: [
      "aplicaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de supervivencia offline",
      "app de supervivencia",
      "aplicaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n para emergencias",
      "aplicaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n sin Internet",
      "guÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­as de supervivencia",
      "mapas offline de EspaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±a",
      "app para apagones",
      "preparaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n familiar ante emergencias",
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
  { label: "Blog", href: "/blog" },
  { label: "Herramientas", href: "/herramientas-supervivencia" },
  { label: "Recursos", href: "/recursos-avanzados" },
  { label: "Internet", href: "/con-uso-de-internet" },
  { label: "Aprendizaje", href: "/aprendizaje-supervivencia" },
  { label: "IA y enciclopedia", href: "/ia-enciclopedia" },
  { label: "Donar", href: "/donaciones" },
];
