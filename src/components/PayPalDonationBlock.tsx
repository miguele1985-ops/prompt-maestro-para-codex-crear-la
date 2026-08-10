"use client";

import Script from "next/script";
import {
  BookOpen,
  Bug,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { trackDonation } from "@/components/StatsTracker";
import { donationFaqs } from "@/content/donations";

declare global {
  interface Window {
    PayPal?: {
      Donation: {
        Button: (config: {
          env: "production";
          hosted_button_id: string;
          image: { src: string; alt: string; title: string };
        }) => { render: (selector: string) => void };
      };
    };
  }
}

export type DonationSettings = {
  amount5Url?: string;
  amount10Url?: string;
  amount15Url?: string;
  customAmountUrl?: string;
  paypalHostedButtonId?: string;
  qrImage?: string;
};

const supportCards = [
  { title: "Mejoras de la app", icon: Wrench },
  { title: "Nuevas guías", icon: BookOpen },
  { title: "Corrección de errores", icon: Bug },
  { title: "Mantenimiento de la web", icon: Globe2 },
  { title: "Nuevas funciones offline", icon: ShieldCheck },
  { title: "Contenido para familias", icon: Users },
];

function isConfiguredUrl(value?: string) {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return Boolean(
    normalized &&
      normalized !== "#" &&
      !normalized.includes("configurar") &&
      !normalized.includes("pendiente") &&
      !normalized.includes("añadir"),
  );
}

export function PayPalDonationBlock({ donations }: { donations?: DonationSettings }) {
  const [paypalReady, setPaypalReady] = useState(false);
  const [qrVisible, setQrVisible] = useState(true);
  const hostedButtonId = donations?.paypalHostedButtonId?.trim() || "9TZTUQQTQ8J7Q";
  const qrImage = donations?.qrImage?.trim() || "/assets/img/paypal-donacion-qr.png";

  const donationAmounts = useMemo(
    () => [
      { label: "Donar 5 €", href: donations?.amount5Url },
      { label: "Donar 10 €", href: donations?.amount10Url },
      { label: "Donar 15 €", href: donations?.amount15Url },
      { label: "Elegir otra cantidad", href: donations?.customAmountUrl },
    ],
    [donations?.amount5Url, donations?.amount10Url, donations?.amount15Url, donations?.customAmountUrl],
  );

  const renderPayPal = useCallback(() => {
    const container = document.getElementById("donate-button");
    if (!window.PayPal || !container || container.childNodes.length > 0) return;

    window.PayPal.Donation.Button({
      env: "production",
      hosted_button_id: hostedButtonId,
      image: {
        src: "https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donateCC_LG.gif",
        alt: "Botón Donar con PayPal",
        title: "PayPal - forma segura y sencilla de pagar en línea",
      },
    }).render("#donate-button");
    setPaypalReady(true);
  }, [hostedButtonId]);

  return (
    <section className="content-band donation-page-block" aria-labelledby="donation-main-title">
      <article className="donation-amount-card donation-amount-card-top">
        <div>
          <p className="eyebrow">Aportación voluntaria</p>
          <h2 id="donation-main-title">Elige cómo quieres apoyar</h2>
          <p>Cualquier ayuda, por pequeña que sea, suma. Gracias por apoyar un proyecto independiente.</p>
        </div>
        <div className="donation-amount-grid">
          {donationAmounts.map((amount) => (
            <a
              className="donation-amount-button"
              href={isConfiguredUrl(amount.href) ? amount.href! : "#donate-button-container"}
              key={amount.label}
              onClick={() => trackDonation(amount.label)}
              rel={isConfiguredUrl(amount.href) ? "noopener noreferrer" : undefined}
              target={isConfiguredUrl(amount.href) ? "_blank" : undefined}
            >
              <HeartHandshake size={18} aria-hidden />
              {amount.label}
            </a>
          ))}
        </div>
        <p className="donation-amount-note">
          Puedes configurar estos enlaces desde administración. Si aún no están configurados, usa el botón oficial de PayPal o el QR.
        </p>
      </article>

      <div className="donation-payment-grid">
        <article className="donation-action-card" onClickCapture={() => trackDonation("paypal-hosted-button")}>
          <HeartHandshake size={34} aria-hidden />
          <h2>Donar con PayPal</h2>
          <p>Aportación voluntaria para apoyar el mantenimiento y la mejora de Supervivencia Offline.</p>
          <div id="donate-button-container" className="paypal-button-shell">
            <div id="donate-button" aria-live="polite" />
          </div>
          <p className="paypal-fallback">
            {!paypalReady
              ? "Si el botón no aparece correctamente, puedes escanear el código QR de PayPal o intentarlo de nuevo desde un navegador actualizado."
              : "Donación voluntaria gestionada mediante PayPal."}
          </p>
        </article>

        <article className="donation-qr-card donation-qr-card-compact">
          <div>
            <p className="eyebrow">PayPal QR</p>
            <h2>También puedes donar escaneando el QR</h2>
            <p>Escanea este código QR con tu móvil para abrir la donación en PayPal.</p>
          </div>
          {qrVisible ? (
            <figure className="donation-qr-figure">
              <img
                src={qrImage}
                alt="Código QR para donar a Supervivencia Offline mediante PayPal"
                onError={() => setQrVisible(false)}
              />
              <figcaption>Donación voluntaria mediante PayPal.</figcaption>
            </figure>
          ) : (
            <div className="donation-qr-missing">
              Configura la imagen QR en administración o coloca el archivo en <strong>public/assets/img/paypal-donacion-qr.png</strong>.
            </div>
          )}
        </article>
      </div>

      <article className="donation-hero-card donation-hero-card-full">
        <div className="donation-hero-copy">
          <p className="eyebrow">Apoyo voluntario</p>
          <h2>Ayuda a mantener viva Supervivencia Offline</h2>
          <p className="donation-lead">
            La app es gratuita y puede usarse completa sin pagar. Pero si te resulta útil, tu apoyo puede ayudar a que siga creciendo.
          </p>
          <p>
            Supervivencia Offline nace con una idea sencilla: que cualquier persona o familia pueda tener en su móvil una herramienta útil para prepararse ante situaciones difíciles, incluso cuando no hay internet.
          </p>
          <p>
            Apagones, cortes de agua, pérdida de cobertura, emergencias en casa, riadas, incendios, evacuaciones o momentos de incertidumbre pueden llegar sin avisar. Tener una guía clara, checklists, inventario familiar, plan de emergencia y consejos organizados puede marcar la diferencia.
          </p>
          <p>Por eso la app se ofrece de forma gratuita y completa.</p>
          <p>
            Pero mantener este proyecto requiere tiempo, pruebas, correcciones, nuevas guías, mejoras de diseño, revisión de contenidos, actualizaciones y almacenamiento para que la descarga siga disponible.
          </p>
          <p>Si la app te ha resultado útil, puedes apoyar el proyecto con una aportación voluntaria.</p>
        </div>
      </article>

      <article className="donation-highlight-card">
        <div>
          <p className="eyebrow">Proyecto independiente</p>
          <h2>Tu ayuda mantiene este proyecto en marcha</h2>
          <p>
            Con una pequeña aportación ayudas a mejorar la app, añadir nuevas guías, crear más checklists, corregir errores, mantener la web activa, mejorar la descarga de la APK, preparar nuevas funciones offline y seguir creando contenido útil para familias.
          </p>
        </div>
        <div className="donation-support-grid" aria-label="Qué ayuda a mantener una donación">
          {supportCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="donation-support-card" key={card.title}>
                <Icon size={22} aria-hidden />
                <span>{card.title}</span>
              </article>
            );
          })}
        </div>
      </article>

      <div className="donation-story-grid">
        <article className="donation-story-card">
          <Sparkles size={26} aria-hidden />
          <h2>Una app gratuita también necesita apoyo</h2>
          <p>
            Supervivencia Offline no es una gran empresa. Es un proyecto independiente creado para ayudar a personas normales a prepararse mejor.
          </p>
          <p>
            Cada mejora lleva horas de trabajo: escribir contenidos, revisar información, diseñar pantallas, probar la app, corregir fallos y preparar nuevas herramientas.
          </p>
          <p>
            Si crees que esta app puede ayudar a una familia, a una persona mayor, a unos padres con hijos o a alguien que quiere estar mejor preparado, tu apoyo ayuda a que el proyecto continúe.
          </p>
        </article>

        <article className="donation-transparency-card">
          <ShieldCheck size={26} aria-hidden />
          <h2>La donación no cambia la app</h2>
          <p>La aportación es completamente voluntaria.</p>
          <ul>
            <li>Donar no añade funciones adicionales.</li>
            <li>Donar no crea una versión especial.</li>
            <li>Donar no es obligatorio para usar Supervivencia Offline.</li>
          </ul>
          <p>La app puede usarse completa sin pagar.</p>
          <p>Tu donación simplemente ayuda a mantener y mejorar el proyecto.</p>
        </article>
      </div>

      <article className="donation-awareness-card">
        <h2>Porque estar preparado debería estar al alcance de todos</h2>
        <p>
          La preparación familiar no debería depender de pagar una suscripción ni de tener conexión a internet.
        </p>
        <p>Supervivencia Offline quiere ser una herramienta sencilla, clara y accesible para cualquier hogar.</p>
        <p>Tu apoyo permite que siga siendo gratuita y que pueda mejorar con el tiempo.</p>
      </article>

      <div className="donation-faq-list">
        <h2>Preguntas frecuentes sobre donaciones</h2>
        {donationFaqs.map((faq) => (
          <details className="donation-faq-item" key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>

      <article className="donation-legal-card">
        <h2>Aviso breve</h2>
        <p>
          Las aportaciones voluntarias sirven para apoyar el desarrollo y mantenimiento del proyecto. No constituyen una adquisición de producto adicional, servicio personalizado ni acceso exclusivo a funciones. La app puede usarse completa sin realizar ninguna aportación.
        </p>
      </article>

      <Script
        id="paypal-donate-sdk"
        src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
        strategy="afterInteractive"
        charSet="UTF-8"
        onLoad={renderPayPal}
        onReady={renderPayPal}
      />
    </section>
  );
}
