// Which optional integrations are configured. Reads names only, never exposes
// values, so the result is safe to show: a feature without its variables says
// what is missing instead of failing (AGENTS.md, env vars and secrets).

type Env = Record<string, string | undefined>;
export type FeatureStatus = { ready: boolean; missing: string[] };

const present = (env: Env, name: string, minLength = 1) =>
  (env[name]?.trim().length ?? 0) >= minLength;

function feature(env: Env, names: string[], minLengths: Record<string, number> = {}): FeatureStatus {
  const missing = names.filter((n) => !present(env, n, minLengths[n] ?? 1));
  return { ready: missing.length === 0, missing };
}

export function readConfig(env: Env) {
  return {
    database: feature(env, ["DATABASE_URL"]),
    auth: feature(
      env,
      ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "EON_ALLOWED_EMAIL"],
      { BETTER_AUTH_SECRET: 32 },
    ),
    openFinance: feature(env, ["PLUGGY_CLIENT_ID", "PLUGGY_CLIENT_SECRET"]),
    cron: feature(env, ["CRON_SECRET"], { CRON_SECRET: 16 }),
    allowedEmail: env.EON_ALLOWED_EMAIL?.trim().toLowerCase() || null,
  };
}

export type Config = ReturnType<typeof readConfig>;
