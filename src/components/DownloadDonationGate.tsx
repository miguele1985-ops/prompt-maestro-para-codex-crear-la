"use client";

import { Download, HeartHandshake, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { ApkInstallGuide } from "@/components/ApkInstallGuide";
import { trackDonation, trackDownload } from "@/components/StatsTracker";
import { siteConfig } from "@/content/site-config";

type DownloadDonationGateProps = {
  apkUrl: string;
  label?: string;
  className?: string;
};

function configuredUrl(value?: string) {
  return Boolean(value && !/configurar|pendiente|anadir|añadir/i.test(value));
}

export function DownloadDonationGate({
  apkUrl,
  label = "Descargar aplicación para Android",
  className = "button primary",
}: DownloadDonationGateProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const donations = siteConfig.donations;
  const amounts = [
    { label: "Donar 5 €", href: donations.amount5Url },
    { label: "Donar 10 €", href: donations.amount10Url },
    { label: "Donar 15 €", href: donations.amount15Url },
    { label: "Lo que desees", href: donations.customAmountUrl || donations.paypalUrl },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const overlay = (
    <div className="donation-gate" role="presentation" onMouseDown={() => setOpen(false)}>
      <section
        className="donation-gate-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="donation-gate-close" type="button" aria-label="Cerrar" onClick={() => setOpen(false)}>
          <X size={20} aria-hidden />
        </button>

        <div className="donation-gate-copy">
          <span className="donation-gate-icon"><HeartHandshake size={24} aria-hidden /></span>
          <p className="eyebrow">Antes de descargar</p>
          <h2 id={titleId}>Ayuda a mantener viva Supervivencia Offline</h2>
          <p>
            La app es gratuita y puede usarse completa sin pagar. Si te resulta útil, una pequeña aportación ayuda a
            mantener la web, corregir errores, preparar nuevas guías, mejorar la app y conservar descargas seguras.
          </p>
          <p>
            Donar es totalmente voluntario. No desbloquea funciones, no crea una cuenta especial y no es necesario para
            usar la aplicación.
          </p>
        </div>

        <div className="donation-gate-actions" aria-label="Opciones de donación">
          {amounts.map((amount) => {
            const hasUrl = configuredUrl(amount.href);
            return (
              <a
                key={amount.label}
                className="donation-amount-button"
                href={hasUrl ? amount.href : "/donaciones"}
                target={hasUrl ? "_blank" : undefined}
                rel={hasUrl ? "noopener noreferrer" : undefined}
                onClick={() => trackDonation(amount.label)}
              >
                {amount.label}
              </a>
            );
          })}
        </div>

        <a
          className="continue-download-button"
          href={apkUrl}
          download
          onClick={() => trackDownload(apkUrl)}
        >
          <Download size={18} aria-hidden />
          Seguir con la descarga
        </a>

        <details className="download-gate-guide">
          <summary>Ver guía de instalación</summary>
          <ApkInstallGuide compact />
        </details>

        <p className="donation-gate-legal">
          La descarga no depende de donar. Tu apoyo solo ayuda a que el proyecto siga mejorando.
        </p>
      </section>
    </div>
  );

  return (
    <>
      <button className={className} type="button" onClick={() => setOpen(true)}>
        <Download size={18} aria-hidden />
        {label}
      </button>

      {mounted && open ? createPortal(overlay, document.body) : null}
    </>
  );
}
