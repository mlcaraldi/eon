import { describe, expect, it } from "vitest";
import {
  addDays,
  daysBetween,
  monthOf,
  shiftMonth,
  todayInSaoPaulo,
} from "@/lib/dates";

describe("todayInSaoPaulo", () => {
  it("uses the Sao Paulo calendar date, not UTC", () => {
    // 01:30 UTC on 9 nov is 22:30 on 8 nov in Sao Paulo (UTC-3).
    expect(todayInSaoPaulo(new Date("2026-11-09T01:30:00Z"))).toBe("2026-11-08");
    expect(todayInSaoPaulo(new Date("2026-11-09T03:00:00Z"))).toBe("2026-11-09");
  });
});

describe("calendar math", () => {
  it("daysBetween counts whole days", () => {
    expect(daysBetween("2026-11-08", "2026-11-10")).toBe(2);
    expect(daysBetween("2026-11-10", "2026-11-08")).toBe(-2);
    expect(daysBetween("2026-10-31", "2026-11-01")).toBe(1);
  });
  it("addDays crosses month and year", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
  it("monthOf and shiftMonth", () => {
    expect(monthOf("2026-11-08")).toBe("2026-11");
    expect(shiftMonth("2026-11", 2)).toBe("2027-01");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
  });
});
