import { NextRequest, NextResponse } from "next/server";
import { incrementCounter, type CounterName } from "@/lib/counters";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const publicEvents: Record<string, CounterName> = {
  visit: "visits",
  download: "downloads",
  donation: "donations",
};

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  const counter = publicEvents[String(payload.type || "")];

  if (!counter) {
    return NextResponse.json({ ok: false, message: "Evento no valido." }, { status: 400 });
  }

  await incrementCounter(counter).catch(() => null);
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
