"use client";

import { useId, useState } from "react";
import { Send } from "lucide-react";

type BugReportFormProps = {
  source: string;
  title?: string;
};

export function BugReportForm({ source, title = "Reportar un fallo" }: BugReportFormProps) {
  const textareaId = useId();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();

    if (trimmed.length < 8) {
      setStatus("error");
      setFeedback("Escribe un poco más de detalle para poder revisar el fallo.");
      return;
    }

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source, message: trimmed }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No se pudo guardar el reporte.");
      }

      setStatus("sent");
      setFeedback("Fallo enviado. Aparecerá en la pantalla de administración.");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "No se pudo enviar el fallo. Inténtalo de nuevo.");
    }
  }

  return (
    <article className="bug-report-card">
      <div className="bug-report-copy">
        <p className="eyebrow">Soporte</p>
        <h2>{title}</h2>
        <p>Si algo falla en la descarga, los mapas, la IA local o la instalación, escríbelo aquí y quedará registrado en administración.</p>
      </div>
      <form onSubmit={submit} className="bug-report-form">
        <label htmlFor={textareaId}>Describe el fallo</label>
        <textarea
          id={textareaId}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          placeholder="Ejemplo: el enlace del mapa no descarga, el APK da error, o no puedo importar la IA local..."
        />
        <button className="button primary" type="submit">
          <Send aria-hidden /> Enviar fallo
        </button>
        {status === "error" ? <p role="alert" className="warning-text">{feedback}</p> : null}
        {status === "sent" ? <p role="status" className="admin-status">{feedback}</p> : null}
      </form>
    </article>
  );
}
