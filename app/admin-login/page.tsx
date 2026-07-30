"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LockKeyhole } from "lucide-react";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/administracion";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password, token }),
    });
    const result = await response.json().catch(() => ({ message: "No se pudo iniciar sesión." }));
    setLoading(false);
    if (response.ok) {
      window.location.href = next;
      return;
    }
    setStatus(result.message || "Credenciales incorrectas.");
  }

  return (
    <section className="page-hero admin-login-page">
      <div className="admin-login-card">
        <LockKeyhole aria-hidden />
        <p className="eyebrow">Acceso restringido</p>
        <h1>Administración</h1>
        <p>Inicia sesión para editar la web, subir el APK o modificar actualizaciones.</p>
        <form className="admin-login-form" onSubmit={submit}>
          <label>
            Usuario
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="admin" />
          </label>
          <label>
            Contraseña
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
          </label>
          <label>
            Token alternativo
            <input value={token} onChange={(event) => setToken(event.target.value)} type="password" autoComplete="off" placeholder="Opcional" />
          </label>
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? "Comprobando..." : "Entrar"}
          </button>
        </form>
        {status ? <p className="admin-status" role="alert">{status}</p> : null}
      </div>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<section className="page-hero admin-login-page"><p>Cargando acceso...</p></section>}>
      <AdminLoginForm />
    </Suspense>
  );
}
