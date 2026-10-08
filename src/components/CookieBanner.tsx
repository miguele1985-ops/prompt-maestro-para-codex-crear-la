"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { readPrivacyPreferences, savePrivacyPreferences } from "@/lib/privacy-preferences";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const dock = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = dock.current;
    if (!element) return;
    const measure = () => {
      document.documentElement.style.setProperty("--cookie-dock-height", `${element.getBoundingClientRect().height}px`);
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => { window.removeEventListener("resize", measure); document.documentElement.style.removeProperty("--cookie-dock-height"); };
    }
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    return () => { resize.disconnect(); document.documentElement.style.removeProperty("--cookie-dock-height"); };
  }, [visible]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readPrivacyPreferences();
      setVisible(!saved);
      setAnalytics(saved?.analytics ?? false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save(value: boolean) {
    savePrivacyPreferences(value);
    setAnalytics(value);
    setVisible(false);
  }

  if (!visible) {
    return <aside className="cookie-dock-closed" ref={dock}><button className="cookie-reopen" type="button" onClick={() => setVisible(true)}>Preferencias de cookies</button></aside>;
  }

  return (
    <section className="cookie-banner" ref={dock} aria-label="Consentimiento de cookies">
      <div>
        <strong>Preferencias de privacidad</strong>
        <p>El almacenamiento necesario está activo. Los contadores opcionales de visitas y clics solo se activan con tu permiso. No hay anuncios de Google activos.</p>
        {settings ? (
          <fieldset>
            <legend>Configurar preferencias</legend>
            <label><input type="checkbox" checked readOnly /> Necesarias</label>
            <label><input type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} /> Contadores estadísticos</label>
          </fieldset>
        ) : null}
      </div>
      <div className="cookie-actions">
        <Link className="cookie-info" href="/cookies">Más información</Link>
        <button className="cookie-primary" type="button" onClick={() => save(true)}>Aceptar</button>
        <button className="cookie-secondary" type="button" onClick={() => save(false)}>Rechazar</button>
        <button className="cookie-secondary" type="button" onClick={() => (settings ? save(analytics) : setSettings(true))}>{settings ? "Guardar preferencias" : "Configurar"}</button>
      </div>
    </section>
  );
}
