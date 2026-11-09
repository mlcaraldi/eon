import { CreditCard } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Amount } from "@/components/eon/amount";
import { BankBadge } from "@/components/eon/bank-badge";
import { CategoryChip } from "@/components/eon/category-chip";
import { StatusPill } from "@/components/eon/status-pill";
import { formatDateShort } from "@/lib/format";
import type { CommitmentView } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * One commitment. Phone: name and amount on top, details below.
 * Desktop (lg): a 44 px table row. The status pill opens its reason, so the
 * "why" is always one tap from the status (docs/onboarding.md).
 */
export function CommitmentRow({ commitment: c }: { commitment: CommitmentView }) {
  const isIncome = c.direction === "in";
  const settled = c.status === "paid";
  return (
    <li
      className={cn(
        "grid min-h-row grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b px-gutter py-3 last:border-b-0",
        "lg:grid-cols-[minmax(0,2fr)_6rem_8rem_10rem_9rem] lg:py-0",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {c.category === "card" && (
          <CreditCard aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        )}
        <span className="truncate text-ui font-medium">{c.name}</span>
        <CategoryChip category={c.category} className="hidden lg:inline-flex" />
      </div>
      <Amount
        value={isIncome ? c.amount : -c.amount}
        signed={isIncome}
        tone={isIncome ? "income" : settled ? "muted" : "default"}
        className="col-start-2 row-start-1 justify-self-end lg:col-start-4 lg:row-start-auto"
      />
      <div className="col-start-1 flex flex-wrap items-center gap-x-3 gap-y-1 lg:contents">
        <span className="text-caption text-muted-foreground lg:col-start-2 lg:row-start-1 lg:text-ui">
          {formatDateShort(c.dueDate)}
        </span>
        <BankBadge bank={c.bank} state="connected" compact className="lg:col-start-3 lg:row-start-1" />
        <CategoryChip category={c.category} className="lg:hidden" />
      </div>
      <div className="col-start-2 row-start-2 justify-self-end lg:col-start-5 lg:row-start-1">
        <Popover>
          <PopoverTrigger
            className="-m-1 rounded-md p-1 focus-visible:outline-2"
            aria-label={`${c.name}: why this status`}
          >
            <StatusPill status={c.status} direction={c.direction} />
          </PopoverTrigger>
          <PopoverContent className="text-ui" align="end">
            {c.reason}
          </PopoverContent>
        </Popover>
      </div>
    </li>
  );
}
