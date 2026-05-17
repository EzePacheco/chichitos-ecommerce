import { ok } from "@/server/http/responses";

export const dynamic = "force-dynamic";

export function GET() {
  return ok({
    service: "chichitos-web",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
