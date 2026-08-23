"use client";

import { Download, Euro, HeartHandshake, TrendingUp } from "lucide-react";
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

    fetch("/api/public-stats", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PublicStats | null) => {
        if (!cancelled && data) setStats(data);
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, []);

  const counters = [
    { label: "Visitas", value: formatCount(stats.visits), icon: TrendingUp },
    { label: "Descargas", value: formatCount(stats.downloads), icon: Download },
    { label: "Clics en donar", value: formatCount(stats.donationClicks), icon: HeartHandshake },
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
