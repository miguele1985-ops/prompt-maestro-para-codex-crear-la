"use client";

import { Download, Euro, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type PublicStats = {
  visits: number;
  downloads: number;
  donationClicks: number;
  donatedEuros: string;
};

const emptyStats: PublicStats = {
  visits: 0,
  downloads: 0,
  donationClicks: 0,
  donatedEuros: "0 €",
};

function formatCount(value: number) {
  return new Intl.NumberFormat("es-ES").format(Math.max(0, value || 0));
}

export function PublicHomeCounters({ donatedEuros }: { donatedEuros?: string }) {
  const [stats, setStats] = useState<PublicStats>({
    ...emptyStats,
    donatedEuros: donatedEuros?.trim() || emptyStats.donatedEuros,
  });

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadStats = () => {
      fetch("/api/public-stats", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: PublicStats | null) => {
          if (!cancelled && data) {
            setStats({
              ...data,
              donatedEuros: data.donatedEuros || donatedEuros?.trim() || emptyStats.donatedEuros,
            });
          }
        })
        .catch(() => null);
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(loadStats, { timeout: 3500 });
    } else {
      timeoutId = setTimeout(loadStats, 1800);
    }

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [donatedEuros]);

  const counters = [
    { label: "Visitas", value: formatCount(stats.visits), icon: TrendingUp },
    { label: "Descargas", value: formatCount(stats.downloads), icon: Download },
    { label: "Donado", value: stats.donatedEuros || "0 €", icon: Euro },
  ];

  return (
    <div className="hero-public-counters" aria-label="Contadores del proyecto">
      {counters.map((counter) => {
        const Icon = counter.icon;
        return (
          <div className="hero-public-counter" key={counter.label}>
            <Icon size={17} aria-hidden />
            <span>{counter.label}</span>
            <strong>{counter.value}</strong>
          </div>
        );
      })}
    </div>
  );
}
