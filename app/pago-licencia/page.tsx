import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeEuro,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Lock,
  ShieldCheck,
  Webhook,
} from "lucide-react";
import { siteConfig } from "@/content/site-config";

const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Pago de licencia | Modo Crisis Survival",
  description:
    "Página preparada para una futura pasarela de pago de licencias de Modo Crisis Survival. Actualmente la app sigue siendo gratuita y completa.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: `${baseUrl}/pago-licencia`,
  },
  openGraph: {
    title: "Pago de licencia | Modo Crisis Survival",
    description:
      "Sistema preparado para una futura licencia. Actualmente Modo Crisis Survival sigue siendo gratis y completa.",
    url: `${baseUrl}/pago-licencia`,
    type: "website",
  },
};

const futureFeatures = [
  "Pago verificado desde servidor mediante webhook",
  "Generación segura de código de licencia",
  "Activación prevista para 2 dispositivos",
  "Certificado offline firmado para la app",
  "Panel de administración para revocar o liberar dispositivos",
  "Registro de auditoría de cambios importantes",
];

const flowSteps = [
  "El usuario realiza el pago en una pasarela segura.",
  "La pasarela confirma el pago al servidor, no al navegador.",
  "El servidor genera una licencia y la guarda de forma segura.",
  "La app activa la licencia y recibe un certificado verificable offline.",
];

export default function FuturePaymentPage() {
  return (
    <main className="payment-hidden-page">
      <section className="payment-hero-card">
        <div className="payment-hero-copy">
          <p className="eyebrow">Pasarela preparada para futuro</p>
          <h1>Pago de licencia de Modo Crisis Survival</h1>
          <p>
            Esta página queda preparada para una posible versión futura con licencia. Ahora mismo la
            aplicación sigue siendo gratuita y puede usarse completa sin pagar, sin introducir códigos y sin
            activar ninguna cuenta.
          </p>
          <div className="payment-status-banner">
            <ShieldCheck aria-hidden="true" />
            <span>
              Estado actual: <strong>modo gratis activo</strong>. La venta de licencias todavía no está
              habilitada.
            </span>
          </div>
        </div>
        <div className="payment-state-card" aria-label="Estado de la pasarela">
          <Lock aria-hidden="true" />
          <span>Pasarela desactivada</span>
          <strong>No se puede comprar licencia todavía</strong>
        </div>
      </section>

      <section className="payment-grid" aria-label="Configuración futura">
        <article className="payment-card payment-license-card">
          <BadgeEuro aria-hidden="true" />
          <p className="eyebrow">Licencia futura</p>
          <h2>Licencia permanente</h2>
          <p>
            Cuando se active esta opción, la licencia se podrá asociar a dispositivos autorizados desde el
            sistema de licencias. La configuración inicial prevista es de 2 dispositivos por código.
          </p>
          <div className="payment-price">Pendiente</div>
          <button className="payment-disabled-button" type="button" disabled>
            Pago no activo todavía
          </button>
        </article>

        <article className="payment-card">
          <KeyRound aria-hidden="true" />
          <p className="eyebrow">Activación segura</p>
          <h2>Cómo funcionará</h2>
          <ol className="payment-steps">
            {flowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="payment-provider-card">
        <div>
          <Webhook aria-hidden="true" />
          <p className="eyebrow">Preparado para conectar</p>
          <h2>PayPal, Stripe u otra pasarela compatible</h2>
          <p>
            La página está lista como base visual para una compra futura, pero la generación real de licencias
            deberá hacerse solo cuando la pasarela confirme el pago mediante webhook seguro. No se debe generar
            una licencia únicamente porque el navegador vuelva desde una pantalla de pago correcto.
          </p>
        </div>
        <ul className="payment-provider-list">
          {futureFeatures.map((feature) => (
            <li key={feature}>
              <CheckCircle2 aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="payment-warning-card">
        <AlertTriangle aria-hidden="true" />
        <div>
          <h2>Aviso importante</h2>
          <p>
            Esta página no cambia el modelo actual de la app. Las donaciones siguen siendo voluntarias y no son
            una compra de licencia. Si en el futuro se activa el pago, deberá informarse claramente al usuario y
            actualizar las condiciones legales antes de publicar la función.
          </p>
          <Link className="payment-secondary-link" href="/donaciones">
            Ver página actual de donaciones
          </Link>
        </div>
      </section>
    </main>
  );
}
