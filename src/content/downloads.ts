import type { ChangelogEntry } from "@/types/content";
import adminOverrides from "./admin-overrides.json";
import { siteConfig } from "./site-config";

const baseDownloadInfo = {
  name: siteConfig.appName,
  icon: siteConfig.logo,
  apkUrl: siteConfig.apkUrl,
  alternativeUrl: siteConfig.alternativeApkUrl,
  version: siteConfig.currentVersion,
  date: siteConfig.lastUpdated,
  size: siteConfig.apkSize,
  minimumAndroidVersion: siteConfig.minimumAndroidVersion,
  sha256: siteConfig.apkSha256,
  permissions: [
    "UbicaciÃ³n: coordenadas, mapas, brÃºjula, puntos guardados, alertas por zona y Caja Negra autorizada.",
    "CÃ¡mara: usada solo para funciones autorizadas como vÃ­deo, seÃ±ales o Caja Negra si se habilita.",
    "MicrÃ³fono: usado solo con permiso cuando se active audio o Caja Negra con audio.",
    "Archivos: importaciÃ³n de mapas MBTiles, modelos GGUF, documentos y recursos externos.",
    "Notificaciones: recordatorios, alertas o revisiones si el usuario las activa.",
    "Bluetooth y Wi-Fi: comunicaciÃ³n local cuando el dispositivo y permisos lo permitan.",
    "Llamadas y vibraciÃ³n: acceso rÃ¡pido al 112, patrones SOS y avisos locales.",
  ],
  installSteps: [
    "Descargar el APK desde la web oficial.",
    "Abrir el archivo descargado.",
    "Autorizar temporalmente la instalaciÃ³n desde esa fuente cuando Android lo solicite.",
    "Instalar la aplicaciÃ³n.",
    "Desactivar de nuevo el permiso de instalaciÃ³n externa si se desea.",
    "Abrir la aplicaciÃ³n.",
    "Conceder Ãºnicamente los permisos necesarios para las funciones que vayas a usar.",
    "Descargar o importar mapas, modelos y recursos opcionales antes de depender de ellos sin cobertura.",
  ],
};

const downloadOverrides = adminOverrides.download as Partial<typeof baseDownloadInfo>;

export const downloadInfo = {
  ...baseDownloadInfo,
  ...downloadOverrides,
  permissions: downloadOverrides.permissions?.length ? downloadOverrides.permissions : baseDownloadInfo.permissions,
  installSteps: downloadOverrides.installSteps?.length ? downloadOverrides.installSteps : baseDownloadInfo.installSteps,
};

const baseChangelog: ChangelogEntry[] = [
  {
    version: "V 1.0",
    date: "Pendiente",
    title: "Primera versiÃ³n",
    changes: ["Modo Crisis", "Mapas offline", "GuÃ­as de supervivencia", "Herramientas personales", "PreparaciÃ³n familiar"],
    fixes: ["Pendiente de aÃ±adir"],
    downloadUrl: siteConfig.apkUrl,
  },
];

export const changelog: ChangelogEntry[] = adminOverrides.changelog.length
  ? (adminOverrides.changelog as ChangelogEntry[])
  : baseChangelog;
