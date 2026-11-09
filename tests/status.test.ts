import { describe, expect, it } from "vitest";
import { commitmentStatus, summarizeMonth } from "@/lib/status";

describe("commitmentStatus (D4)", () => {
  const due = "2026-11-10";
  it("is paid whenever a bank line backs it, whatever the date", () => {
    expect(commitmentStatus({ dueDate: due, matched: true, today: "2026-11-01" })).toBe("paid");
    expect(commitmentStatus({ dueDate: due, matched: true, today: "2026-12-01" })).toBe("paid");
  });
  it("is due-soon from 3 days before through the due day", () => {
    expect(commitmentStatus({ dueDate: due, matched: false, today: "2026-11-06" })).toBe("pending");
    expect(commitmentStatus({ dueDate: due, matched: false, today: "2026-11-07" })).toBe("due-soon");
    expect(commitmentStatus({ dueDate: due, matched: false, today: "2026-11-10" })).toBe("due-soon");
  });
  it("is overdue the day after the due date with no match", () => {
    expect(commitmentStatus({ dueDate: due, matched: false, today: "2026-11-11" })).toBe("overdue");
  });
  it("is pending when far from the due date", () => {
    expect(commitmentStatus({ dueDate: "2026-11-15", matched: false, today: "2026-11-08" })).toBe("pending");
  });
});

describe("summarizeMonth (canvas Screen 1, today 08 nov 2026)", () => {
  const items = [
    { direction: "in" as const, amount: 1512690, status: "paid" as const },
    { direction: "out" as const, amount: 649531, status: "paid" as const },
    { direction: "out" as const, amount: 33018, status: "due-soon" as const },
    { direction: "out" as const, amount: 63176, status: "pending" as const },
    { direction: "out" as const, amount: 821440, status: "pending" as const },
  ];
  it("matches the handoff numbers", () => {
    expect(summarizeMonth(items)).toEqual({
      income: 1512690,
      due: 1567165,
      paid: 649531,
      pending: 917634,
      paidPercent: 41,
      surplus: -54475,
    });
  });
  it("percent is 0 when nothing is due, not NaN", () => {
    expect(summarizeMonth([]).paidPercent).toBe(0);
  });
});
