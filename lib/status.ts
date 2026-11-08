import { daysBetween, type CalendarDate } from "@/lib/dates";

export type CommitmentStatus = "paid" | "pending" | "due-soon" | "overdue";

/**
 * D4: a commitment is paid only when a bank line backs it. Due soon is 0 to
 * 3 days before the due date (the due day included); overdue is past due
 * with no matched line.
 */
export function commitmentStatus(input: {
  dueDate: CalendarDate;
  matched: boolean;
  today: CalendarDate;
}): CommitmentStatus {
  if (input.matched) return "paid";
  const daysLeft = daysBetween(input.today, input.dueDate);
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 3) return "due-soon";
  return "pending";
}

export type SummaryItem = {
  direction: "in" | "out";
  /** Positive integer centavos. */
  amount: number;
  status: CommitmentStatus;
};

/** Month totals in centavos. `surplus` = income − due. */
export function summarizeMonth(items: SummaryItem[]) {
  let income = 0;
  let due = 0;
  let paid = 0;
  for (const item of items) {
    if (item.direction === "in") {
      income += item.amount;
    } else {
      due += item.amount;
      if (item.status === "paid") paid += item.amount;
    }
  }
  return {
    income,
    due,
    paid,
    pending: due - paid,
    paidPercent: due === 0 ? 0 : Math.round((paid / due) * 100),
    surplus: income - due,
  };
}
