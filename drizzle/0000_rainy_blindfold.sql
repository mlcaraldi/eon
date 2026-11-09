CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"provider_item_id" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"bank" text NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"mask" text,
	"balance_centavos" bigint,
	"balance_as_of" timestamp,
	"consent_expires_on" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bank_accounts_owner_provider_account" UNIQUE("owner_id","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "bank_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"account_id" uuid NOT NULL,
	"provider_id" text NOT NULL,
	"posted_on" date NOT NULL,
	"amount_centavos" bigint NOT NULL,
	"raw_description" text NOT NULL,
	"description" text NOT NULL,
	"provider_category" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bank_lines_account_provider_id" UNIQUE("account_id","provider_id")
);
--> statement-breakpoint
CREATE TABLE "sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"account_id" uuid,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"status" text NOT NULL,
	"window_from" date,
	"window_to" date,
	"lines_added" integer,
	"error" text
);
--> statement-breakpoint
ALTER TABLE "bank_lines" ADD CONSTRAINT "bank_lines_account_id_bank_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_runs" ADD CONSTRAINT "sync_runs_account_id_bank_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE cascade ON UPDATE no action;