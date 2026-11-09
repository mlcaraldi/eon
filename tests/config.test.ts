import { describe, expect, it } from "vitest";
import { readConfig } from "@/lib/config";

const full = {
  DATABASE_URL: "postgres://x",
  NEON_AUTH_BASE_URL: "https://ep-x.neonauth.example/neondb/auth",
  NEON_AUTH_COOKIE_SECRET: "a".repeat(32),
  EON_ALLOWED_EMAIL: "me@example.com",
  PLUGGY_CLIENT_ID: "pid",
  PLUGGY_CLIENT_SECRET: "psecret",
  CRON_SECRET: "c".repeat(16),
};

describe("readConfig", () => {
  it("reports every feature ready with a full environment", () => {
    const c = readConfig(full);
    expect(c.database).toEqual({ ready: true, missing: [] });
    expect(c.auth).toEqual({ ready: true, missing: [] });
    expect(c.openFinance).toEqual({ ready: true, missing: [] });
    expect(c.cron).toEqual({ ready: true, missing: [] });
  });
  it("names exactly what is missing, per feature", () => {
    const c = readConfig({});
    expect(c.database.missing).toEqual(["DATABASE_URL"]);
    expect(c.auth.missing).toEqual([
      "NEON_AUTH_BASE_URL",
      "NEON_AUTH_COOKIE_SECRET",
      "EON_ALLOWED_EMAIL",
    ]);
    expect(c.openFinance.missing).toEqual(["PLUGGY_CLIENT_ID", "PLUGGY_CLIENT_SECRET"]);
    expect(c.cron.missing).toEqual(["CRON_SECRET"]);
  });
  it("treats empty strings as missing", () => {
    expect(readConfig({ ...full, DATABASE_URL: "" }).database.ready).toBe(false);
  });
  it("treats a short auth secret as missing", () => {
    const c = readConfig({ ...full, NEON_AUTH_COOKIE_SECRET: "short" });
    expect(c.auth.ready).toBe(false);
    expect(c.auth.missing).toEqual(["NEON_AUTH_COOKIE_SECRET"]);
  });
  it("never returns values, only names", () => {
    expect(JSON.stringify(readConfig(full))).not.toContain("secret");
  });
  it("lowercases and trims the allowed email", () => {
    expect(readConfig({ ...full, EON_ALLOWED_EMAIL: " Me@Example.com " }).allowedEmail).toBe("me@example.com");
    expect(readConfig({}).allowedEmail).toBeNull();
  });
});
