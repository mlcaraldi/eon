# Decision log

One entry per decision that outlives a task. Format: what was decided, why,
the strongest alternative and why it lost, scope. Never rewrite an old
entry; supersede it with a new one that links back.

## D1 · Eon 2.0 is a new, lean app, not a cleanup of 1.0

- **Decided (Nov 2026):** start a new repo. Model: the bank feed first; the
  month is a list of commitments; the card invoice is one bill; paid and
  pending are set automatically from bank lines; card purchases are used
  only for categories.
- **Why:** 1.0 was correct but too heavy to use (manual statement downloads,
  duplicates the person couldn't trace, an ERP-style ledger modeled on
  Conta Azul). It stopped being used in Sep 2026.
- **Alternative:** strip 1.0 down in place. Lost because its data model
  (transactions, payments, transfers, contacts, rules) is the heavy part;
  removing it touches everything.
- **Scope:** the whole product. 1.0 stays as a reference, not a base.

## D2 · Read-only product

- **Decided:** Eon reads bank data and never moves money: no Pay, Transfer,
  Invest or Move-money actions. Destructive actions only remove Eon's own
  data, behind a dialog. (CLAUDE.md rule 5.)
- **Why:** read-only Open Finance consent is simpler, safer and enough for
  the goal (know how much can be invested this month).
- **Scope:** UI, APIs and any Claude connector.

## D3 · Money is integer centavos

- **Decided:** every amount is an integer number of centavos in storage,
  arithmetic and props; formatting happens only in `lib/format.ts`.
- **Why:** float sums and comparisons drift; in 1.0 a decimal column
  filtered with a JS number silently matched nothing.
- **Alternative:** a decimal type end to end. Lost: it has to cross into JS
  numbers somewhere, and that crossing is where 1.0's bugs were.

## D4 · Status is derived from bank lines

- **Decided:** a commitment is paid only when a bank line backs it; due
  soon = 0 to 3 days before the due date; overdue = past due with no
  matched bank line. There is no manual "mark as paid".
- **Why:** in 1.0, bills marked paid by hand stopped being candidates for
  matching, so the later import created a second copy. That was the main
  source of duplicates.
- **Alternative:** allow manual paid with a later merge. Lost: it reintroduces
  the reconciliation work the lean model removes.
- **Open:** what to show for a commitment paid outside the linked accounts
  (cash, another bank). Decide when the commitments screen is built.

## D5 · Build order

- **Decided:** product pitch deck (vision) → brand, logo, design system →
  screens and code. The design system (Strata) is done; see `docs/design/`.
- **Scope:** no app code before the vision and design steps are reviewed.

## D6 · Two rule files

- **Decided:** `CLAUDE.md` holds product, stack and design system rules;
  `AGENTS.md` holds workflow, coding, finance, data and security rules.
  `CLAUDE.md` imports `AGENTS.md` (first line `@AGENTS.md`, test-enforced),
  so Claude Code loads both.
- **Why:** the design rules came from the design handoff; the engineering
  rules came from Eon 1.0 (which took them from fill-site). Keeping them
  apart avoids duplicate rules drifting.

## Not decided yet

- **Data, API and auth stack.** 1.0 used tRPC, Prisma, Supabase Postgres and
  Auth.js. Pick again for 2.0 with an entry here; don't assume 1.0's choice.
- **Open Finance provider.** A MeuPluggy account exists from 1.0; confirm
  before building the sync.
- **Claude's role.** 1.0 had an Ask Claude fallback and a read-only MCP
  connector. Whether 2.0 needs either is open.
