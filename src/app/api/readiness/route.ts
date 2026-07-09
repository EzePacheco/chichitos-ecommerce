import { getReadiness } from "@/server/readiness/readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = await getReadiness();

  return Response.json(readiness, { status: readiness.ready ? 200 : 503 });
}
