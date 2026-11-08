# Kickoff plan for the developer agent

Do one step at a time. After each step: run the checks listed, show the diff, stop for review.

## Step 0 · Scaffold (the folder already holds CLAUDE.md and docs/)

`create-next-app` refuses a folder with extra files, so scaffold beside it and copy in:

```bash
npx create-next-app@latest /tmp/eon-app --ts --tailwind --eslint --app --use-npm --import-alias "@/*" --yes
cp -Rn /tmp/eon-app/. .   # -n: never overwrite CLAUDE.md, AGENTS.md, README.md, .gitignore, next.config.ts
npx shadcn@latest init
npx shadcn@latest add button input select checkbox tabs sonner dialog drawer table skeleton alert popover command tooltip
npm i next-themes lucide-react
```

Check: `npm run dev` serves the default page; `git status` shows no file from `docs/` or the files carried from Eon 1.0 (`CLAUDE.md`, `AGENTS.md`, `README.md`, `.gitignore`, `next.config.ts`, `tests/`) overwritten. `create-next-app` writes its own `AGENTS.md`/`CLAUDE.md`; ours must win. If `cp -n` exits non-zero because it skipped files, that is expected.

## Step 0b · The gate (rules in AGENTS.md)

```bash
npm i -D vitest
npm pkg set scripts.lint="eslint --max-warnings 0" scripts.check-types="next typegen && tsc --noEmit" scripts.test="vitest run" scripts.test:watch="vitest" scripts.check="npm run lint && npm run check-types && npm test"
```

Check: `npm run check` passes, including `tests/guardrails.test.ts`. Break one guardrail on purpose (a `#hex` in a component), see it fail, revert.

## Step 1 · Tokens, fonts, icons

- Replace shadcn's `:root`, `.dark` and `@theme inline` blocks in `app/globals.css` with `docs/design/eon-tokens.css` (keep `@import "tailwindcss";` and any `tw-animate-css` import above it).
- Fonts in `app/layout.tsx` with `next/font/google`: `Schibsted_Grotesk` (500, 600) as `--font-schibsted`, `Source_Sans_3` (400, 500, 600) as `--font-source-sans`.
- `ThemeProvider` from next-themes with `attribute="class"`, default `light`.
- Icons: `docs/design/brand/icons/favicon.svg` → `app/icon.svg`; `apple-touch-icon.png` → `app/apple-icon.png`; `favicon.ico` → `app/favicon.ico`; `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` → `public/` + `app/manifest.ts`.

Check: a test page using `text-amount-hero`, `bg-status-paid-bg`, `px-gutter`, `min-h-touch`, `bg-cat-housing` renders correctly in light and dark.

## Step 2 · `lib/format.ts` with tests

Implement exactly as in the handoff §4 (`formatBRL`, `formatDateShort`, `formatDateLong`, `formatMonth`, `formatInstallment`, `formatForecast`). Use Vitest.

Required cases: `123456 → "R$ 1.234,56"`, `-54475 → "−R$ 544,75"` (U+2212), `1512690 signed → "+R$ 15.126,90"`, `0 → "R$ 0,00"`, `10 nov`, `10/11/2026`, `November 2026`, `3/10`, `10/10 · last`. Dates in `America/Sao_Paulo`.

## Step 3 · Data atoms

`components/eon/amount.tsx`, `status-pill.tsx`, `category-chip.tsx`, `bank-badge.tsx`, `month-switcher.tsx` with the props in the handoff §3. Status rules: due-soon = 0–3 days, overdue = past due with no matched bank line, paid only when matched.

## Step 4 · Month view with sample data

`commitment-row.tsx`, `invoice-row.tsx`, `month-summary.tsx`, then `app/page.tsx` (desktop sidebar ≥ 1280 px, phone tab bar). Sample data, November 2026, today = 08 nov:

| Commitment | Category | Due | Amount | Status |
|---|---|---|---|---|
| Salário | Income | 05 nov | +R$ 15.126,90 | Received |
| Financiamento Caixa | Housing | 05 nov | R$ 6.495,31 | Paid |
| RGE | Utilities | 10 nov | R$ 330,18 | Due soon |
| Condomínio | Housing | 15 nov | R$ 631,76 | Pending |
| Nubank card invoice | Card | 17 nov | R$ 8.214,40 | Pending |

Expected summary: total due R$ 15.671,65 · paid R$ 6.495,31 (41%) · still pending R$ 9.176,34 · available to invest −R$ 544,75.

Compare with the canvas board "Screen 1 · Month view".

## Later steps

Card invoice screen, forecast (12 months, installments rolling off), spending by category vs 3-month average, then Open Finance integration. Not before steps 0–4 are reviewed.
