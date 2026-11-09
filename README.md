# Eon

Personal finance for one household: reads bank data through Brazilian Open
Finance (read-only), lists the month's commitments, marks each one paid when
the money leaves the account, and shows one number: how much can be invested
this month. Product and design rules: [`CLAUDE.md`](CLAUDE.md).

## Status

Phase 0 done: Next.js scaffold and the gate. Brand and design system are done
(`docs/design/`). Next: phases 1 and 2 of [`docs/roadmap.md`](docs/roadmap.md).
How a new person is onboarded: [`docs/onboarding.md`](docs/onboarding.md).

## First run

```bash
npm ci
cp .env.example .env   # nothing required yet; later phases document each variable
npm run dev
```

Open http://localhost:3000. For now it shows a placeholder page; the month
view arrives in phase 2.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run check    # the gate: lint (0 warnings), types, tests; same as CI
npm test         # unit tests (Vitest), no database needed
npm run db:generate   # write a SQL migration from lib/db/schema.ts (no database needed)
npm run db:migrate    # apply migrations to DATABASE_URL: explicit, never part of the build
```

## Working here

Agent and contributor rules (workflow, coding principles, finance rules,
security, guardrails): [`AGENTS.md`](AGENTS.md). Decisions:
[`docs/decisions.md`](docs/decisions.md). What came from Eon 1.0 and why:
[`docs/from-eon-1.md`](docs/from-eon-1.md).
