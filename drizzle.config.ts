import { defineConfig } from "drizzle-kit";

// Migrations are an explicit step (npm run db:migrate), never part of the build.
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
