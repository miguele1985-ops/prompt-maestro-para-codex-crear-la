import adminOverrides from "./admin-overrides.json";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";

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
    primaryUrl: "https://www.paypal.com/donate/?hosted_button_id=SSVXWRYX2VHDL",
    paypalUrl: "https://www.paypal.com/donate/?hosted_button_id=SSVXWRYX2VHDL",
    amount5Url: "https://www.paypal.com/donate/?hosted_button_id=3R49WBA2KEFBS",
    amount10Url: "https://www.paypal.com/donate/?hosted_button_id=ZN44N6UZGSUWN",
    amount15Url: "https://www.paypal.com/donate/?hosted_button_id=G5VBLBW6ZG78E",
    customAmountUrl: "https://www.paypal.com/donate/?hosted_button_id=SSVXWRYX2VHDL",
    paypalHostedButtonId: "SSVXWRYX2VHDL",
    qrImage: "/assets/img/paypal-donacion-qr.png",
    bizumInfo: "Configurar antes de publicar",
    kofiUrl: "Configurar antes de publicar",
    patreonUrl: "Configurar antes de publicar",
    note: "Las donaciones son voluntarias y ayudan a mantener el desarrollo, los recursos, las actualizaciones y el soporte del proyecto. La app sigue siendo completa para todos.",
  },
  seo: {
    title: "Modo Crisis Survival: aplicación de supervivencia offline y emergencias",
    description:
    "Aplicaci\u00f3n de supervivencia offline, preparaci\u00f3n familiar, mapas MBTiles, gu\u00edas, bot\u00f3n SOS, calculadoras, inventarios, IA local opcional y herramientas para emergencias.",
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
  { label: "Blog", href: "/blog" },
  { label: "Herramientas", href: "/herramientas-supervivencia" },
  { label: "Recursos", href: "/recursos-avanzados" },
  { label: "Internet", href: "/con-uso-de-internet" },
  { label: "Aprendizaje", href: "/aprendizaje-supervivencia" },
  { label: "IA y enciclopedia", href: "/ia-enciclopedia" },
  { label: "Donar", href: "/donaciones" },
];
