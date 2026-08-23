"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, KeyRound, Save, ShieldCheck } from "lucide-react";
import type { AppConfig, LicenseRecord, LicenseType } from "@/lib/licensing-core";

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

const modeLabels: Record<AppConfig["appMode"], string> = {
  FREE: "Gratis",
  NOTICE: "Aviso",
  GRACE_PERIOD: "Periodo de gracia",
  LICENSE_REQUIRED: "Licencia obligatoria",
};

export function AdminLicensingPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [status, setStatus] = useState("Cargando sistema de licencias...");
  const [generatedCodes, setGeneratedCodes] = useState("");
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [licenseForm, setLicenseForm] = useState({ count: 1, maxDevices: 2, licenseType: "PERMANENT" as LicenseType, expiresAt: "", notes: "" });

  const totals = summary?.dashboard?.totals;

  async function loadAll() {
    const [dashboardResponse, licensesResponse] = await Promise.all([
      fetch("/api/admin/licensing", { cache: "no-store" }),
      fetch("/api/admin/licensing/licenses", { cache: "no-store" }),
    ]);
    const dashboard = (await dashboardResponse.json().catch(() => null)) as Summary | null;
    const licensePayload = (await licensesResponse.json().catch(() => null)) as { licenses?: LicenseRecord[] } | null;
    setSummary(dashboard);
    if (dashboard?.dashboard?.config) setConfig(dashboard.dashboard.config);
    setLicenses(licensePayload?.licenses || []);
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

  async function saveConfig() {
    setStatus("Guardando configuracion...");
    const response = await fetch("/api/admin/licensing/config", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        webOnly: true,
        minimumSupportedVersion: config.minimumSupportedVersion,
        latestVersion: config.latestVersion,
        purchaseUrl: config.purchaseUrl,
        supportUrl: config.supportUrl,
      }),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; config?: AppConfig } | null;
    if (!response.ok || !payload?.ok) {
      setStatus(payload?.message || "No se pudo guardar.");
      return;
    }
    if (payload.config) setConfig(payload.config);
    setStatus("Configuracion guardada.");
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
          <p className="admin-kicker">Gestión web</p>
          <h2>Licencias y pagos</h2>
          <p>
            Este panel web queda centrado en pagos, URLs y generación de códigos. Los mensajes remotos y el bloqueo de la app se gestionarán desde la app creador.
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
        <div><span>Pagos</span><strong>URL</strong><small>Enlace de compra o donación</small></div>
      </div>

      <section className="admin-edit-card">
        <div className="admin-card-heading">
          <Save aria-hidden />
          <div>
            <h3>Pago, soporte y versión</h3>
            <p>Desde la web solo se editan enlaces y datos necesarios para pagos/licencias. Los bloqueos y mensajes se dejan para la app creador.</p>
          </div>
        </div>
        <div className="admin-form-grid">
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
        <div className="admin-actions-row">
          <button type="button" className="admin-primary-button" onClick={saveConfig}><Save aria-hidden /> Guardar datos</button>
        </div>
      </section>

      <section className="admin-edit-card">
        <div className="admin-card-heading">
          <ShieldCheck aria-hidden />
          <div>
            <h3>Mensajes y bloqueo remoto</h3>
            <p>Estos controles no se muestran en la web. Se reservarán para la app creador, para evitar cambios accidentales desde el panel público de administración.</p>
          </div>
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

      <p className="admin-status-line">{status}</p>
    </div>
  );
}
