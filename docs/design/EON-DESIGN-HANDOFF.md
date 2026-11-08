# Eon design system handoff (Strata, v1.0, 08 nov 2026)

Files: `eon-tokens.css` (Tailwind v4 + shadcn/ui variables), `eon-tokens.json` (same values + WCAG contrast report), `eon-brand-assets.zip` (logo, favicons, app icons). The canvas "Eon brand · Strata" holds the component sheet and sample screens.

## 1. Install

```tsx
// app/layout.tsx
import { Schibsted_Grotesk, Source_Sans_3 } from "next/font/google";
const heading = Schibsted_Grotesk({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-schibsted" });
const sans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-source-sans" });
// <html lang="en" className={`${heading.variable} ${sans.variable}`} suppressHydrationWarning>
// Dark mode: next-themes with attribute="class" (the CSS uses `.dark`).
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css"; /* if your shadcn setup already uses it */
/* paste eon-tokens.css here, replacing shadcn's :root / .dark / @theme inline blocks */
```

Icons: `app/icon.svg` = `favicon.svg`, `app/apple-icon.png` = `apple-touch-icon.png`, `app/favicon.ico`. PWA icons: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (`"purpose": "maskable"`).

Verified: the CSS compiles with Tailwind CSS 4.1.11 and produces every utility listed below.

## 2. Tokens (use exactly these names)

### Color utilities (`bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*`, `stroke-*`)

shadcn/ui: `background` `foreground` `card` `card-foreground` `popover` `popover-foreground` `primary` `primary-foreground` `secondary` `secondary-foreground` `muted` `muted-foreground` `accent` `accent-foreground` `destructive` `destructive-foreground` `border` `input` `ring` `chart-1` … `chart-5` `sidebar` `sidebar-foreground` `sidebar-primary` `sidebar-primary-foreground` `sidebar-accent` `sidebar-accent-foreground` `sidebar-border` `sidebar-ring`

Eon: `surface-sunken` `sandstone` `moss`
`status-paid` `status-paid-bg` `status-pending` `status-pending-bg` `status-due-soon` `status-due-soon-bg` `status-overdue` `status-overdue-bg` `status-forecast` `status-forecast-bg`
`amount-income` `amount-expense` `amount-forecast`
`cat-housing` `cat-utilities` `cat-groceries` `cat-dining` `cat-transport` `cat-health` `cat-education` `cat-shopping` `cat-leisure` `cat-subscriptions` `cat-other`

Chart mapping: `chart-1` real values · `chart-2` forecast · `chart-3` income · `chart-4` negative/overdue · `chart-5` reference lines (sandstone).

### Type (`text-*`, responsive at `lg`, size + line height + weight + tracking included)

| Utility | Phone | ≥ lg | Font |
|---|---|---|---|
| `text-amount-hero` | 40/44 | 52/56 | sans 600 |
| `text-display` | 34/40 | 48/52 | heading 600 |
| `text-heading-1` | 26/32 | 32/38 | heading 600 |
| `text-heading-2` | 20/26 | 22/28 | heading 600 |
| `text-heading-3` | 17/24 | 18/24 | heading 600 |
| `text-amount-lg` | 24/28 | 28/32 | sans 600 |
| `text-body` | 16/24 | 16/24 | sans 400 |
| `text-ui` | 16/22 | 14/20 | sans 400 |
| `text-label` | 14/20 | 13/18 | sans 500 |
| `text-caption` | 13/18 | 13/18 | sans 400 |

Families: `font-heading`, `font-sans`. Every amount: `amount` utility (tabular, lining, nowrap); forecast amounts add `amount-forecast`. Headings never contain amounts.

### Layout, shape, motion

- Spacing: `--spacing: 0.25rem` (4 px). Extras: `p-gutter` / `px-gutter` (16 → 32 px at lg), `h-row` / `min-h-row` (56 → 44 px), `min-h-touch` / `size-touch` (44 px).
- Radius: `rounded-sm` 2 · `rounded-md` 4 (pills, buttons, inputs) · `rounded-lg` 6 (cards) · `rounded-xl` 10 (dialogs). `--radius: 0.375rem`.
- Shadow: `shadow-xs` `shadow-sm` `shadow-md` (popover, menus) `shadow-lg` (dialog, toast). Prefer a border; one shadow max.
- Border: `--border-width-hairline` 1 px, `--border-width-focus` 2 px, `--border-width-rule` 3 px (double rule above totals: `border-t-[3px] border-double`).
- Motion: CSS variables `--duration-instant` 80 · `--duration-fast` 140 · `--duration-base` 200 · `--duration-slow` 320 ms, used as `duration-(--duration-base)` (Tailwind v4 has no duration namespace); easing utilities `ease-standard`, `ease-enter`, `ease-exit`. `prefers-reduced-motion` sets every duration to 0.
- Breakpoints (Tailwind defaults kept): phone < `sm` 640 px (design for 360–430) · tablet `sm`–`xl` · desktop `xl` ≥ 1280 px. Max content width `max-w-content` (1280 px).

## 3. Components (names and files)

