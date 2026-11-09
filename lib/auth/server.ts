import { createNeonAuth } from "@neon/auth/next/server";
import { readConfig } from "@/lib/config";
import { isAllowedUser } from "@/lib/auth/rules";

function create() {
  return createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL ?? "",
    cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET ?? "" },
  });
}

let instance: ReturnType<typeof create> | undefined;

/** Throws when auth is not configured; callers check readConfig(process.env).auth first. */
export function getAuth() {
  instance ??= create();
  return instance;
}

export type SessionState =
  | { state: "signed-out" }
  | { state: "not-invited" }
  | { state: "ok"; user: { id: string; email: string } };

/**
 * Who is asking. Identity comes from here, never from the client. Anyone can
 * create a Neon Auth user, so a valid session for any address but the allowed,
 * verified one is "not-invited", not access.
 */
export async function getSessionState(): Promise<SessionState> {
  const { data } = await getAuth().getSession();
  const user = data?.user;
  if (!user) return { state: "signed-out" };
  const allowed = readConfig(process.env).allowedEmail;
  if (!isAllowedUser({ email: user.email, emailVerified: Boolean(user.emailVerified) }, allowed)) {
    return { state: "not-invited" };
  }
  return { state: "ok", user: { id: user.id, email: user.email } };
}
