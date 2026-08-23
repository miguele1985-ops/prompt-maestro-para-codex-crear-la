"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, KeyRound, Lock, MessageSquare, RotateCcw, Save, ShieldCheck } from "lucide-react";
import type { AppConfig, AppMode, LicenseRecord, LicenseType, RemoteMessage } from "@/lib/licensing-core";

type Summary = {
  configured: boolean;
  dashboard?: {
    config: AppConfig;
    totals: {
      licenses: number;
      activeLicenses: number;
      revokedLicenses: number;
      activeDevices: number;
      activeMessages: number;
    };
  };
  message?: string;
};

const defaultConfig: AppConfig = {
  licensingEnabled: false,
  globalLockEnabled: false,
  appMode: "FREE",
  gracePeriodEnabled: false,
  gracePeriodEnd: null,
  minimumSupportedVersion: 1,
  latestVersion: 1,
  purchaseUrl: "https://modo-crisis-survival.pages.dev/donaciones",
  supportUrl: "https://modo-crisis-survival.pages.dev/contacto",
  configurationVersion: 1,
  updatedAt: new Date(0).toISOString(),
};

const modeLabels: Record<AppMode, string> = {
  FREE: "Gratis",
  NOTICE: "Aviso",
  GRACE_PERIOD: "Periodo de gracia",
  LICENSE_REQUIRED: "Licencia obligatoria",
};

