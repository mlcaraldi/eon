# Eon

Personal finance for one household: reads bank data through Brazilian Open
Finance (read-only), lists the month's commitments, marks each one paid when
the money leaves the account, and shows one number: how much can be invested
this month. Product and design rules: [`CLAUDE.md`](CLAUDE.md).

## Status

Not scaffolded yet. The order is pitch deck, then brand and design system
(done, `docs/design/`), then screens and code following
[`docs/design/KICKOFF.md`](docs/design/KICKOFF.md).

## Commands (after KICKOFF step 0b)

```bash
npm run dev      # dev server on http://localhost:3000
npm run check    # the gate: lint (0 warnings), types, tests; same as CI
npm test         # unit tests (Vitest), no database needed
```

## Working here

Agent and contributor rules (workflow, coding principles, finance rules,
security, guardrails): [`AGENTS.md`](AGENTS.md). Decisions:
[`docs/decisions.md`](docs/decisions.md). What came from Eon 1.0 and why:
[`docs/from-eon-1.md`](docs/from-eon-1.md).
