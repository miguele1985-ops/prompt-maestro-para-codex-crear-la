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
    "Ubicación: coordenadas, mapas, brújula, puntos guardados, alertas por zona y Caja Negra autorizada.",
    "Cámara: usada solo para funciones autorizadas como vídeo, señales o Caja Negra si se habilita.",
    "Micrófono: usado solo con permiso cuando se active audio o Caja Negra con audio.",
    "Archivos: importación de mapas MBTiles, modelos GGUF, documentos y recursos externos.",
    "Notificaciones: recordatorios, alertas o revisiones si el usuario las activa.",
    "Bluetooth y Wi-Fi: comunicación local cuando el dispositivo y permisos lo permitan.",
    "Llamadas y vibración: acceso rápido al 112, patrones SOS y avisos locales.",
  ],
  installSteps: [
    "Descargar el APK desde la web oficial.",
    "Abrir el archivo descargado.",
    "Autorizar temporalmente la instalación desde esa fuente cuando Android lo solicite.",
    "Instalar la aplicación.",
    "Desactivar de nuevo el permiso de instalación externa si se desea.",
    "Abrir la aplicación.",
    "Conceder únicamente los permisos necesarios para las funciones que vayas a usar.",
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
    version: "1.0.0",
    date: "Pendiente",
    title: "Primera versión",
    changes: ["Modo Crisis", "Mapas offline", "Guías de supervivencia", "Herramientas personales", "Preparación familiar"],
    fixes: ["Pendiente de añadir"],
    downloadUrl: siteConfig.apkUrl,
  },
];

export const changelog: ChangelogEntry[] = adminOverrides.changelog.length
  ? (adminOverrides.changelog as ChangelogEntry[])
  : baseChangelog;
