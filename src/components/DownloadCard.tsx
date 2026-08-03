import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { TrackedDownloadLink } from "@/components/TrackedDownloadLink";
import { downloadInfo } from "@/content/downloads";

export function ApkDownloadButton({ label = "Descargar aplicación para Android" }: { label?: string }) {
  return (
    <TrackedDownloadLink className="button primary" href={downloadInfo.apkUrl} download>
      <Download size={18} aria-hidden />
      {label}
    </TrackedDownloadLink>
  );
}

export function QrDownload() {
  return (
    <div className="qr-placeholder" aria-label="CÃ³digo QR pendiente de generar">
      <ShieldCheck aria-hidden />
      <span>QR pendiente de generar</span>
    </div>
  );
}

export function DownloadCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className="download-card" aria-labelledby="download-title">
      <div>
        <p className="eyebrow">APK oficial Android</p>
        <h2 id="download-title">{downloadInfo.name}</h2>
        <dl className="download-meta">
          <div><dt>VersiÃ³n</dt><dd>{downloadInfo.version}</dd></div>
          <div><dt>Fecha</dt><dd>{downloadInfo.date}</dd></div>
          <div><dt>TamaÃ±o</dt><dd>{downloadInfo.size}</dd></div>
          <div><dt>Android mÃ­nimo</dt><dd>{downloadInfo.minimumAndroidVersion}</dd></div>
          <div><dt>SHA-256</dt><dd>{downloadInfo.sha256}</dd></div>
        </dl>
        <div className="actions">
          <ApkDownloadButton label="Descargar Modo Crisis Survival" />
          <Link className="button secondary" href="/descargar">Ver instrucciones</Link>
        </div>
      </div>
      {!compact ? <QrDownload /> : null}
    </section>
  );
}
