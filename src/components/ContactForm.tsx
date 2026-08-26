"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    if (form.get("company")) return;

    const name = form.get("name")?.toString().trim() || "";
    const email = form.get("email")?.toString().trim() || "";
    const subject = form.get("subject")?.toString().trim() || "";
    const message = form.get("message")?.toString().trim() || "";
    const privacyAccepted = form.get("privacy") === "on";

    if (!name || !email || !subject || !message) {
      setStatus("error");
      setFeedback("Completa nombre, correo, asunto y mensaje.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setFeedback("Introduce un correo válido.");
      return;
    }

    if (!privacyAccepted) {
      setStatus("error");
      setFeedback("Acepta la política de privacidad para enviar el mensaje.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No se pudo enviar el mensaje.");
      }

      setStatus("sent");
      setFeedback("Mensaje enviado correctamente desde la web.");
      formElement.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "No se pudo enviar el mensaje. Inténtalo de nuevo.");
    }
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
      {status === "error" ? <p role="alert" className="warning-text">{feedback}</p> : null}
      {status === "sent" ? <p role="status" className="admin-status">{feedback}</p> : null}
    </form>
  );
}
