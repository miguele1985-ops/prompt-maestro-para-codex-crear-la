import { NextResponse } from "next/server";
import { siteConfig } from "@/content/site-config";
import { readAdminContent } from "@/lib/admin-content";
import { readSiteStats } from "@/lib/counters";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function safeEuros(value: string | undefined) {
  const text = String(value || "").trim();
  if (!text || /configurar|pendiente|añadir/i.test(text)) return "0 €";
  return text.includes("€") ? text : `${text} €`;
}

async function readDonatedEuros() {
  try {
    const content = await readAdminContent();
    const donations = content?.site?.donations;
    if (donations && typeof donations === "object" && "donatedEuros" in donations) {
      return safeEuros(String((donations as { donatedEuros?: unknown }).donatedEuros || ""));
    }
  } catch {
    // The public counters must keep working even if editable content is unavailable.
  }

  return safeEuros(siteConfig.donations.donatedEuros);
}

export async function GET() {
  try {
    const [stats, donatedEuros] = await Promise.all([readSiteStats(), readDonatedEuros()]);
    return NextResponse.json(
      {
        configured: stats.configured,
        visits: stats.visits.total,
        downloads: stats.downloads.total,
        donationClicks: stats.donations.total,
        donatedEuros,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        configured: false,
        visits: 0,
        downloads: 0,
        donationClicks: 0,
        donatedEuros: safeEuros(siteConfig.donations.donatedEuros),
      },
      { headers: { "cache-control": "no-store" } },
    );
  }
}
