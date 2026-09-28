"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Consent = "accepted" | "rejected" | "custom";
const key = "mcs-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
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
    const timer = window.setTimeout(() => setVisible(!localStorage.getItem(key)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save(value: Consent) {
    localStorage.setItem(key, value);
    setVisible(false);
  }

  if (!visible) {
    return <aside className="cookie-dock-closed" ref={dock}><button className="cookie-reopen" type="button" onClick={() => setVisible(true)}>Preferencias de cookies</button></aside>;
  }

  return (
    <section className="cookie-banner" ref={dock} aria-label="Consentimiento de cookies">
      <div>
        <strong>Preferencias de privacidad</strong>
        <p>Solo las cookies necesarias están activas por defecto.</p>
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
