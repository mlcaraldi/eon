# Roadmap

How Eon 2.0 goes from an empty repo to an app Marcelo uses every month.
Written 08 nov 2026. Rules for the work itself are in `AGENTS.md` and
`CLAUDE.md`; decisions are in `docs/decisions.md`. When a phase ends, mark
it done here and record any decision it produced in the decision log.

## The goal, in one test

Eon 2.0 is done when, for **two months in a row**, Marcelo opens it at the
start of the month and sees the right commitments, paid or pending, the
Nubank card invoice as one bill, and how much he can invest, with **no
manual entry and under 5 minutes a week** of attention. Every phase is
judged by whether it moves toward that test. 1.0 was built feature-first and
stopped being used; 2.0 is built usage-first.

## Order at a glance

| # | Phase | Depends on | Output |
| --- | --- | --- | --- |
| 0 | Foundations and decisions | nothing | scaffold, gate green, D7 to D10 recorded |
| 1 | Bank data spike | 0 (repo only) | real Nubank and Caixa data as fixtures, go/no-go on the provider |
| 2 | Design system in code, month view on sample data | 0 | KICKOFF steps 1 to 4 |
| 3 | Data, auth and daily sync | 1, 2 | real bank lines in the database, no duplicates |
| 4 | Commitments with automatic status | 3 | the month view on real data (first usable version) |
| 5 | Card invoice and categories | 4 | invoice screen, spending by category |
| 6 | Forecast and the investable number | 5 | 12-month projection, one number to invest |
| 7 | Claude, read-only | 6 | Claude connector over Eon's numbers |

Phases 1 and 2 run in parallel: the spike needs no UI, and the UI starts on
sample data. Brand and design system before screens (D5) still holds: the
design system is finished, so phase 2 is the first screen work. The pitch
deck step in D5 is dropped (D7 below).

## Open decisions: recommendations

Each one becomes a numbered entry in `docs/decisions.md` when Marcelo
approves it, in the format the log uses.

### D8 · Data, API and auth stack

**Recommendation:** Postgres on **Neon** (through the Vercel Marketplace),
**Drizzle** ORM, **Server Components and Server Actions** (no tRPC),
**Better Auth** with one allow-listed Google account, hosted on **Vercel**.

| Option | For | Against |
| --- | --- | --- |
| **Neon + Drizzle + Better Auth** (recommended) | Vercel integration gives a separate database branch per preview, which makes the AGENTS.md rule "dev and prod never share a database" automatic; Drizzle has no generated client and maps `bigint` centavos and `date` columns cleanly; Better Auth now maintains Auth.js and joined Vercel in Jul 2026, so it is the supported path | Three vendors instead of one; new to Marcelo |
| Supabase (Postgres + Supabase Auth) + Prisma 7 | Known from 1.0; one vendor for database and auth; good dashboard | Free projects pause after a week of low activity (a daily sync avoids it, but it is one more thing to watch); 1.0 hit its IPv6-only direct host; Prisma's generated client is the step that put migrations inside the build in 1.0; Supabase Auth, Storage and Realtime are mostly unused here |
| SQLite (Turso) | Cheapest, simplest | Weaker date and integer types for money work; no branch-per-preview |

Why Supabase loses: nothing it adds over plain Postgres is needed by a
read-only, single-user app, and the per-preview database solves a rule
1.0 broke. It is a close call; if Marcelo prefers one dashboard he already
knows, Supabase with Drizzle is an acceptable second choice and changes
nothing else in this plan.

Why no tRPC: one user, one app, Server Components read data directly and
Server Actions cover the few writes (commitment definitions, category
fixes). tRPC was 1.0's heaviest layer for no client that needed it.

Auth (superseded by D11: Neon Auth with an emailed code): one Google account on an allow list (`EON_ALLOWED_EMAIL`), sessions
in the database. A passkey can come later. Every query is still scoped to
the owner (AGENTS.md).

### D9 · Open Finance provider

**Recommendation:** **Pluggy through MeuPluggy**, confirmed by the phase 1
spike before any sync code is written.

How it works: Marcelo connects Nubank and Caixa inside the free MeuPluggy
consumer app (official Open Finance, read-only consent); a Pluggy
development application then reads that data with a client id and secret.
Pluggy's coverage page lists Nubank and Caixa with accounts, transactions,
credit cards and investments over Open Finance, and its May 2026 changelog
fixed transaction data for both.

| Option | Cost (estimate) | Verdict |
| --- | --- | --- |
| **MeuPluggy + Pluggy dev app** | free for personal use | recommended; terms after the 15-day developer trial are not documented, see risks |
| Pluggy paid plan | about R$ 2.500/month (developer reports, May 2026) | wrong scale for one household |
| Belvo | about R$ 6.000/month (same source) | same |
| Tecnospeed | R$ 1.500 setup + R$ 540/month (same source) | same |
| OFX/CSV upload from Nubank and Caixa | free | fallback only: manual downloads were 1.0's second-biggest pain |

