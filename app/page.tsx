import Image from "next/image";
import { redirect } from "next/navigation";
import { CommitmentRow } from "@/components/eon/commitment-row";
import { MonthSummary } from "@/components/eon/month-summary";
import { MonthSwitcher } from "@/components/eon/month-switcher";
import { EmptyState } from "@/components/eon/states";
import { ThemeToggle } from "@/components/eon/theme-toggle";
import { getSession } from "@/lib/auth";
import { readConfig } from "@/lib/config";
import { monthOf, parseMonth, shiftMonth } from "@/lib/dates";
import { formatMonth } from "@/lib/format";
import { SAMPLE_MONTH, SAMPLE_TODAY, sampleCommitments } from "@/lib/sample/november-2026";
import { summarizeMonth } from "@/lib/status";

export default async function Home({ searchParams }: PageProps<"/">) {
  // Once sign-in is configured the app is private; until then the sample shows.
  const config = readConfig(process.env);
  if (config.auth.ready && config.database.ready && !(await getSession())) redirect("/sign-in");

  const params = await searchParams;
  const raw = typeof params.month === "string" ? params.month : SAMPLE_MONTH;
  let month = SAMPLE_MONTH;
  try {
    parseMonth(raw);
    month = raw;
  } catch {
    // Unknown month in the URL: fall back to the sample month.
  }
  const min = SAMPLE_MONTH;
  const max = shiftMonth(monthOf(SAMPLE_TODAY), 12);
  if (month < min) month = min;
  if (month > max) month = max;

  const hasData = month === SAMPLE_MONTH;
  const summary = summarizeMonth(
    sampleCommitments.map((c) => ({ direction: c.direction, amount: c.amount, status: c.status })),
  );

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6 px-gutter py-4 lg:py-8">
      <header className="flex items-center justify-between">
        <Image src="/brand/eon-horizontal-light.svg" alt="Eon" width={96} height={28} className="dark:hidden" priority />
        <Image src="/brand/eon-horizontal-dark.svg" alt="" aria-hidden width={96} height={28} className="hidden dark:block" priority />
        <ThemeToggle />
      </header>
      <MonthSwitcher month={month} min={min} max={max} />
      {hasData ? (
        <>
          <MonthSummary month={month} {...summary} />
          <section aria-label="Commitments" className="rounded-lg border bg-card">
            <ul>
              {sampleCommitments.map((c) => (
                <CommitmentRow key={c.id} commitment={c} />
              ))}
            </ul>
          </section>
          <p className="text-caption text-muted-foreground">
            Sample data. Eon marks a commitment paid when a matching line leaves your account; you never mark anything yourself.
          </p>
        </>
      ) : (
        <EmptyState
          title={`Nothing planned for ${formatMonth(month).split(" ")[0]}.`}
          body="Forecasts appear after commitments are set."
        />
      )}
    </div>
  );
}
