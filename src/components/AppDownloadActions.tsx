import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { TrackedDownloadLink } from "./TrackedDownloadLink";
import { downloadInfo } from "@/content/downloads";
import { officialApkUrl } from "@/content/site-config";

export function AppDownloadActions() {
  return (
    <div className="app-download-actions">
      <TrackedDownloadLink className="app-download-primary" href={officialApkUrl}>
        <Download size={23} aria-hidden />
        <span><strong>Descargar app para Android</strong><small>APK oficial · {downloadInfo.version}</small></span>
      </TrackedDownloadLink>
      <Link className="app-download-secondary" href="/aplicacion-supervivencia-offline">
        Conocer la app <ArrowRight size={18} aria-hidden />
      </Link>
      <Link className="app-download-help" href="/descargar">Cómo instalar la APK</Link>
    </div>
  );
}
