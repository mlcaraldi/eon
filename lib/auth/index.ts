import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { readConfig } from "@/lib/config";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { isAllowedEmail } from "@/lib/auth/rules";

function create() {
  const allowed = readConfig(process.env).allowedEmail;
  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    // Only the allow-listed Google account can ever create a user.
    databaseHooks: {
      user: {
        create: { before: async (u) => isAllowedEmail(u.email, allowed) },
      },
    },
    plugins: [nextCookies()],
  });
}

let instance: ReturnType<typeof create> | undefined;

/** Throws when auth is not configured; callers check readConfig(process.env).auth first. */
export function getAuth() {
  instance ??= create();
  return instance;
}

/** The signed-in user's session, or null. Identity comes from here, never from the client. */
export async function getSession() {
  return getAuth().api.getSession({ headers: await headers() });
}
