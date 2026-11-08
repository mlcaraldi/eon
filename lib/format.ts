import { parseDate, parseMonth, type CalendarDate, type YearMonth } from "@/lib/dates";

const MONTHS_SHORT = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** R$ 1.234,56 · −R$ 1.234,56 (U+2212) · +R$ 15.126,90 when signed. Integer centavos only. */
export function formatBRL(centavos: number, opts: { signed?: boolean } = {}): string {
  if (!Number.isSafeInteger(centavos)) {
    throw new Error(`Money must be integer centavos, got ${centavos}`);
  }
  const abs = Math.abs(centavos);
  const reais = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const cents = String(abs % 100).padStart(2, "0");
  const body = `R$ ${reais},${cents}`;
  if (centavos < 0) return `−${body}`;
  return opts.signed && centavos > 0 ? `+${body}` : body;
}

/** 10 nov */
export function formatDateShort(date: CalendarDate): string {
  const [, m, d] = parseDate(date);
  return `${String(d).padStart(2, "0")} ${MONTHS_SHORT[m - 1]}`;
}

/** 10/11/2026 */
export function formatDateLong(date: CalendarDate): string {
  const [y, m, d] = parseDate(date);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

/** November 2026 */
export function formatMonth(month: YearMonth): string {
  const [y, m] = parseMonth(month);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

/** 3/10 · 10/10 · last */
export function formatInstallment(n: number, total: number): string {
  return n === total ? `${n}/${total} · last` : `${n}/${total}`;
}

/** ≈ R$ 1.234,56 */
export function formatForecast(centavos: number): string {
  return `≈ ${formatBRL(centavos)}`;
}
