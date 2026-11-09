import { z } from "zod";
import { addDays, todayInSaoPaulo, type CalendarDate } from "@/lib/dates";

// Pure mapping from an Open Finance (Pluggy) transaction to a bank line.
// The provider payload is untrusted input: it is validated before use.
// Field shapes here are confirmed or corrected by the phase 1 spike.

export const FIRST_SYNC_DAYS = 90;
export const OVERLAP_DAYS = 10;

/** Bank payload in: a decimal number with at most 2 decimals becomes integer centavos. */
export function toCentavos(value: number): number {
  if (!Number.isFinite(value)) throw new Error(`Not a finite amount: ${value}`);
  return Math.round(value * 100);
}

export function syncWindow(input: { today: CalendarDate; lastSyncedOn: CalendarDate | null }) {
  const floor = addDays(input.today, -FIRST_SYNC_DAYS);
  if (!input.lastSyncedOn) return { from: floor, to: input.today };
  const overlap = addDays(input.lastSyncedOn, -OVERLAP_DAYS);
  return { from: overlap < floor ? floor : overlap, to: input.today };
}

/** Removes tax ids, bank, branch and account numbers (what may leave Eon, AGENTS.md). */
export function scrubDescription(text: string): string {
  return text
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "") // CNPJ
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "") // CPF
    .replace(/\b(ag(ência|encia)?|conta|banco|cc)\.?\s*:?\s*[\d.-]+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const transactionSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(10),
  description: z.string(),
  amount: z.number().finite(),
  type: z.enum(["DEBIT", "CREDIT"]),
  status: z.enum(["POSTED", "PENDING"]).optional(),
  category: z.string().nullish(),
});

export type MappedLine = {
  providerId: string;
  postedOn: CalendarDate;
  /** Signed integer centavos: negative leaves the account. */
  amountCentavos: number;
  rawDescription: string;
  description: string;
  providerCategory: string | null;
};

export type MapResult =
  | { kind: "line"; line: MappedLine }
  | { kind: "skipped"; reason: "pending" }
  | { kind: "invalid"; reason: string };

export function mapTransaction(payload: unknown): MapResult {
  const parsed = transactionSchema.safeParse(payload);
  if (!parsed.success) return { kind: "invalid", reason: parsed.error.issues[0]?.message ?? "invalid" };
  const t = parsed.data;
  if (t.status === "PENDING") return { kind: "skipped", reason: "pending" };
  const date = new Date(t.date);
  if (Number.isNaN(date.getTime())) return { kind: "invalid", reason: "bad date" };
  const abs = Math.abs(toCentavos(t.amount));
  return {
    kind: "line",
    line: {
      providerId: t.id,
      postedOn: todayInSaoPaulo(date),
      amountCentavos: t.type === "DEBIT" ? -abs : abs,
      rawDescription: t.description,
      description: scrubDescription(t.description),
      providerCategory: t.category ?? null,
    },
  };
}