The fallback is kept in mind, not built: if MeuPluggy stops working, an
OFX upload that feeds the same bank-line table is a phase-sized change, not
a redesign, because everything downstream reads bank lines, not the
provider.

### D10 · Claude's role

**Recommendation:** Claude is **not** in the app's core loop. Two optional
roles, in this order:

1. **Read-only Claude connector (MCP)** in phase 7: Marcelo asks questions
   in claude.ai ("why is the invoice higher this month?") over Eon's
   computed numbers. 1.0's connector worked and he uses Claude daily, so
   this is cheap and useful.
2. **Category suggestions** only if, after a month of real data, Pluggy's
   own categories plus merchant rules leave more than about 10% of card
   spending uncategorized. Description, amount and date only, as in
   AGENTS.md; a suggestion still needs a rule or a person to confirm.

Strongest alternative: **Claude as the main interface** (chat first, as
proposed for 1.0 on 06 nov). It loses because the core output is a few
exact numbers that should be glanceable and deterministic; chat is a good
way to explore them, not to replace them. No in-app "Ask Claude" box: it
duplicates the connector.

## Phase 0 · Foundations and decisions

- **Goal:** a repo where a screen can be built safely.
- **Scope:** KICKOFF steps 0 and 0b (scaffold, the gate); approve D8 to D10
  and write them to the decision log; Vercel project linked to the repo
  with preview deploys; README status updated.
- **Exit:** `npm run check` passes locally and in CI; a guardrail broken on
  purpose fails; a preview deploy serves the default page.
- **Risks:** `create-next-app` overwriting carried files (KICKOFF guards
  this); Next.js 16 conventions newer than the agent's training (read
  `node_modules/next/dist/docs/`).

## Phase 1 · Bank data spike

- **Goal:** know what the bank data really looks like before modeling it.
  1.0 never ran a real Pluggy call; every rule it learned came from OFX.
- **Scope:** Marcelo connects Nubank (checking + card) and Caixa in
  MeuPluggy and creates the Pluggy dev app (his steps). A throwaway script
  (`scripts/spike/`, dry by nature, reads only) pulls 90 days and writes
  JSON to a git-ignored folder. Then an anonymized fixture set goes into
  `tests/fixtures/` and a short findings note into `docs/`.
