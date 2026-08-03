"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Consent = "accepted" | "rejected" | "custom";
const key = "mcs-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(!localStorage.getItem(key)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save(value: Consent) {
    localStorage.setItem(key, value);
    setVisible(false);
  }

  if (!visible) {
    return <button className="cookie-reopen" type="button" onClick={() => setVisible(true)}>Cookies</button>;
  }

  return (
    <section className="cookie-banner" aria-label="Consentimiento de cookies">
      <div>
        <strong>Preferencias de privacidad</strong>
        <p>Solo las cookies necesarias estan activas por defecto. La analitica no se carga hasta que se configure y aceptes.</p>
        {settings ? (
          <fieldset>
            <legend>Configurar categorias</legend>
            <label><input type="checkbox" checked readOnly /> Necesarias</label>
            <label><input type="checkbox" /> Analiticas</label>
            <label><input type="checkbox" /> Preferencias</label>
            <label><input type="checkbox" /> Marketing, solo si se utiliza</label>
          </fieldset>
        ) : null}
      </div>
      <div className="cookie-actions">
        <Link className="cookie-info" href="/cookies">Mas informacion</Link>
        <button className="cookie-primary" type="button" onClick={() => save("accepted")}>Aceptar</button>
        <button className="cookie-secondary" type="button" onClick={() => save("rejected")}>Rechazar</button>
        <button className="cookie-secondary" type="button" onClick={() => (settings ? save("custom") : setSettings(true))}>Configurar</button>
      </div>
    </section>
  );
}