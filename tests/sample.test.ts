import { describe, expect, it } from "vitest";
import { sampleCommitments } from "@/lib/sample/november-2026";
import { summarizeMonth } from "@/lib/status";

describe("november 2026 sample (KICKOFF step 4)", () => {
  it("derives the statuses of the canvas", () => {
    expect(Object.fromEntries(sampleCommitments.map((c) => [c.id, c.status]))).toEqual({
      salary: "paid",
      financing: "paid",
      rge: "due-soon",
      condo: "pending",
      invoice: "pending",
    });
  });
  it("sums to the expected summary", () => {
    const s = summarizeMonth(
      sampleCommitments.map((c) => ({ direction: c.direction, amount: c.amount, status: c.status })),
    );
    expect(s.due).toBe(1567165);
    expect(s.paid).toBe(649531);
    expect(s.paidPercent).toBe(41);
    expect(s.pending).toBe(917634);
    expect(s.surplus).toBe(-54475);
  });
});
