# Onboarding

How a new person goes from "I just got the link" to "I see this month, and I
trust it". Eon 2.0 is built so that this path is part of the product, not a
help page written afterwards. Each phase in `docs/roadmap.md` has onboarding
acceptance criteria below; a phase is not done until they pass.

Written 08 nov 2026. Rules: `CLAUDE.md` (voice, tokens, read-only) and
`AGENTS.md` (lean model, missing data is never `0`). Decision entries
referenced here are in `docs/decisions.md`.

## Who this is for, and what "ready" means

Eon serves one household (one allow-listed account, D8). "New user" still
matters: Marcelo on day one, his partner later, and Marcelo again after a
consent expires or the database is reset. The design has to work for someone
who has never heard of Open Finance.

**Ready** means a new person can, with no help and no documentation outside
the app:

1. Sign in and understand what Eon does and does not do (it never moves money).
2. Link their banks and know exactly what was shared, for how long, and how to
   revoke it.
3. See the current month with correct paid and pending statuses within
   **10 minutes of first sign-in**, of which at most **5 are their own
   attention** (the rest is waiting for the bank).
4. Read every number and status and know why it is what it is.
5. Recover from every failure state (consent expired, sync failed, bank
   missing) by following the screen, not by guessing.

Timing is a test target, measured by walking the flow on a real account
(phase 4 exit).

## Principles

1. **Answer first.** Every screen opens with the thing the person came for;
   explanation sits one line below it, never in a tour or a modal.
2. **No tour, no checklist widget.** The first-run experience is one linear
   setup (4 steps, below), then the product. Nothing to dismiss afterwards.
3. **Explain at the point of doubt.** A status, an `≈`, a dashed number each
   has a one-line reason reachable from the number itself (tooltip on
   desktop, tap on phone). No separate glossary page.
4. **Unknown is not zero.** Before the first sync completes, every figure
   reads "No data yet" with the reason, never `R$ 0,00` (AGENTS.md).
5. **No manual entry to get started.** The only thing the person creates is
   the list of commitments, and Eon proposes it from their bank lines first
   (D1, D4). Setup never asks for an amount that the bank already knows.
6. **Read-only is visible.** The words "read-only" and "Eon cannot move your
   money" appear before the bank step, on the consent step, and in settings.
7. **Calm voice.** English copy, Brazilian money and dates, sentence case, no
   exclamation marks, no emoji, no urgency theater (CLAUDE.md rule 6).
8. **Recoverable.** Every blocked state has one primary action that fixes it
   and says what will happen when pressed.

## The path, step by step

```
Sign in → Welcome → Link banks → First sync → Commitments → Month view
  (D8)     step 1     step 2      step 3       step 4        (home)
```

Setup is resumable: progress is derived from data (are there linked
accounts? a completed sync? confirmed commitments?), never from a stored
"onboarding done" flag, so it cannot get out of step with reality (same
reasoning as D4). A returning person lands on the first unfinished step.

### 0 · Sign in

