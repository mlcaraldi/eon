import { describe, expect, it } from "vitest";
import {
  formatBRL,
  formatDateLong,
  formatDateShort,
  formatForecast,
  formatInstallment,
  formatMonth,
} from "@/lib/format";

describe("formatBRL", () => {
  it("formats centavos with pt-BR separators", () => {
    expect(formatBRL(123456)).toBe("R$ 1.234,56");
    expect(formatBRL(0)).toBe("R$ 0,00");
    expect(formatBRL(5)).toBe("R$ 0,05");
    expect(formatBRL(100000000)).toBe("R$ 1.000.000,00");
  });
  it("uses U+2212 for negatives", () => {
    expect(formatBRL(-54475)).toBe("−R$ 544,75");
  });
  it("adds + only when signed and positive", () => {
    expect(formatBRL(1512690, { signed: true })).toBe("+R$ 15.126,90");
    expect(formatBRL(0, { signed: true })).toBe("R$ 0,00");
    expect(formatBRL(-100, { signed: true })).toBe("−R$ 1,00");
    expect(formatBRL(1512690)).toBe("R$ 15.126,90");
  });
  it("uses a plain space between symbol and number", () => {
    expect(formatBRL(100)).not.toMatch(/ /);
  });
  it("rejects non-integers: money is integer centavos", () => {
    expect(() => formatBRL(10.5)).toThrow();
    expect(() => formatBRL(Number.NaN)).toThrow();
  });
});

describe("dates", () => {
  it("short", () => {
    expect(formatDateShort("2026-11-10")).toBe("10 nov");
    expect(formatDateShort("2027-01-03")).toBe("03 jan");
  });
  it("long", () => {
    expect(formatDateLong("2026-11-10")).toBe("10/11/2026");
  });
  it("month", () => {
    expect(formatMonth("2026-11")).toBe("November 2026");
    expect(formatMonth("2027-01")).toBe("January 2027");
  });
  it("is not shifted by the machine timezone", () => {
    const prev = process.env.TZ;
    process.env.TZ = "Pacific/Auckland";
    expect(formatDateShort("2026-11-01")).toBe("01 nov");
    process.env.TZ = prev;
  });
  it("rejects malformed dates", () => {
    expect(() => formatDateShort("2026-13-01")).toThrow();
    expect(() => formatDateShort("10/11/2026")).toThrow();
  });
});

describe("installments and forecast", () => {
  it("formats installments", () => {
    expect(formatInstallment(3, 10)).toBe("3/10");
    expect(formatInstallment(10, 10)).toBe("10/10 · last");
  });
  it("prefixes forecasts with ≈", () => {
    expect(formatForecast(123456)).toBe("≈ R$ 1.234,56");
    expect(formatForecast(-54475)).toBe("≈ −R$ 544,75");
  });
});
