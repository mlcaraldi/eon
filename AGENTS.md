# AGENTS.md: Eon

> Read by AI agents before any task in this repo. This file is the rulebook
> for how we work and how code is written. Product, stack and the design
> system rules live in [`CLAUDE.md`](CLAUDE.md); where the two overlap,
> CLAUDE.md wins on UI and design, this file wins on everything else.

## Where things are

| What | Where |
| --- | --- |
| Product, stack, design system rules | [`CLAUDE.md`](CLAUDE.md) |
| Design spec, tokens, brand files | [`docs/design/`](docs/design/) |
| Build order for the first steps | [`docs/design/KICKOFF.md`](docs/design/KICKOFF.md) |
| Decision log | [`docs/decisions.md`](docs/decisions.md) |
| What came from Eon 1.0 and what it taught us | [`docs/from-eon-1.md`](docs/from-eon-1.md) |
| Env vars (all of them, documented) | `.env.example` |

A decision that outlives the current task (a new integration, a data model
shape, a rule below) gets a numbered entry in `docs/decisions.md`: what was
decided, why, the strongest alternative and why it lost, and the scope.

## Lean first

Eon 1.0 failed because it was too heavy to use, not because the code was
wrong. Every change in 2.0 is judged against that:

- **The bank feed is the source of truth.** Eon reads what happened; the
  person doesn't type it. A feature that needs regular manual entry needs a
  decision entry that explains why there is no automatic way.
- **Fewer things to look at.** The month is a short list of commitments plus
  the card invoice as one bill. Card purchases exist only to explain
  categories, never as bills.
- **Status is derived, never toggled.** A commitment is paid when a bank line
  backs it, not when someone clicks "paid". (In 1.0, bills marked paid by
  hand plus the later import created the duplicates that made the app
  unusable.)
- **Don't rebuild 1.0.** Before adding a screen, table or setting, check it
  against the lean model in `docs/decisions.md`. "1.0 had it" is not a reason.

## Next.js warning

Recent Next.js versions have breaking changes (APIs, conventions, file
layout) that may differ from your training data. Before writing Next code,
read the relevant guide in `node_modules/next/dist/docs/` and heed
deprecation notices (e.g. `middleware` is now `proxy`). `next.config.ts`
sets `agentRules: false` so `next dev` doesn't rewrite this file; don't
remove it (a test enforces it).

## Versions

Versions come from `package.json` / `package-lock.json`. Check the lockfile
before citing a number; never invent one. Beta or fragile packages are
pinned to the exact version. Dependencies are updated by a person, on
purpose, no bots.

## The gate

```bash
npm run check    # = npm run lint && npm run check-types && npm test
```

- `lint` is `eslint --max-warnings 0`: a warning fails.
- `check-types` runs `next typegen` and `tsc --noEmit` (route types such as
  `LayoutProps` only exist after `next typegen`). If a code generator is
  added later (an ORM client, for example), it runs here first.
- `test` is Vitest in Node, no database or network needed.
- CI (`.github/workflows/ci.yml`) runs the same three steps on every PR and
  push to `main`. Run the gate before opening a PR, and never say it passed
  if you didn't run it.
- **The build never touches a database.** Migrations are their own explicit
  step, never hidden inside `npm run build`. (In 1.0, `build` ran
  `prisma migrate deploy` against whatever `DATABASE_URL` pointed to.)

## Workflow

- **Small steps, reviewed.** After each step: run the gate, show the diff,
  stop for review. Commit only when asked.
- **Plan before multi-step work.** List the atomic steps (each with how you
  will verify it) before writing code, then do one at a time.
- **Trunk-based.** `main` is production. Work starts on a short branch from
  `main`, goes through a PR, and merges only with green CI and a check on
  the preview deploy. No `develop` or release branches.
- **Conventional Commits, in English:** `type(scope): description`,
  imperative, lowercase, no period. Types: `feat`, `fix`, `refactor`,
  `test`, `docs`, `chore`, `build`, `ci`, `perf`, `style`. Breaking change:
  `!` after the type plus a `BREAKING CHANGE:` footer.
- **Atomic commits.** One logical step per commit, with its tests in the
  same commit. Each commit says what was done, not what was planned.
- **PR body** follows `.github/pull_request_template.md`: behavior over file
  lists, how to verify, open items. No secrets or `.env` contents, ever.
- **Local processes.** Only stop processes you started. If port 3000 is
  taken, use `next dev --port <other>` instead of killing what's there.

## Coding principles

**Before coding**
- State your assumptions. If a request has more than one reading, say which
  one you chose, or ask.
- If a simpler approach exists, say so. Push back when the ask looks wrong.

**Simplicity**
- Nothing beyond what was asked: no speculative options, configurability or
  abstractions for single-use code.
- No error handling for impossible states. 200 lines that could be 50:
  rewrite them.

**Surgical changes**
- Every changed line traces back to the task. Don't "improve" adjacent code,
  comments or formatting; match the existing style.
