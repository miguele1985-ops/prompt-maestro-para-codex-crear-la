"use client";

import { Copy, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title, url });
    else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    }
  }
  return (
    <div className="share-row">
      <button type="button" onClick={share}><Share2 size={17} aria-hidden /> Compartir</button>
      <button type="button" onClick={async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); }}>
        <Copy size={17} aria-hidden /> Copiar enlace
      </button>
      {copied ? <span>Enlace copiado</span> : null}
    </div>
  );
}
