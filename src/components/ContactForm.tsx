"use client";

import { useState } from "react";
import { siteConfig } from "@/content/site-config";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const required = ["name", "email", "subject", "message", "privacy"];
    const valid = required.every((field) => Boolean(form.get(field)?.toString().trim()));

    if (form.get("company")) return;

    if (!valid) {
      setStatus("error");
      return;
    }

    const name = form.get("name")?.toString().trim() || "Sin nombre";
    const email = form.get("email")?.toString().trim() || "Sin correo";
    const subject = form.get("subject")?.toString().trim() || "Contacto desde la web";
    const message = form.get("message")?.toString().trim() || "";
    const mailSubject = encodeURIComponent(`[Supervivencia Offline] ${subject}`);
    const mailBody = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);

    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${mailSubject}&body=${mailBody}`;
    setStatus("sent");
    formElement.reset();
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
      <p className="field-help">El mensaje se enviará a {siteConfig.contactEmail} mediante tu aplicación de correo.</p>
      {status === "error" ? <p role="alert" className="warning-text">Revisa los campos obligatorios.</p> : null}
      {status === "sent" ? <p role="status" className="admin-status">Se abrirá tu correo para enviar el mensaje.</p> : null}
    </form>
  );
}