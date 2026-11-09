// Calendar dates are "YYYY-MM-DD" strings and months are "YYYY-MM" strings.
// They carry no time of day and are never run through local-timezone Date
// methods (AGENTS.md). UTC arithmetic below is only a calendar calculator.

export type CalendarDate = string;
export type YearMonth = string;

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH = /^(\d{4})-(\d{2})$/;
const DAY_MS = 86_400_000;

function utcMs(date: CalendarDate): number {
  const m = DATE.exec(date);
  if (!m) throw new Error(`Invalid calendar date: ${date}`);
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  if (
    back.getUTCFullYear() !== y ||
    back.getUTCMonth() !== mo - 1 ||
    back.getUTCDate() !== d
  ) {
    throw new Error(`Invalid calendar date: ${date}`);
  }
  return ms;
}

function fromMs(ms: number): CalendarDate {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Validates and returns [year, month (1-12), day]. */
export function parseDate(date: CalendarDate): [number, number, number] {
  utcMs(date);
  return [Number(date.slice(0, 4)), Number(date.slice(5, 7)), Number(date.slice(8, 10))];
}

/** Validates and returns [year, month (1-12)]. */
export function parseMonth(month: YearMonth): [number, number] {
  const m = MONTH.exec(month);
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) {
    throw new Error(`Invalid month: ${month}`);
  }
  return [Number(m[1]), Number(m[2])];
}

/** The calendar date "now" in America/Sao_Paulo. `now` is a parameter. */
export function todayInSaoPaulo(now: Date): CalendarDate {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function daysBetween(from: CalendarDate, to: CalendarDate): number {
  return Math.round((utcMs(to) - utcMs(from)) / DAY_MS);
}

export function addDays(date: CalendarDate, days: number): CalendarDate {
  return fromMs(utcMs(date) + days * DAY_MS);
}

export function monthOf(date: CalendarDate): YearMonth {
  utcMs(date);
  return date.slice(0, 7);
}

export function shiftMonth(month: YearMonth, delta: number): YearMonth {
  const [y, m] = parseMonth(month);
  const index = y * 12 + (m - 1) + delta;
  const year = Math.floor(index / 12);
  return `${String(year).padStart(4, "0")}-${String((index % 12) + 1).padStart(2, "0")}`;
}
