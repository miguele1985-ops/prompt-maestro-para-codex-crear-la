import { requireAdminToken } from "../_utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const tokenError = await requireAdminToken(request);
  if (tokenError) return tokenError;
  return Response.json({ ok: true });
}