| Component | File | Props |
|---|---|---|
| `Amount` | `components/eon/amount.tsx` | `value: number` (centavos) · `size: "hero" \| "lg" \| "md" \| "sm"` · `tone: "default" \| "income" \| "muted"` · `kind: "real" \| "forecast"` · `signed?: boolean` |
| `StatusPill` | `components/eon/status-pill.tsx` | `status: "paid" \| "pending" \| "due-soon" \| "overdue" \| "forecast"` · `label?: string` · `size: "default" \| "sm" \| "icon"` · `direction?: "in" \| "out"` (paid + in → "Received") |
| `CategoryChip` | `components/eon/category-chip.tsx` | `category: CategoryId` · `size: "default" \| "lg"` · `selected?` |
| `CategoryPicker` | `components/eon/category-picker.tsx` | `value` · `onChange` · `merchant?` (shows "Always use for …") — shadcn `Popover` + `Command`, `Drawer` on phone |
| `BankBadge` | `components/eon/bank-badge.tsx` | `bank` · `state: "connected" \| "syncing" \| "expired"` · `lastSync: Date` · `compact?` |
| `MonthSwitcher` | `components/eon/month-switcher.tsx` | `month: YearMonth` · `min` · `max` (= today + 12) · `onChange` |
| `CommitmentRow` | `components/eon/commitment-row.tsx` | `commitment` · `layout: "table" \| "list"` (desktop / phone) |
| `InvoiceRow` | `components/eon/invoice-row.tsx` | `invoice` · `expanded` · `onExpandedChange` · `groupBy: "category" \| "date"` · `previewPerGroup = 2` |
| `MonthSummary` | `components/eon/month-summary.tsx` | `month` · `income` · `due` · `paid` · `surplus` · `state: "open" \| "closed" \| "forecast"` |
| `ForecastChart` | `components/eon/forecast-chart.tsx` | `months: 6 \| 12` · `series: "surplus" \| "card"` · `data: {month, value, kind, note?}[]` |
| `SpendingByCategory` | `components/eon/spending-by-category.tsx` | `month` · `compareTo: "avg3"` · `limit = 4` |
| `EmptyState` · `ErrorState` | `components/eon/states.tsx` | `title` · `body` · `action?` |
| shadcn | `components/ui/*` | `Button` (`default` = ink primary, `secondary`, `outline`, `ghost`, `destructive`, `link`; sizes `sm` `default` `lg` `icon`) · `Input` · `Select` · `Checkbox` · `Tabs` · `Sonner` toasts · `Dialog` / `Drawer` · `Table` · `Skeleton` · `Alert` · `Popover` · `Command` · `Tooltip` |

Status icon map (Lucide): paid `CircleCheck` · pending `CircleDashed` · due-soon `Clock` · overdue `TriangleAlert` · forecast `Hourglass` · bank `Landmark` · card `CreditCard` · syncing `RefreshCw` · expired `Link2Off`. Size 14 in pills, 16 desktop, 20 phone rows; `strokeWidth={1.75}` up to 16 px, `1.5` above.

Status rules: `due-soon` = due date within 0–3 days; `overdue` = past due and no matched bank line; `paid` only when matched. Paid rows dim their amount (`text-muted-foreground`).

## 4. Formatting (`lib/format.ts`)

```ts
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
/** R$ 1.234,56 · −R$ 1.234,56 (U+2212) · +R$ 15.126,90 when signed */
export function formatBRL(centavos: number, opts: { signed?: boolean } = {}) {
  const s = brl.format(Math.abs(centavos) / 100).replace(/\s/, " "); // "R$ 1.234,56"
  if (centavos < 0) return "−" + s;
  return opts.signed && centavos > 0 ? "+" + s : s;
}
const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
export const formatDateShort = (d: Date) => `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`; // 10 nov
export const formatDateLong = (d: Date) => d.toLocaleDateString("pt-BR"); // 10/11/2026
export const formatMonth = (d: Date) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" }); // November 2026
export const formatInstallment = (n: number, total: number) => (n === total ? `${n}/${total} · last` : `${n}/${total}`);
export const formatForecast = (centavos: number) => "≈ " + formatBRL(centavos);
```

Store money as integer centavos. Dates in the UI use `America/Sao_Paulo`.

## 5. Rules developers enforce

1. Moss (`status-paid`, `moss`) only for settled money and the focus ring. Never on buttons or links.
2. No state by color alone: every status renders icon + text; every amount keeps its sign.
3. Amounts always `font-sans` + `amount`. Never in `font-heading`.
4. Forecast is never filled: dashed border, ≈ prefix, `amount-forecast`.
5. Read-only: no Pay, Transfer, Invest or Move money actions, ever. Destructive buttons only remove Eon's own data.
6. No gradients, glass, glows or illustration beyond the outlined strata in empty states.
7. Touch targets ≥ 44 px on phone (`min-h-touch`); dense desktop rows 44 px at 14 px text.
8. Copy follows the voice board: answer first, exact numbers, no exclamation marks, sentence case.

## 6. Open items

- Category palette: 10 colors + Other, optimized for deuteranopia/protanopia separation and ≥ 3:1 on card in both themes; with ten hues some pairs stay close for some viewers, which is why names and amounts are always shown.
- Sample data on the screens is illustrative (merchant list, 3-month averages, IPVA/IPTU amounts, 13º not modelled).
- INPI and registro.br checks for "Eon" are still open.
