"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const required = ["name", "email", "subject", "message", "privacy"];
    const valid = required.every((field) => Boolean(form.get(field)));
    setStatus(valid ? "sent" : "error");
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="honeypot" aria-hidden>
        <label>Empresa <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label>Nombre <input name="name" required autoComplete="name" /></label>
      <label>Correo <input name="email" type="email" required autoComplete="email" /></label>
      <label>Asunto <input name="subject" required /></label>
      <label>Mensaje <textarea name="message" required rows={6} /></label>
      <label className="check"><input type="checkbox" name="privacy" required /> Acepto la política de privacidad.</label>
      <button className="button primary" type="submit">Enviar mensaje</button>
      {status === "error" ? <p role="alert" className="warning-text">Revisa los campos obligatorios.</p> : null}
      {status === "sent" ? <p role="status">Mensaje preparado. Configura un proveedor para enviarlo realmente.</p> : null}
    </form>
  );
}
