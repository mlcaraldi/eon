import { Amount } from "@/components/eon/amount";
import { formatMonth } from "@/lib/format";
import type { YearMonth } from "@/lib/dates";

type MonthSummaryProps = {
  month: YearMonth;
  income: number;
  due: number;
  paid: number;
  pending: number;
  paidPercent: number;
  surplus: number;
};

function Figure({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-label text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Answer first: the number that can be invested, then where it comes from. */
export function MonthSummary({ month, income, due, paid, pending, paidPercent, surplus }: MonthSummaryProps) {
  return (
    <section aria-label={`Summary for ${formatMonth(month)}`} className="rounded-lg border bg-card p-gutter">
      <p className="text-label text-muted-foreground">Available to invest</p>
      <Amount value={surplus} size="hero" className="block" />
      <p className="mt-1 text-caption text-muted-foreground">
        {surplus < 0 ? "Not enough this month. " : ""}
        Income minus everything due in {formatMonth(month)}.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 lg:grid-cols-4">
        <Figure label="Income">
          <Amount value={income} size="lg" tone="income" signed />
        </Figure>
        <Figure label="Total due">
          <Amount value={due} size="lg" />
        </Figure>
        <Figure label={`Paid · ${paidPercent}%`}>
          <Amount value={paid} size="lg" tone="muted" />
        </Figure>
        <Figure label="Still pending">
          <Amount value={pending} size="lg" />
        </Figure>
      </dl>
    </section>
  );
}
