import { NextRequest, NextResponse } from "next/server";
import { incrementCounter, type CounterName } from "@/lib/counters";
import { forbiddenOriginResponse, hasValidBrowserOrigin, isRateLimited, rateLimitKey, rateLimitResponse } from "@/lib/request-security";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const publicEvents: Record<string, CounterName> = {
  visit: "visits",
  download: "downloads",
  donation: "donations",
};

export async function POST(request: NextRequest) {
  if (!hasValidBrowserOrigin(request)) return forbiddenOriginResponse();

  const payload = (await request.json().catch(() => ({}))) as { type?: string };
  const counter = publicEvents[String(payload.type || "")];

  if (!counter) {
    return NextResponse.json({ ok: false, message: "Evento no valido." }, { status: 400 });
  }

  const limits: Record<CounterName, { limit: number; windowSeconds: number }> = {
    visits: { limit: 6, windowSeconds: 60 * 60 },
    downloads: { limit: 5, windowSeconds: 60 * 60 },
    donations: { limit: 10, windowSeconds: 60 * 60 },
  };
  const selected = limits[counter];
  if (await isRateLimited({
    key: rateLimitKey(request, `stats-${counter}`, selected.windowSeconds),
    limit: selected.limit,
    windowSeconds: selected.windowSeconds,
  })) {
    return rateLimitResponse("Evento limitado temporalmente.");
  }

  await incrementCounter(counter).catch(() => null);
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
