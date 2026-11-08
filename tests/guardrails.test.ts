import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Repo rules from AGENTS.md and CLAUDE.md that lint and types can't catch.
// A rule that is only written down drifts; these fail the gate instead.

const root = join(__dirname, "..");
const codeDirs = ["app", "components", "lib", "hooks"];

function sourceFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css)$/.test(name) ? [path] : [];
  });
}

const allCode = () => codeDirs.flatMap((d) => sourceFiles(join(root, d)));

function offendingLines(files: string[], pattern: RegExp): string[] {
  return files.flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .map((line, i) => ({ line, n: i + 1 }))
      .filter(({ line }) => pattern.test(line))
      .map(({ n }) => `${relative(root, file)}:${n}`),
  );
}

describe("guardrails", () => {
  it("keeps color literals inside app/globals.css only", () => {
    const colorLiteral = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/;
    const files = allCode().filter(
      (file) => !file.endsWith(join("app", "globals.css")),
    );
    expect(offendingLines(files, colorLiteral)).toEqual([]);
  });

  it("never uses the banned money icons (CLAUDE.md rule 8)", () => {
    const banned =
      /\b(Lucide)?(PiggyBank|Coins|Banknote\w*|Wallet\w*|Rocket|TrendingUp)(Icon)?\b|lucide-react\/icons\/(piggy-bank|coins|banknote|wallet|rocket|trending-up)/;
    const files = allCode().filter((file) =>
      readFileSync(file, "utf8").includes("lucide-react"),
    );
    expect(offendingLines(files, banned)).toEqual([]);
  });

  it("keeps next dev from rewriting AGENTS.md (agentRules: false)", () => {
    const config = readFileSync(join(root, "next.config.ts"), "utf8");
    // Anchored to an uncommented line, so a commented-out flag fails.
    expect(config).toMatch(/^\s*agentRules:\s*false,?\s*$/m);
  });

  it("keeps CLAUDE.md loading AGENTS.md", () => {
    const claude = readFileSync(join(root, "CLAUDE.md"), "utf8");
    expect(claude).toMatch(/^@AGENTS\.md\s*$/m);
  });

  it("never exposes server secrets through NEXT_PUBLIC_ variables", () => {
    const secret =
      /NEXT_PUBLIC_\w*(SECRET|TOKEN|KEY|PASSWORD|DATABASE_URL|CLIENT_ID)/;
    const files = [...allCode(), join(root, ".env.example")].filter(existsSync);
    expect(offendingLines(files, secret)).toEqual([]);
  });
});