- **Screen:** logo, one line ("Your month at a glance, read from your
  banks."), one button "Continue with Google". Below, small: "Eon only reads.
  It never moves money."
- **Person must know:** nothing yet.
- **App explains:** that access is by invitation only.
- **Not on the allow list:** "This account is not invited." with the email
  shown and a "Use another account" action. No account is created, nothing
  is stored (rule: identity from session, allow-list from env).
- **Missing config** (no Google keys, no allow list): a developer-facing
  panel that names the missing env vars and links `.env.example`, never a
  blank page or a stack trace. The app degrades gracefully (AGENTS.md).
- **Errors:** sign-in cancelled returns to the same screen with "Sign-in was
  cancelled. Nothing changed."

### 1 · Welcome (one screen, under 30 seconds)

- **Purpose:** set expectations in three lines, each with a Lucide icon
  (no illustrations beyond outlined strata, handoff §6):
  1. "Eon reads your accounts and card from your banks, read-only."
  2. "It lists what you owe this month and marks each one paid when the
     money leaves your account. You never tick anything."
  3. "It shows one number: how much you can invest this month."
- **Action:** "Link your banks" (primary). A secondary link "How your data is
  used" opens the privacy panel (see Privacy messaging).
- **Person must know:** they will be sent to their bank apps to approve
  sharing; this takes a few minutes and Eon waits.

### 2 · Link banks

The provider flow (MeuPluggy over Open Finance, D9) is the one step Eon does
not control, so it gets the most explanation.

- **Before leaving Eon**, a pre-consent screen lists: which banks Eon will
  ask for (name, with `BankBadge`), what is read (balances, account lines,
  card lines and invoices, no passwords, no ability to move money), the
  consent length (shown from the provider's real value, never invented), and
  "You can revoke this at any time in your bank app or in MeuPluggy."
  Button: "Continue to MeuPluggy". The screen says plainly that the next page
  belongs to MeuPluggy, and that returning to Eon happens automatically.
- **During the redirect:** the return URL lands on a "Checking your
  connection…" state (Skeleton rows, `RefreshCw` icon with text, not a bare
  spinner) that resolves within seconds or moves to an error state.
- **After return, success:** one row per linked bank (`BankBadge`, product
  names such as "Checking" and "Card", last 4 characters of the account
  number only), state "Linked", and the consent expiry date ("Access until
  10 feb 2027"). Banks the person expected but that did not return are
  listed as "Not linked" with "Link again".
- **Partial result is normal:** if Nubank returned but Caixa did not, the
  person can continue; Eon never blocks on all-or-nothing. The month view
  then shows what is missing per rule 4 below (unknown, with reason).
- **Person must know:** that "Linked" does not mean "synced"; the next step
  shows progress.

**Error and re-consent states** (used in setup and after, one component set
in `components/eon/states.tsx`, `ErrorState` with an action):

| State | Icon + text | What the screen says | Primary action |
| --- | --- | --- | --- |
| Consent declined at the bank | `Link2Off` Not linked | "You didn't approve sharing for Caixa. Eon can't read it." | Link again |
| Consent expires within 14 days | `Clock` Expires 24 nov | "Access to Nubank ends on 24 nov. After that, data stops updating." | Renew access |
| Consent expired | `Link2Off` Expired | "Access to Nubank ended on 24 nov. Numbers below are as of that day." | Renew access |
| Provider unreachable | `TriangleAlert` Can't reach MeuPluggy | "Your banks are fine. Eon will try again at the next sync." | Try now |
| Bank temporarily unavailable | `TriangleAlert` Caixa unavailable | "Caixa isn't answering. Last data: 7 nov." | Try now |
| Credentials missing in Eon | `TriangleAlert` Setup incomplete | Names the env var, never prints its value | none (developer note) |

Renewing always goes through the same pre-consent screen so the person sees
what they are agreeing to again.

### 3 · First sync

- **Purpose:** pull 90 days of lines (roadmap phase 3) and say what is
  happening, because this is the longest wait.
- **Screen:** per account, a line with state `RefreshCw` Syncing / `CircleCheck`
  Done / `TriangleAlert` Failed, and a plain count when done ("212 lines from
  9 aug to 8 nov"). A sentence under it: "This usually takes a minute. You
  can leave this page; Eon keeps going."
- **Never blocks the person.** "Continue" is enabled as soon as at least one
  account is done.
- **Person must know:** only what happened in the last 90 days is read, and
  Eon refreshes daily.
- **Failure:** per-account `ErrorState` with "Try now"; the other accounts
  continue. A failed first sync leaves the person in this step on return.

### 4 · Commitments (the only setup that takes thought)

A commitment is something that leaves the account every month: the
financing, condo fee, utilities, subscriptions, the card invoice. This is
the one list the bank cannot hand over directly, so Eon proposes it.

- **Proposal, not a blank form.** From recurring bank lines (same merchant
  key, roughly monthly, 3 or more occurrences), Eon lists candidates:
  name, typical amount (or range), usual due day, account. The card invoice
  and the salary are proposed first, labeled "Card invoice" and "Income".
- **One decision per row:** "Keep", "Not a commitment" (hides it, reversible),
  or edit name/amount/day. Keep is one tap. A header sentence says: "Eon
  found 9 things that repeat. Keep the ones you want on your month."
- **End dates:** a row can carry an end month (the financing ends 2034);
  asked only when installments or a known end are detected, never as an
  empty field.
- **Nothing found** (new account, less than 2 months of data): the empty
  state says so and offers "Add a commitment" (name, amount, due day) for the
  few that cannot be detected, plus "Skip for now": the month view then
  works with whatever matched. This is a decision-log item: it is the single
  allowed manual entry and exists because the bank feed cannot supply it
  (AGENTS.md, lean first). Recorded as D11 when phase 4 is built.
- **Person must know:** how paid will be set. A single line under the list:
  "Eon marks a commitment paid when a matching line leaves your account. You
  never mark anything yourself."
- **Done** when at least one commitment is kept or the person chose Skip.

### 5 · Month view (home)

The setup ends here and never comes back. First-run extras, shown once and
derived from data (not a stored flag):

- A single non-dismiss-required line above the summary when data is
  partial: "Showing Nubank and Caixa. Caixa was last read on 7 nov."
- Nothing else. No confetti, no "you're all set".

#### How paid, pending and the invoice are explained

Explanations live at the number, not in a tutorial.

- **Status pill** tap/hover opens a one-line reason with the evidence:
  - Paid: "Matched to a debit of R$ 6.495,31 on 5 nov at Caixa."
  - Pending: "No matching debit yet. Due 15 nov."
  - Due soon: "Due in 2 days. No matching debit yet."
  - Overdue: "Due 3 nov. No matching debit found. If you paid from an account
    Eon can't see, it will stay overdue (D4, open point)."
- **"Why isn't this paid?"** for pending/overdue items shows what Eon looked
  for: expected amount, date window, account. This replaces a "mark as paid"
  button (D4) and makes a missed match debuggable.
- **Card invoice** is a single row labeled "Nubank card invoice" with its
  due date. Its detail screen (phase 5) explains in one paragraph: "The card
  is one bill. Individual purchases are shown only to explain where the
  money went." The invoice is marked paid when the card payment line shows
  on the checking account.
- **Forecast values** (dashed, `≈`) carry their reason: "Estimate: average
  of your last 3 months of card spending."
- **Available to invest** shows its formula on tap: income minus
  commitments minus projected invoice minus buffer, every term a number.
  Negative values are shown as is (`−R$ 544,75`) with "Not enough this
  month", never hidden.

## Empty and unknown states

One reusable `EmptyState` (title, body, action) in `components/eon/states.tsx`.
Strata outline illustration only. Required copy:

| Where | Condition | Title and body | Action |
| --- | --- | --- | --- |
| Month view | No account linked | "No banks linked." "Link a bank to see this month." | Link your banks |
| Month view | Linked, never synced | "Reading your banks." "Numbers appear when the first read finishes." | none (progress shown) |
| Month view | No commitments | "No commitments yet." "Eon can suggest them from your last 3 months." | Review suggestions |
| Month view | Future month with no data | "Nothing planned for December." "Forecasts appear after commitments are set." | none |
| Summary figures | Data unknown | "No data" + reason (never `R$ 0,00`) | per reason |
| Invoice screen | Card not linked / no lines | "No card lines yet." with reason | Link / Try now |
| Categories | Fewer than 30 days of card lines | "Not enough history for averages." | none |
| Settings > Banks | None linked | Same as "No banks linked." | Link your banks |

## Privacy messaging

Shown in three places, same facts, one source (`lib/copy/privacy.ts`, so they
cannot drift): pre-consent screen, a "How your data is used" panel from
Welcome and Settings, and the footer of Settings > Banks.

Facts, each in plain language:

- **Read-only.** Eon cannot move, pay or invest money.
- **What is read:** accounts, balances, account and card lines, card
  invoices. Never passwords: you sign in at your bank.
- **Where it lives:** Eon's database (Neon), only readable by your account.
- **What leaves Eon:** nothing is sold or shared. If category suggestions or
  the Claude connector are on, only description (with tax ids and account
  numbers removed), amount and date are sent, and the panel says which of
  the two is on (D10, AGENTS.md).
- **Revoking:** in your bank app or MeuPluggy to stop access; "Remove my
  Eon data" in Settings to delete what Eon stores (dialog, lists what is
  removed, says it cannot be undone, CLAUDE.md rule 5).

## Settings that onboarding depends on

Kept to the minimum. Settings > Banks only: linked banks with state, last
sync time, consent expiry, "Sync now", "Renew access", "Remove". Settings >
Data: "How your data is used", "Remove my Eon data". Theme follows system
with a toggle. No other settings exist at launch.

## Acceptance criteria per phase

A phase's onboarding criteria are checked in addition to its roadmap exit.
"Walkthrough" means a fresh account (empty database) walked end to end by
someone who has not read this file, on phone width and desktop, light and
dark.

| Phase | Onboarding criteria |
| --- | --- |
| 0 Foundations | `docs/onboarding.md` merged. `.env.example` documents every env var with a line each for "what happens without it". README has a "First run" section: clone, env, `npm run dev`, what you will see. |
| 1 Spike | Findings note records, for onboarding: consent length, what the provider shows at consent, redirect/return behavior, what a partial consent looks like, how expiry surfaces. These replace the placeholders in steps 2 and 3. |
| 2 Design system, month view on sample | `EmptyState`, `ErrorState`, `StatusPill` with reason, `Skeleton` states exist and are shown on a dev-only gallery route for every condition in the empty-state table and error table (sample data). Tooltip/tap reasons present on every pill and `≈` value. Copy passes the voice rules by test (no `!`, no emoji). |
| 3 Data, auth, sync | Steps 0 to 3 work end to end: sign-in with allow list, "not invited" state, welcome, pre-consent screen, link, first-sync progress, per-account failure, partial link. Missing env vars produce a named, specific message. Unknown figures show "No data" before first sync, covered by a test. Consent expiry date stored and shown. Walkthrough on a fresh database reaches "synced" in under 10 minutes of real time. |
| 4 Commitments | Step 4: suggestions from recurring lines, Keep / Not a commitment / edit, skip path, the only manual add is for undetected items and has a decision entry (D11). Every status has an evidence line and a "Why isn't this paid?" view. First-run through the month view needs no manual toggles. Time to first correct month view under 10 minutes, attention under 5, measured on Marcelo's real accounts. |
| 5 Invoice and categories | Invoice screen opens with the "one bill" explanation; installments explained once (`3/10` means installment 3 of 10). Category fixes explain "applies to future charges from this merchant". "Not enough history" empty state verified with a new account. |
| 6 Forecast and investable | Every forecast value has a reason line; the formula view for "available to invest" shows all terms; negative and unknown cases verified (no `0` for unknown). Copy reviewed for not sounding like investment advice (product tells how much, not where). |
| 7 Claude, read-only | Settings shows connector state (off/on), what fields it exposes, and how to revoke its token. The privacy panel updates automatically when it is on. Connection steps are written for claude.ai ("Add connector, paste this URL, approve") and tested once end to end. |

Across all phases: a Playwright or Vitest-level test for the setup state
machine ("first unfinished step" derived from data) and tests that every
user-facing string in `lib/copy/` passes the voice checks (no exclamation
marks, no emoji, sentence case).

## Re-onboarding and other lifecycle cases

| Case | Behavior |
| --- | --- |
| Consent expired | Banner on month view ("Nubank access ended 24 nov"), figures dimmed as "as of 24 nov", Renew access. Never silently stale. |
| New bank later | Settings > Banks > "Link another bank" reuses step 2 and 3. |
| Bank unlinked | Its commitments stay, matches stop, statuses fall back to pending with "Account not linked". |
| Database reset / new device | Sign-in lands on the first unfinished step; nothing is assumed from the browser. |
| Second person | Not supported (roadmap out of scope); the "not invited" screen is the answer. |
| Remove my data | Dialog listing what is deleted and what is not (the bank-side consent remains until revoked there); after removal the app returns to step 1. |

## Open questions

These are answered by earlier phases, not guessed now:

- Consent length, return flow and partial-consent behavior (phase 1).
- Whether the provider offers an embeddable connect widget or only the
  MeuPluggy redirect (phase 1); step 2 is written for the redirect, the
  safer assumption.
- D4's open point for commitments paid outside linked accounts (phase 4);
  the overdue copy above is a placeholder until then.
