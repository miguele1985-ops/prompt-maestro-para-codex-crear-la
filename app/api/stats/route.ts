import { NextResponse } from "next/server";
import { readSiteStats } from "@/lib/counters";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await readSiteStats(), {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        visits: 0,
        downloads: 0,
        donations: 0,
        message: error instanceof Error ? error.message : "No se pudieron leer los contadores reales.",
      },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
