import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { downloadInfo } from "@/content/downloads";

export function ApkDownloadButton({ label = "Descargar para Android" }: { label?: string }) {
  return (
    <a className="button primary" href={downloadInfo.apkUrl} download>
      <Download size={18} aria-hidden />
      {label}
    </a>
  );
}

export function QrDownload() {
  return (
    <div className="qr-placeholder" aria-label="Código QR pendiente de generar">
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
          <div><dt>Versión</dt><dd>{downloadInfo.version}</dd></div>
          <div><dt>Fecha</dt><dd>{downloadInfo.date}</dd></div>
          <div><dt>Tamaño</dt><dd>{downloadInfo.size}</dd></div>
          <div><dt>Android mínimo</dt><dd>{downloadInfo.minimumAndroidVersion}</dd></div>
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
