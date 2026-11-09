// User-facing copy for empty and error states (docs/onboarding.md).
// Kept in one place so the voice rules can be tested (tests/copy.test.ts).

export type StateCopy = { title: string; body: string; action?: string };

export const emptyStates = {
  noBanks: { title: "No banks linked.", body: "Link a bank to see this month.", action: "Link your banks" },
  neverSynced: { title: "Reading your banks.", body: "Numbers appear when the first read finishes." },
  noCommitments: { title: "No commitments yet.", body: "Eon can suggest them from your last 3 months.", action: "Review suggestions" },
  futureMonth: { title: "Nothing planned for this month.", body: "Forecasts appear after commitments are set." },
  noCardLines: { title: "No card lines yet.", body: "Card purchases appear after the first read of your card." },
  notEnoughHistory: { title: "Not enough history for averages.", body: "Averages need at least 30 days of card lines." },
} satisfies Record<string, StateCopy>;

export const errorStates = {
  declined: { title: "Not linked", body: "You didn't approve sharing for this bank. Eon can't read it.", action: "Link again" },
  expiringSoon: { title: "Access ends soon", body: "After the end date, data stops updating.", action: "Renew access" },
  expired: { title: "Access expired", body: "Numbers are as of the day access ended.", action: "Renew access" },
  providerDown: { title: "Can't reach MeuPluggy", body: "Your banks are fine. Eon will try again at the next sync.", action: "Try now" },
  bankDown: { title: "Bank unavailable", body: "The bank isn't answering. Eon shows the last data it has.", action: "Try now" },
  notInvited: { title: "This account is not invited.", body: "Eon is private. Use the account that was invited.", action: "Use another account" },
} satisfies Record<string, StateCopy>;

export const allStateCopy: StateCopy[] = [
  ...Object.values(emptyStates),
  ...Object.values(errorStates),
];
