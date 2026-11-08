// Sample month for the design-system phase (docs/design/KICKOFF.md step 4).
// Replaced by real data in phase 4. Today is fixed so the statuses are stable.

import { commitmentStatus } from "@/lib/status";
import { formatBRL, formatDateShort } from "@/lib/format";
import type { CommitmentView } from "@/lib/types";

export const SAMPLE_TODAY = "2026-11-08";
export const SAMPLE_MONTH = "2026-11";

type Seed = Omit<CommitmentView, "status" | "reason"> & { matchedOn?: string };

const seeds: Seed[] = [
  { id: "salary", name: "Salário", category: "income", dueDate: "2026-11-05", amount: 1512690, direction: "in", bank: "caixa", matchedOn: "2026-11-05" },
  { id: "financing", name: "Financiamento Caixa", category: "housing", dueDate: "2026-11-05", amount: 649531, direction: "out", bank: "caixa", matchedOn: "2026-11-05" },
  { id: "rge", name: "RGE", category: "utilities", dueDate: "2026-11-10", amount: 33018, direction: "out", bank: "nubank" },
  { id: "condo", name: "Condomínio", category: "housing", dueDate: "2026-11-15", amount: 63176, direction: "out", bank: "caixa" },
  { id: "invoice", name: "Nubank card invoice", category: "card", dueDate: "2026-11-17", amount: 821440, direction: "out", bank: "nubank" },
];

function reason(seed: Seed, status: CommitmentView["status"]): string {
  const money = formatBRL(seed.amount);
  switch (status) {
    case "paid":
      return `Matched to a ${seed.direction === "in" ? "credit" : "debit"} of ${money} on ${formatDateShort(seed.matchedOn!)}.`;
    case "due-soon":
      return `Due ${formatDateShort(seed.dueDate)}. No matching debit yet.`;
    case "overdue":
      return `Due ${formatDateShort(seed.dueDate)}. No matching debit found.`;
    default:
      return `No matching debit yet. Due ${formatDateShort(seed.dueDate)}.`;
  }
}

export const sampleCommitments: CommitmentView[] = seeds.map((seed) => {
  const status = commitmentStatus({ dueDate: seed.dueDate, matched: Boolean(seed.matchedOn), today: SAMPLE_TODAY });
  const { matchedOn, ...rest } = seed;
  void matchedOn;
  return { ...rest, status, reason: reason(seed, status) };
});
