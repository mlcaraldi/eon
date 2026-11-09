import { readConfig } from "@/lib/config";
import { getAuth } from "@/lib/auth/server";

function notConfigured() {
  return Response.json(
    { error: "Sign-in is not configured.", missing: readConfig(process.env).auth.missing },
    { status: 503 },
  );
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, ctx: Ctx) {
  if (!readConfig(process.env).auth.ready) return notConfigured();
  return getAuth().handler().GET(request, ctx);
}

export async function POST(request: Request, ctx: Ctx) {
  if (!readConfig(process.env).auth.ready) return notConfigured();
  return getAuth().handler().POST(request, ctx);
}
