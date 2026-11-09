import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import { bankAccounts, bankLines, syncRuns } from "@/lib/db/schema";

describe("schema rules (AGENTS.md)", () => {
  it("dedups bank lines by the provider id per account", () => {
    const { uniqueConstraints } = getTableConfig(bankLines);
    const cols = uniqueConstraints.map((u) => u.columns.map((c) => c.name));
    expect(cols).toContainEqual(["account_id", "provider_id"]);
  });
  it("never uniquely constrains amount and date together", () => {
    const { uniqueConstraints } = getTableConfig(bankLines);
    const names = uniqueConstraints.flatMap((u) => u.columns.map((c) => c.name));
    expect(names).not.toContain("amount_centavos");
  });
  it("stores money as integer centavos, not decimals or floats", () => {
    for (const col of [bankLines.amountCentavos, bankAccounts.balanceCentavos]) {
      expect(col.dataType).toBe("number");
      expect(col.columnType).toBe("PgBigInt53");
    }
  });
  it("keeps unknown as NULL: balance and consent expiry are nullable", () => {
    expect(bankAccounts.balanceCentavos.notNull).toBe(false);
    expect(bankAccounts.consentExpiresOn.notNull).toBe(false);
  });
  it("stores dates as calendar dates", () => {
    expect(bankLines.postedOn.columnType).toBe("PgDateString");
    expect(syncRuns.windowFrom.columnType).toBe("PgDateString");
  });
  it("scopes every Eon table to an owner", () => {
    expect(bankAccounts.ownerId.notNull).toBe(true);
    expect(bankLines.ownerId.notNull).toBe(true);
    expect(syncRuns.ownerId.notNull).toBe(true);
  });
});
