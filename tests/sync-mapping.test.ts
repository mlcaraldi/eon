import { describe, expect, it } from "vitest";
import {
  mapTransaction,
  scrubDescription,
  syncWindow,
  toCentavos,
} from "@/lib/sync/mapping";

describe("toCentavos (bank payload in, integer out)", () => {
  it("converts decimals exactly", () => {
    expect(toCentavos(1234.56)).toBe(123456);
    expect(toCentavos(0.1 + 0.2)).toBe(30);
    expect(toCentavos(19.9)).toBe(1990);
    expect(toCentavos(1.15)).toBe(115);
    expect(toCentavos(0)).toBe(0);
  });
  it("rejects non-finite input", () => {
    expect(() => toCentavos(Number.NaN)).toThrow();
  });
});

describe("syncWindow", () => {
  it("first sync reaches 90 days back", () => {
    expect(syncWindow({ today: "2026-11-08", lastSyncedOn: null })).toEqual({
      from: "2026-08-10",
      to: "2026-11-08",
    });
  });
  it("later syncs overlap the last one by 10 days", () => {
    expect(syncWindow({ today: "2026-11-08", lastSyncedOn: "2026-11-07" })).toEqual({
      from: "2026-10-28",
      to: "2026-11-08",
    });
  });
  it("never reaches back further than the first-sync window", () => {
    expect(syncWindow({ today: "2026-11-08", lastSyncedOn: "2026-01-01" }).from).toBe("2026-08-10");
  });
});

describe("scrubDescription", () => {
  it("removes CPF and CNPJ, formatted or not", () => {
    expect(scrubDescription("Pix enviado FULANO 123.456.789-09")).toBe("Pix enviado FULANO");
    expect(scrubDescription("Pix 12345678909 SICRANO")).toBe("Pix SICRANO");
    expect(scrubDescription("Boleto 12.345.678/0001-95 CONDOMINIO")).toBe("Boleto CONDOMINIO");
  });
  it("removes bank, branch and account numbers", () => {
    expect(scrubDescription("TED Ag 1234 Conta 56789-0 Banco 104")).toBe("TED");
  });
  it("keeps installment text and merchant names", () => {
    expect(scrubDescription("Mercado Livre Parcela 3/10")).toBe("Mercado Livre Parcela 3/10");
  });
});

describe("mapTransaction", () => {
  const base = {
    id: "tx-1",
    date: "2026-11-05T03:00:00.000Z",
    description: "Financiamento CAIXA",
    amount: 6495.31,
    type: "DEBIT",
    status: "POSTED",
    category: "Housing",
  };
  it("takes the sign from the type: debits are negative", () => {
    const r = mapTransaction(base);
    expect(r).toMatchObject({ kind: "line", line: { providerId: "tx-1", amountCentavos: -649531 } });
  });
  it("credits are positive, whatever the payload sign", () => {
    const r = mapTransaction({ ...base, type: "CREDIT", amount: -15126.9 });
    expect(r).toMatchObject({ kind: "line", line: { amountCentavos: 1512690 } });
  });
  it("skips pending lines", () => {
    expect(mapTransaction({ ...base, status: "PENDING" })).toEqual({ kind: "skipped", reason: "pending" });
  });
  it("uses the Sao Paulo calendar date, not UTC", () => {
    // 01:00 UTC on 6 nov is 22:00 on 5 nov in Sao Paulo.
    const r = mapTransaction({ ...base, date: "2026-11-06T01:00:00.000Z" });
    expect(r).toMatchObject({ kind: "line", line: { postedOn: "2026-11-05" } });
  });
  it("keeps the raw description and a scrubbed one", () => {
    const r = mapTransaction({ ...base, description: "Pix FULANO 123.456.789-09" });
    expect(r).toMatchObject({
      kind: "line",
      line: { rawDescription: "Pix FULANO 123.456.789-09", description: "Pix FULANO" },
    });
  });
  it("rejects a payload without an id: untrusted input", () => {
    expect(mapTransaction({ ...base, id: "" })).toEqual({ kind: "invalid", reason: expect.any(String) });
    expect(mapTransaction({ nope: true })).toMatchObject({ kind: "invalid" });
  });
  it("two identical lines with different ids stay two lines", () => {
    const a = mapTransaction({ ...base, id: "a" });
    const b = mapTransaction({ ...base, id: "b" });
    expect(a).toMatchObject({ line: { providerId: "a" } });
    expect(b).toMatchObject({ line: { providerId: "b" } });
  });
});
