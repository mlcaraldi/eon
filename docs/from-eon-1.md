# What came from Eon 1.0

Eon 1.0 lived in the GitHub repo `mlcaraldi/eon` (`main`, up to PR #26,
08 nov 2026). That repo was deleted the same day and the name reused for
2.0. This note lists what was carried into 2.0, what was changed on the
way, what was left behind on purpose, and the lessons 1.0 paid for. It is
the only record of what 1.0 knew.

## Carried over

| File | From 1.0 | Changed for 2.0 |
| --- | --- | --- |
| `AGENTS.md` | Rulebook from PR #26 | Product, stack and UI details moved to CLAUDE.md; new "Lean first" section; paths without `src/`; calendar dates in `America/Sao_Paulo`; dedup and real-data-fixture rules added from 1.0's lessons; Prisma, tRPC, Pluggy and MCP specifics removed |
| `.github/pull_request_template.md` | Same | Vercel and Prisma lines made generic; added a "still lean" check and a theme/width check |
| `.github/workflows/ci.yml` | Same three steps (lint, types, test) on Node 22 | Dropped the fake `DATABASE_URL` that Prisma needed |
| `tests/guardrails.test.ts` | Color literals, `agentRules`, `NEXT_PUBLIC_` secrets | Paths for a root `app/` layout; works before the app exists; added banned money icons (CLAUDE.md rule 8) and the `@AGENTS.md` import check |
| `next.config.ts` | `agentRules: false` | Same |
| `vitest.config.ts` | Node environment, `@` alias | Alias points to the repo root; picks up `**/*.test.ts` |
| `.gitignore` | Same | Removed the Prisma client line |
| `.env.example` | Header and rules | No variables yet |
| `.claude/launch.json` | Dev server on port 3000 | Same |
| `docs/decisions.md` | Replaces 1.0's architecture §6 log | Starts fresh with the 2.0 decisions; 1.0 entries summarized as lessons below |

## Left behind on purpose

- **All app code:** screens, tRPC routers, services, components, auth,
  scripts (`reset-clean-base`, `reconciliation-report`).
- **The data model:** `prisma/schema.prisma` and migrations (Transaction,
  Payment, Transfer, Contact, CategoryRule, ImportBatch, ImportedLine,
  DuplicateDismissal). It is the heavy model D1 replaces.
- **Heavy features:** OFX/PDF import, reconciliation screen and scoring
  matcher, review inbox, manual expense/income entry with installments and
  recurrences, contacts.
- **Integration code:** Pluggy sync, Ask Claude, the MCP connector. The
  lessons are kept below; whether 2.0 needs them is open (D-log).
- **Docs tied to 1.0:** `docs/screen-spec.md` (Conta Azul-style screens),
  `docs/architecture.md` (except the lessons below), README setup.
- **Configs the scaffold creates:** `package.json`, `tsconfig.json`,
  `eslint.config.mjs`, `components.json`, `postcss.config.mjs`. The
  scaffold makes them; KICKOFF step 0b adds the gate scripts.
- **Brand prompt** (`eon/brand/claude-design-prompt.md` in project files):
  the finished design system in `docs/design/` supersedes it.

## Lessons 1.0 paid for

Product
- Manual "paid" plus a later import made duplicates (Sep 2026: R$ 2.880,66
  of expenses and R$ 873,10 of salary counted twice). Hence D4.
- Downloading statements by hand was the second-biggest pain. Hence the bank
  feed first.
- Card purchases dated on the purchase day distorted the cash forecast. A
  card purchase belongs to its invoice: on or after the closing day it goes
  to the next invoice. Nubank card: closes on the 3rd, due on the 10th.
- Future card invoices look far too small unless everyday card spending is
  estimated (1.0 used the 3-month average of non-installment, non-recurring
  card spending).

Bank data
- Identical charges on the same day are real (14 tolls of R$ 6,60, 7
  withdrawals of R$ 1.000 in one statement). Dedup by the bank's id, never
  by amount + date.
- Paying the card from checking shows on both accounts. Pair own-account
  transfers by exact opposite amount within 3 days plus transfer wording, or
  the payment looks like income.
- Merchant text is noisy: "Parcela N/M" (and "10d10"), Pix bank/branch/
  account details in two Nubank formats, acquirer tags (`Ifd*`, `Pg *`,
  `Mlp*`). Normalize to a merchant key before learning a category; 42 of
  112 learned rules in 1.0 never matched again because of "Parcela N/M".
- The condo boleto shows as "IFOOD PAGO INSTITUICAO DE PAGAMENTO": the
  payee text can name the payment processor, not the payee.
- Open Finance (Pluggy) descriptions are generic ("PIX ENVIADO"): put the
  counterparty from the payment data first. Take the sign from the
  transaction type, not the amount. Skip pending transactions. Re-read a
  10-day overlap on each sync; first sync 90 days back, never before the
  opening balance date.

Engineering
- Calendar dates handled with local-timezone `Date` methods rendered a day
  off in Brazil (UTC−3). Keep them as `YYYY-MM-DD`.
- A decimal column filtered with a JS number (`89.9` vs stored `89.90`)
  matched nothing, so every re-import duplicated. Integer centavos avoid it.
- One database transaction around a whole statement import (128 lines)
  timed out over a networked database. Process line by line, idempotent by
  bank id, with small transactions only where atomicity matters.
- Supabase's direct host is IPv6 only; Vercel functions need the Session
  pooler host (IPv4, port 5432, user `postgres.<project-ref>`).
- `npm run build` ran database migrations, so "checking the build" could
  migrate production. The build never touches a database (AGENTS.md).
