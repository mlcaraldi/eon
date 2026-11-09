import {
  bigint,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Money is integer centavos (bigint, mode "number": safe far beyond any
// household amount). Dates are calendar dates (`date`, mode "string").
// Unknown is NULL, never 0 (AGENTS.md).

// Users and sessions live in Neon Auth's own `neon_auth` schema (D11). Eon rows
// keep the user id as plain text, scoped by owner in every query.

// --- Eon tables: only what the lean model needs (D1) ---

/** A bank account or card read through Open Finance. Named bank_accounts: `account` is Better Auth's. */
export const bankAccounts = pgTable(
  "bank_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    providerItemId: text("provider_item_id").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    bank: text("bank", { enum: ["nubank", "caixa"] }).notNull(),
    kind: text("kind", { enum: ["checking", "card"] }).notNull(),
    name: text("name").notNull(),
    /** Last 4 characters of the account number only. */
    mask: text("mask"),
    /** NULL when the provider gave none. Never 0 for unknown. */
    balanceCentavos: bigint("balance_centavos", { mode: "number" }),
    balanceAsOf: timestamp("balance_as_of"),
    /** NULL when unknown. */
    consentExpiresOn: date("consent_expires_on", { mode: "string" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [unique("bank_accounts_owner_provider_account").on(t.ownerId, t.providerAccountId)],
);

/** One line from the bank, kept once by the provider's own id. */
export const bankLines = pgTable(
  "bank_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    accountId: uuid("account_id").notNull().references(() => bankAccounts.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(),
    postedOn: date("posted_on", { mode: "string" }).notNull(),
    /** Signed integer centavos: negative leaves the account. */
    amountCentavos: bigint("amount_centavos", { mode: "number" }).notNull(),
    rawDescription: text("raw_description").notNull(),
    /** Raw description with tax ids and account numbers removed. */
    description: text("description").notNull(),
    providerCategory: text("provider_category"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  // Dedup by the bank's id, never by amount + date (AGENTS.md).
  (t) => [unique("bank_lines_account_provider_id").on(t.accountId, t.providerId)],
);

export const syncRuns = pgTable("sync_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id").notNull(),
  accountId: uuid("account_id").references(() => bankAccounts.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
  status: text("status", { enum: ["running", "ok", "failed"] }).notNull(),
  windowFrom: date("window_from", { mode: "string" }),
  windowTo: date("window_to", { mode: "string" }),
  linesAdded: integer("lines_added"),
  /** Short reason, never a payload or secret. */
  error: text("error"),
});
