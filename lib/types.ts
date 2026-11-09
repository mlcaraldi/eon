import type { CalendarDate } from "@/lib/dates";
import type { CommitmentStatus } from "@/lib/status";

export type CategoryId =
  | "income"
  | "card"
  | "housing"
  | "utilities"
  | "groceries"
  | "dining"
  | "transport"
  | "health"
  | "education"
  | "shopping"
  | "leisure"
  | "subscriptions"
  | "other";

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  income: "Income",
  card: "Card",
  housing: "Housing",
  utilities: "Utilities",
  groceries: "Groceries",
  dining: "Dining",
  transport: "Transport",
  health: "Health",
  education: "Education",
  shopping: "Shopping",
  leisure: "Leisure",
  subscriptions: "Subscriptions",
  other: "Other",
};

export type BankId = "nubank" | "caixa";

export const BANK_LABELS: Record<BankId, string> = {
  nubank: "Nubank",
  caixa: "Caixa",
};

/** What the month view needs to render one commitment. Amount is positive centavos. */
export type CommitmentView = {
  id: string;
  name: string;
  category: CategoryId;
  dueDate: CalendarDate;
  amount: number;
  direction: "in" | "out";
  status: CommitmentStatus;
  bank: BankId;
  /** One line saying why the status is what it is (onboarding.md). */
  reason: string;
};