- Remove only the imports, variables and functions your change orphaned.
  Unrelated dead code or bugs you notice: mention them, don't fix them in
  the same PR.

**Test integrity**
- Never weaken an assertion, delete a test, or use `it.skip` / `it.todo` to
  get green. Never edit a test afterwards to fit the implementation.
- Tests come from the requirement, not from reading the code and asserting
  what it currently does.
- If a test looks wrong, stop and confirm with Marcelo before changing it.
- Known gaps are documented as `it.fails` and flipped when the code improves.
- Use real (anonymized) bank data as fixtures as soon as it exists: in 1.0,
  real statements found bugs that reading the code never did.

## Domain rules (finance)

- **Money is integer centavos, end to end.** Store, sum and compare
  integers; never floats, never a decimal type converted to a JS number.
  Convert at the edges only (bank payload in, formatted string out). Format
  only through `lib/format.ts` (see CLAUDE.md).
- **Missing data is never `0`.** An unknown balance, an unsynced account or
  a period with no data shows as unknown, with the reason; it is never a
  zero that looks like a real number.
- **Dates are calendar dates.** Due dates, purchase dates and invoice dates
  are `YYYY-MM-DD` values with no time of day. "Today" is the calendar date
  in `America/Sao_Paulo`. Never use local-timezone `Date` methods on them
  (`getMonth`, `toDateString`, `new Date("YYYY-MM-DD")` then local display):
  1.0 rendered and bucketed dates a day off because of this.
- **Logic is pure and dated explicitly.** Calculations (status, matching,
  card invoice, forecast, investable amount) are pure functions in `lib/`
  that take `today` as a parameter (a default is fine at the edge); no
  hidden `new Date()` inside the logic. Every one of them has tests with
  fixed dates.
- **Layers:** pure rules → data access → service (validation, ownership,
  failures, dependencies injected) → route / server action (wiring only).
  No business logic in components or route handlers.
- **Identity comes from the session, never the client.** Every id the
  client sends is re-checked for ownership before use, and every query is
  scoped to the owner, even while there is one user.
- **Bank data is untrusted input.** Open Finance payloads and Claude answers
  are validated (zod) before they touch storage. Claude only suggests; a
  deterministic rule or a person confirms.
- **Dedup by the bank's id first, fuzzy second.** Every bank line keeps the
  provider's id with a unique constraint per account. Identical amounts on
  the same day are often separate charges (tolls, withdrawals), so
  amount + date alone never proves a duplicate.
- **Privacy.** Only description (with tax ids, bank, branch and account
  numbers removed), amount and date of a line go to the Anthropic API.
  When data crosses to the client or a Claude connector, return an explicit
  field list, and test the exact key set, not just the rendered output.
- **Read-only.** Eon never moves money (see CLAUDE.md rule 5). Open Finance
  access is read-only consent; any Claude connector is read-only.

## Data and environments

- Development and production use separate databases and separate secrets.
  Never point local work, scripts or tests at production.
- Schema changes must be safe for existing production data: add nullable or
  defaulted columns, backfill, then tighten.
- Scripts that write are dry-run by default and need an explicit
  `--confirm`.
- Back up production before any destructive script, and say so in the PR.

## Env vars and secrets

- Every new env var goes into `.env.example` with a comment (what, where it
  comes from, optional or required) in the same PR, and into the host's
  settings.
- Secrets are server-side only: never `NEXT_PUBLIC_`, never in HTML, client
  bundles, logs, tests or docs. A test fails if a `NEXT_PUBLIC_` name looks
  like a secret.
- Optional integrations (Anthropic, Open Finance) **degrade gracefully**:
  without their env vars the app still runs and the feature says what's
  missing.

## UI

The design system rules are in CLAUDE.md and `docs/design/`. On top of them:

- Build screens from `components/ui` (shadcn). Missing component: add it
  there with the shadcn CLI, then use it. Eon-specific pieces go in
  `components/eon/`.
- **Color only from tokens** in `app/globals.css`. No `#hex`, `rgb()`,
  `hsl()` or `oklch()` anywhere else; a test fails naming the file and line.
  A new color is a new token, added to `docs/design/eon-tokens.css` first.
- **Icons only from `lucide-react`**, minus the banned money icons (CLAUDE.md
  rule 8, enforced by a test). An icon next to text is decorative
  (`aria-hidden`); an icon-only control needs an `aria-label`.

## Guardrails and lessons

Rules that matter are enforced by a test or a lint rule, not just written
here (`tests/guardrails.test.ts`). When you add such a rule:

- Back it with a standing test; a one-off grep during review lets the next
  regression through.
- Check the test actually fails when the rule is broken (break it on
  purpose once).
- Anchor config checks to an uncommented line; a plain substring match
  accepts commented-out config.
- State boundary values explicitly in requirements and tests ("more than
  3 days" vs "3 days or more").

## Keeping this file true

If a rule, command or step here is wrong when you follow it, fix this file
in the same commit as the code. Every command in this file and in the README
must match `package.json` literally.