export function AdminLicensingPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("Cargando sistema de licencias...");
  const [generatedCodes, setGeneratedCodes] = useState("");
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [messages, setMessages] = useState<RemoteMessage[]>([]);
  const [licenseForm, setLicenseForm] = useState({ count: 1, maxDevices: 2, licenseType: "PERMANENT" as LicenseType, expiresAt: "", notes: "" });
  const [messageForm, setMessageForm] = useState({
    title: "Nueva version disponible",
    body: "Ya puedes descargar la nueva version de Modo Crisis Survival.",
    buttonText: "Descargar",
    buttonUrl: "https://modo-crisis-survival.pages.dev/descargar",
    type: "UPDATE",
    enabled: true,
    dismissible: true,
    blocking: false,
  });

  const dangerousChange = config.appMode === "LICENSE_REQUIRED" || config.licensingEnabled || config.globalLockEnabled;
  const totals = summary?.dashboard?.totals;

  async function loadAll() {
    const [dashboardResponse, licensesResponse, messagesResponse] = await Promise.all([
      fetch("/api/admin/licensing", { cache: "no-store" }),
      fetch("/api/admin/licensing/licenses", { cache: "no-store" }),
      fetch("/api/admin/licensing/messages", { cache: "no-store" }),
    ]);
    const dashboard = (await dashboardResponse.json().catch(() => null)) as Summary | null;
    const licensePayload = (await licensesResponse.json().catch(() => null)) as { licenses?: LicenseRecord[] } | null;
    const messagePayload = (await messagesResponse.json().catch(() => null)) as { messages?: RemoteMessage[] } | null;
    setSummary(dashboard);
    if (dashboard?.dashboard?.config) setConfig(dashboard.dashboard.config);
    setLicenses(licensePayload?.licenses || []);
    setMessages(messagePayload?.messages || []);
    setStatus(dashboard?.configured === false ? dashboard.message || "D1 no esta configurado." : "Sistema listo.");
  }

  useEffect(() => {
    loadAll().catch((error) => setStatus(error instanceof Error ? error.message : "No se pudo cargar licencias."));
  }, []);

  const modeDescription = useMemo(() => {
    if (config.appMode === "FREE") return "La app sigue siendo gratis. Nadie necesita codigo.";
    if (config.appMode === "NOTICE") return "La app muestra avisos remotos, pero no bloquea.";
    if (config.appMode === "GRACE_PERIOD") return "La app avisa de un futuro cambio, con margen para usuarios.";
    return "Las instalaciones sin licencia valida pueden quedar bloqueadas.";
  }, [config.appMode]);

  async function saveConfig(resetFree = false) {
    setStatus("Guardando configuracion...");
    const response = await fetch("/api/admin/licensing/config", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...config, resetFree, confirmation }),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; config?: AppConfig } | null;
    if (!response.ok || !payload?.ok) {
      setStatus(payload?.message || "No se pudo guardar.");
      return;
    }
    if (payload.config) setConfig(payload.config);
    setConfirmation("");
    setStatus(resetFree ? "Modo gratis restablecido." : "Configuracion guardada.");
    await loadAll();
  }

  async function generateLicenses() {
    setStatus("Generando codigos...");
    const response = await fetch("/api/admin/licensing/licenses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...licenseForm, expiresAt: licenseForm.expiresAt || null }),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; licenses?: Array<{ code: string }> } | null;
    if (!response.ok || !payload?.ok) {
      setStatus(payload?.message || "No se pudieron generar codigos.");
      return;
    }
    setGeneratedCodes((payload.licenses || []).map((license) => license.code).join("\n"));
    setStatus(payload.message || "Codigos generados.");
    await loadAll();
  }

  async function saveMessage() {
    setStatus("Publicando mensaje...");
    const response = await fetch("/api/admin/licensing/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(messageForm),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
    if (!response.ok || !payload?.ok) {
      setStatus(payload?.message || "No se pudo guardar el mensaje.");
      return;
    }
    setStatus("Mensaje guardado.");
    await loadAll();
  }

  async function changeLicenseStatus(license: LicenseRecord, statusValue: LicenseRecord["status"]) {
    await fetch(`/api/admin/licensing/licenses/${encodeURIComponent(license.id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: statusValue }),
    });
    await loadAll();
  }

  return (
    <div className="licensing-admin">
      <section className="licensing-hero">
        <div>
          <p className="admin-kicker">Control remoto preparado</p>
          <h2>Licencias, mensajes y bloqueo remoto</h2>
          <p>
            El sistema queda instalado en modo seguro: la app sigue gratis hasta que actives licencias manualmente. Los cambios sensibles pasan por API protegida y quedan registrados.
          </p>
        </div>
        <div className={`license-mode-pill mode-${config.appMode.toLowerCase().replace("_", "-")}`}>
          <ShieldCheck aria-hidden />
          <span>{modeLabels[config.appMode]}</span>
        </div>
      </section>

      <div className="admin-stat-grid licensing-stats">
        <div><span>Modo actual</span><strong>{modeLabels[config.appMode]}</strong><small>{modeDescription}</small></div>
        <div><span>Licencias</span><strong>{totals?.licenses ?? 0}</strong><small>{totals?.activeLicenses ?? 0} activas</small></div>
        <div><span>Dispositivos</span><strong>{totals?.activeDevices ?? 0}</strong><small>Activaciones en uso</small></div>
        <div><span>Mensajes</span><strong>{totals?.activeMessages ?? 0}</strong><small>Activos para Android</small></div>
      </div>

      <section className="admin-edit-card">
        <div className="admin-card-heading">
          <Lock aria-hidden />
          <div>
            <h3>Estado global de la app</h3>
            <p>Mientras esté en Gratis, ningún usuario necesita código y un fallo de servidor no bloquea la app.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <label>Modo
            <select value={config.appMode} onChange={(event) => setConfig({ ...config, appMode: event.target.value as AppMode })}>
              <option value="FREE">GRATIS</option>
              <option value="NOTICE">AVISO</option>
              <option value="GRACE_PERIOD">PERIODO DE GRACIA</option>
              <option value="LICENSE_REQUIRED">LICENCIA OBLIGATORIA</option>
            </select>
          </label>
          <label>Versión mínima
            <input type="number" min="1" value={config.minimumSupportedVersion} onChange={(event) => setConfig({ ...config, minimumSupportedVersion: Number(event.target.value || 1) })} />
          </label>
          <label>Última versión
            <input type="number" min="1" value={config.latestVersion} onChange={(event) => setConfig({ ...config, latestVersion: Number(event.target.value || 1) })} />
          </label>
          <label>URL de compra/donación
            <input value={config.purchaseUrl} onChange={(event) => setConfig({ ...config, purchaseUrl: event.target.value })} />
          </label>
          <label>URL de soporte
            <input value={config.supportUrl} onChange={(event) => setConfig({ ...config, supportUrl: event.target.value })} />
          </label>
        </div>
        <div className="admin-toggle-row">
          <label><input type="checkbox" checked={config.licensingEnabled} onChange={(event) => setConfig({ ...config, licensingEnabled: event.target.checked })} /> Activar comprobación de licencias</label>
          <label><input type="checkbox" checked={config.globalLockEnabled} onChange={(event) => setConfig({ ...config, globalLockEnabled: event.target.checked })} /> Bloqueo global</label>
        </div>
        {dangerousChange ? (
          <div className="danger-confirm">
            <AlertTriangle aria-hidden />
            <div>
              <strong>Confirmación obligatoria</strong>
              <p>Vas a exigir licencia a instalaciones que reciban esta configuración. Escribe ACTIVAR LICENCIAS para aplicar el cambio.</p>
              <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="ACTIVAR LICENCIAS" />
            </div>
          </div>
        ) : null}
        <div className="admin-actions-row">
          <button type="button" className="admin-primary-button" onClick={() => saveConfig(false)}><Save aria-hidden /> Guardar estado</button>
          <button type="button" className="admin-safe-button" onClick={() => saveConfig(true)}><RotateCcw aria-hidden /> Restablecer modo gratis</button>
        </div>
      </section>

      <section className="admin-edit-card">
        <div className="admin-card-heading">
          <KeyRound aria-hidden />
          <div>
            <h3>Generar licencias</h3>
            <p>El código completo solo aparece justo después de generarlo. La base de datos guarda el hash, no el código en claro.</p>
          </div>
        </div>
        <div className="admin-form-grid compact">
          <label>Cantidad
            <input type="number" min="1" max="200" value={licenseForm.count} onChange={(event) => setLicenseForm({ ...licenseForm, count: Number(event.target.value || 1) })} />
          </label>
          <label>Dispositivos
            <input type="number" min="1" max="20" value={licenseForm.maxDevices} onChange={(event) => setLicenseForm({ ...licenseForm, maxDevices: Number(event.target.value || 2) })} />
          </label>
          <label>Tipo
            <select value={licenseForm.licenseType} onChange={(event) => setLicenseForm({ ...licenseForm, licenseType: event.target.value as LicenseType })}>
              <option value="PERMANENT">PERMANENT</option>
              <option value="ANNUAL">ANNUAL</option>
              <option value="CUSTOM">CUSTOM</option>
            </select>
          </label>
          <label>Caducidad opcional
            <input type="datetime-local" value={licenseForm.expiresAt} onChange={(event) => setLicenseForm({ ...licenseForm, expiresAt: event.target.value })} />
          </label>
        </div>
        <label className="admin-full-label">Notas internas
          <textarea value={licenseForm.notes} onChange={(event) => setLicenseForm({ ...licenseForm, notes: event.target.value })} rows={3} />
        </label>
        <button type="button" className="admin-primary-button" onClick={generateLicenses}><KeyRound aria-hidden /> Generar código</button>
        {generatedCodes ? (
          <textarea className="generated-license-codes" value={generatedCodes} readOnly rows={Math.min(8, generatedCodes.split("\n").length + 1)} />
        ) : null}
      </section>

      <section className="admin-edit-card">
        <div className="admin-card-heading">
          <MessageSquare aria-hidden />
          <div>
            <h3>Mensajes remotos para Android</h3>
            <p>Publica avisos, actualizaciones o mensajes bloqueantes. El botón abre una URL segura configurada aquí.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <label>Título
            <input value={messageForm.title} onChange={(event) => setMessageForm({ ...messageForm, title: event.target.value })} />
          </label>
          <label>Tipo
            <select value={messageForm.type} onChange={(event) => setMessageForm({ ...messageForm, type: event.target.value })}>
              <option>INFO</option>
              <option>IMPORTANT</option>
              <option>UPDATE</option>
              <option>PROMOTION</option>
              <option>LICENSE</option>
              <option>BLOCKING</option>
            </select>
          </label>
          <label>Texto del botón
            <input value={messageForm.buttonText} onChange={(event) => setMessageForm({ ...messageForm, buttonText: event.target.value })} />
          </label>
          <label>URL del botón
            <input value={messageForm.buttonUrl} onChange={(event) => setMessageForm({ ...messageForm, buttonUrl: event.target.value })} />
          </label>
        </div>
        <label className="admin-full-label">Mensaje
          <textarea value={messageForm.body} onChange={(event) => setMessageForm({ ...messageForm, body: event.target.value })} rows={5} />
        </label>
        <div className="admin-toggle-row">
          <label><input type="checkbox" checked={messageForm.enabled} onChange={(event) => setMessageForm({ ...messageForm, enabled: event.target.checked })} /> Activo</label>
          <label><input type="checkbox" checked={messageForm.dismissible} onChange={(event) => setMessageForm({ ...messageForm, dismissible: event.target.checked })} /> Permitir cerrar</label>
          <label><input type="checkbox" checked={messageForm.blocking} onChange={(event) => setMessageForm({ ...messageForm, blocking: event.target.checked })} /> Bloqueante</label>
        </div>
        <div className="remote-message-preview">
          <strong>{messageForm.title}</strong>
          <p>{messageForm.body}</p>
          {messageForm.buttonText ? <span>{messageForm.buttonText}</span> : null}
        </div>
        <button type="button" className="admin-primary-button" onClick={saveMessage}><Save aria-hidden /> Guardar mensaje</button>
      </section>

      <section className="admin-edit-card">
        <div className="admin-card-heading">
          <CheckCircle2 aria-hidden />
          <div>
            <h3>Licencias recientes</h3>
            <p>Busca por los últimos caracteres en D1. Los códigos completos no se muestran de nuevo por seguridad.</p>
          </div>
        </div>
        <div className="license-list">
          {licenses.slice(0, 20).map((license) => (
            <article key={license.id}>
              <div>
                <strong>**** {license.codeLast4}</strong>
                <span>{license.status} · {license.licenseType} · {license.maxDevices} dispositivos</span>
              </div>
              <div className="license-actions">
                <button type="button" onClick={() => changeLicenseStatus(license, "ACTIVE")}>Activar</button>
                <button type="button" onClick={() => changeLicenseStatus(license, "SUSPENDED")}>Suspender</button>
                <button type="button" onClick={() => changeLicenseStatus(license, "REVOKED")}>Revocar</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-edit-card">
        <h3>Mensajes guardados</h3>
        <div className="license-list">
          {messages.slice(0, 10).map((message) => (
            <article key={message.id}>
              <div>
                <strong>{message.title}</strong>
                <span>{message.type} · {message.enabled ? "Activo" : "Inactivo"} · {message.blocking ? "Bloqueante" : "No bloqueante"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="admin-status-line">{status}</p>
    </div>
  );
}
