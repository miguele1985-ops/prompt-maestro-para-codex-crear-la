import { Download, ShieldCheck } from "lucide-react";
import { ApkInstallGuide } from "@/components/ApkInstallGuide";
import { DownloadDonationGate } from "@/components/DownloadDonationGate";
import { TrackedDownloadLink } from "@/components/TrackedDownloadLink";
import { downloadInfo } from "@/content/downloads";

type DownloadInfo = typeof downloadInfo;

export function ApkDownloadButton({
  label = "Descargar aplicación para Android",
  info = downloadInfo,
}: {
  label?: string;
  info?: Partial<DownloadInfo>;
}) {
  const current = { ...downloadInfo, ...info };
  const versionText = current.version?.trim();
  const buttonLabel = versionText && !label.includes(versionText) ? `${label} · ${versionText}` : label;

  return (
    <TrackedDownloadLink className="button primary" href={current.apkUrl} download>
      <Download size={18} aria-hidden />
      {buttonLabel}
    </TrackedDownloadLink>
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

export function DownloadCard({
  compact = false,
  info = downloadInfo,
}: {
  compact?: boolean;
  info?: Partial<DownloadInfo>;
}) {
  const current = { ...downloadInfo, ...info };

  return (
    <section className="download-card" aria-labelledby="download-title">
      <div>
        <p className="eyebrow">APK oficial Android</p>
        <h2 id="download-title">{current.name}</h2>
        <dl className="download-meta">
          <div>
            <dt>Versión</dt>
            <dd>{current.version}</dd>
          </div>
          <div>
            <dt>Fecha</dt>
            <dd>{current.date}</dd>
          </div>
          <div>
            <dt>Tamaño</dt>
            <dd>{current.size}</dd>
          </div>
          <div>
            <dt>Android mínimo</dt>
            <dd>{current.minimumAndroidVersion}</dd>
          </div>
          <div>
            <dt>SHA-256</dt>
            <dd>{current.sha256}</dd>
          </div>
        </dl>
        <div className="actions">
          <DownloadDonationGate
            apkUrl={current.apkUrl}
            label="Descargar Modo Crisis Survival"
            version={current.version}
            className="button primary"
          />
        </div>
        <details className="download-card-guide">
          <summary>Ver guía de instalación</summary>
          <ApkInstallGuide compact />
        </details>
      </div>
      {!compact ? <QrDownload /> : null}
    </section>
  );
}
