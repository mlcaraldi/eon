"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatMonth } from "@/lib/format";
import { shiftMonth, type YearMonth } from "@/lib/dates";

type MonthSwitcherProps = { month: YearMonth; min: YearMonth; max: YearMonth };

export function MonthSwitcher({ month, min, max }: MonthSwitcherProps) {
  const router = useRouter();
  const go = (m: YearMonth) => router.push(`/?month=${m}`);
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Previous month" disabled={prev < min} onClick={() => go(prev)} className="min-h-touch min-w-touch">
        <ChevronLeft aria-hidden />
      </Button>
      <h1 className="min-w-40 text-center text-heading-2">{formatMonth(month)}</h1>
      <Button variant="ghost" size="icon" aria-label="Next month" disabled={next > max} onClick={() => go(next)} className="min-h-touch min-w-touch">
        <ChevronRight aria-hidden />
      </Button>
    </div>
  );
}
