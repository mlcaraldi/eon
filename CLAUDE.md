@AGENTS.md

# Eon

Personal finance web app for one household. It reads bank data through Brazilian Open Finance (read-only), lists the month's commitments, marks each one paid when the money leaves the account, categorizes card spending, and projects the next months to show one number: how much can be invested this month.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide · next-themes (`attribute="class"`).

## Design system (Strata) — read before any UI work

- Spec: `docs/design/EON-DESIGN-HANDOFF.md` (token names, components, props, formatting, rules).
- Tokens: `docs/design/eon-tokens.css` is the source for `app/globals.css`; `docs/design/eon-tokens.json` has the same values plus a WCAG contrast report.
- Brand files: `docs/design/brand/` (logos, app icons, favicons).
- Visual references (Marcelo's claude.ai account): design system https://claude.ai/artifact/Siz46BguhHrDMvRY4tTZAz (read its README first) · canvas with component sheet and sample screens https://claude.ai/artifact/5SbNPJi37i7CEV2yrFmaHR. The canvas is mockup HTML: compare against it, never copy it into the app.

## Rules

1. Use only design tokens (`bg-card`, `text-muted-foreground`, `text-amount-hero`, `rounded-md` …). No hard-coded hex, font sizes or shadows.
2. Money is integer centavos. Render every amount with `<Amount>` / `formatBRL` from `lib/format.ts`: `R$ 1.234,56`, negatives with U+2212 `−R$ 544,75`, income `+R$ …`. Amounts use `font-sans` + the `amount` utility, never `font-heading`.
3. Status is always icon + text via `<StatusPill>`; never color alone. `moss` / `status-paid` only mean "settled" and the focus ring: never buttons or links.
4. Forecast values are never filled: dashed outline, `≈` prefix, `amount-forecast`.
5. Read-only product: no Pay, Transfer, Invest or Move-money actions anywhere. Destructive actions only remove Eon's own data, behind a dialog.
6. UI copy in English with Brazilian money and dates (`10 nov`, `10/11/2026`, `November 2026`, installments `3/10`). Sentence case, no exclamation marks, no emoji. Voice: answer first, exact numbers, calm.
7. Touch targets ≥ 44 px on phone; dense desktop rows 44 px at 14 px text. Light theme first, dark theme complete.
8. No gradients, glassmorphism, glows, stock photos or money icons (piggy-bank, coins, banknote, wallet, rocket, trending-up).

## Working agreement

- Work in small steps; after each step show the diff and stop for review.
- Add tests for anything in `lib/` (formatting, status rules, forecast math).
- Commit only when asked.
