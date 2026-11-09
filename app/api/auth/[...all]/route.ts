import { toNextJsHandler } from "better-auth/next-js";
import { readConfig } from "@/lib/config";
import { getAuth } from "@/lib/auth";

function notConfigured() {
  const { auth, database } = readConfig(process.env);
  return Response.json(
    { error: "Sign-in is not configured.", missing: [...database.missing, ...auth.missing] },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  const c = readConfig(process.env);
  if (!c.auth.ready || !c.database.ready) return notConfigured();
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request: Request) {
  const c = readConfig(process.env);
  if (!c.auth.ready || !c.database.ready) return notConfigured();
  return toNextJsHandler(getAuth()).POST(request);
}