- **Questions it must answer:**
  1. Does the card come with bills (closing date, due date, total), or only
     with transactions we must group by the closing day (3rd)?
  2. How do installments appear ("Parcela N/M" text, structured fields, or
     both)? Are future installments visible?
  3. Is the card payment visible on both checking and card, and with what
     wording, so the pair can be matched?
  4. Is the Caixa financing (R$ 6.495,31/month to 2034) visible as a debit
     with a stable description?
  5. Which fields carry the counterparty for Pix and boletos (the condo
     boleto showed the processor's name in 1.0)? How good is Pluggy's own
     category?
  6. Pending vs posted transactions, stable ids across syncs, refresh
     timing, consent duration.
  7. What happens after the developer trial ends.
- **Exit:** every question has an answer backed by a fixture; a go or no-go
  on D9. No-go means the OFX fallback becomes phase 3's input.
- **Risks:** MeuPluggy terms; a bank missing a product over Open Finance.

## Phase 2 · Design system in code, month view on sample data

- **Goal:** the month view looks and reads right before real data arrives.
- **Scope:** KICKOFF steps 1 to 4: tokens, fonts, icons; `lib/format.ts`
  with its tests; data atoms (`Amount`, `StatusPill`, `CategoryChip`,
  `BankBadge`, `MonthSwitcher`); commitment and invoice rows, month
  summary, `app/page.tsx` with the November 2026 sample.
- **Exit:** the sample shows total due R$ 15.671,65, paid R$ 6.495,31
  (41%), pending R$ 9.176,34, available to invest −R$ 544,75; matches the
  canvas "Screen 1 · Month view" in light and dark, phone and desktop.
- **Risks:** copying canvas HTML into the app (forbidden by CLAUDE.md);
  building screens beyond the month view before data exists.

## Phase 3 · Data, auth and daily sync

- **Goal:** real bank lines in the database, once each, every day.
- **Scope:** schema with only what the lean model needs: `accounts`,
  `bank_lines` (provider id unique per account, centavos, calendar date,
  raw and normalized description), `sync_runs`, plus auth tables. Better
  Auth sign-in. Sync service (pure mapping in `lib/`, validated with zod):
  first sync 90 days back, 10-day overlap on each run, pending lines
  skipped, sign from the transaction type. Daily Vercel cron plus a "Sync
  now" action. Opening balance per account from the provider. Env vars in
  `.env.example`; the app runs and says what is missing without them.
- **Exit:** a second sync over the same window adds zero lines (test with
  the phase 1 fixtures and in the dev database); production deploy synced
  with Marcelo's real accounts for a week with no duplicates.
- **Risks:** Vercel Hobby crons run at most once a day (enough: the
  provider refreshes daily); idempotency bugs (dedup by provider id only,
  never by amount + date).

## Phase 4 · Commitments with automatic status (first usable version)

- **Goal:** the month view on real data. This is the version Marcelo starts
  using.
- **Scope:** commitment definitions (name, category, expected amount or
  range, due day, account, recurrence, end date such as 2034 for the
  financing), entered once and suggested from recurring bank lines where
  possible. A pure matcher in `lib/` that links a commitment to a bank line
  (amount tolerance, date window around due day, merchant key), with
  fixed-date tests from the fixtures. Status derived only from matches (D4).
  The card invoice is one commitment, matched to the card payment line.
  Decide D4's open point (paid outside linked accounts).
- **Exit:** November and December 2026 close with every status right, as
  Marcelo checks them, and zero manual toggles. Use it for a month before
  phase 5 starts.
- **Risks:** this is where 1.0 went heavy. Any request for a manual
  "paid" button, a review inbox or a reconciliation screen needs a
  decision entry first.

## Phase 5 · Card invoice and categories

- **Goal:** know where card money goes without classifying lines by hand.
- **Scope:** invoice screen (current open invoice, by closing day, with
  installments `3/10`); merchant-key normalization (strip "Parcela N/M",
  "10d10", Pix bank details, acquirer tags such as `Ifd*`, `Pg *`, `Mlp*`);
  category = Pluggy's category mapped to Eon's list, overridden by a learned
  merchant rule when Marcelo fixes one; spending by category vs the 3-month
  average.
- **Exit:** at least 90% of a month's card spending categorized
  automatically; a fix to one merchant applies to its next charges.
- **Risks:** rules keyed on raw text (42 of 112 rules in 1.0 never matched
  again).

## Phase 6 · Forecast and the investable number

- **Goal:** the product's one number: how much can be invested this month.
- **Scope:** 12-month projection from commitments, known installments
  rolling off, and an estimate for everyday card spending (3-month average
  of non-installment card spending, as in 1.0); forecast values shown per
  CLAUDE.md rule 4. Define the investable number precisely in a decision
  entry (income minus commitments minus projected invoice minus a buffer
  Marcelo sets once).
- **Exit:** the number for the past two months, recomputed with what was
  known at the start of each month, is within an agreed margin of what was
  actually left.
- **Risks:** a precise-looking number built on a weak estimate; show it
  with `≈` and the reason.

## Phase 7 · Claude, read-only

- **Goal:** ask Eon questions from claude.ai.
- **Scope:** read-only MCP connector with an explicit field list per tool
  (month summary, commitments, invoice, categories, forecast), token auth,
  key-set tests; category suggestions only if phase 5 missed its 90% target.
- **Exit:** the connector answers Marcelo's top weekly questions with the
  same numbers the app shows.

## Out of scope (until a decision entry says otherwise)

- Manual entry of expenses or income, and a manual "paid" toggle (D4).
- OFX/PDF import, unless phase 1 is a no-go.
- Reconciliation screen, review inbox, contacts, transfers ledger (1.0's
  heavy parts, D1).
- Moving money of any kind (D2).
- Investment tracking and returns; Eon says how much to invest, not where.
- Budgets with limits, alerts and notifications, native mobile apps,
  multiple users or households.

## Risks across phases

| Risk | Likelihood | Impact | Response |
| --- | --- | --- | --- |
| MeuPluggy free access changes or ends | medium | high | spike answers it early; downstream reads bank lines only, OFX fallback is one phase |
| Open Finance consent expires | high (it is by design) | medium | show the expiry date and a renew prompt; sync status says "unknown" (never `0`) when stale |
| Card bill data missing over Open Finance | medium | medium | build invoices from card lines and the closing day (3rd) |
| Scope drifts back to 1.0 | medium | high | "Still lean" check on every PR; decision entry for any new manual step |
| Real data breaks assumptions | high | medium | fixtures from phase 1 before modeling; tests from those fixtures |

## Sources

- Pluggy Open Finance coverage (Nubank, Caixa): https://docs.pluggy.ai/docs/open-finance-institutions-coverage
- Pluggy changelog 2026.05: https://v2.docs.pluggy.ai/en/changelog/2026.05
- MeuPluggy (free consumer app, developer flow, 15-day trial): https://github.com/pluggyai/meu-pluggy
- Open Finance aggregator prices reported by developers (May 2026): https://www.tabnews.com.br/GuilhermeVieira/estou-desenvolvendo-um-app-de-financas-pessoais-e-nao-consigo-pagar-o-open-finance-pluggy-r2-5k-mes-belvo-r6k-mes-tecnospeed-r1-5k-de-entrada-r540
- Supabase free project pausing: https://supabase.com/kb/faqs/platform/free-project-pausing
- Auth.js is now part of Better Auth: https://better-auth.com/blog/authjs-joins-better-auth
- Better Auth joins Vercel (Jul 2026): https://www.developersdigest.tech/blog/better-auth-joins-vercel
