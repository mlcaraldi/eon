## What changed

<!-- 1–2 short paragraphs: the problem solved and how it shows up in the app (screens, flows, numbers). Behavior, not a file list. -->

## How to verify

1. <step>
2. <step>

**Expected result:** <what you should see>

## Checklist

- [ ] `npm run check` passes locally (lint, types, tests); CI is green
- [ ] Checked on the preview deploy, light and dark theme, phone and desktop width
- [ ] Tests added or updated for the change (or: not applicable, because …)
- [ ] Still lean: no new manual-entry step, setting or screen without a `docs/decisions.md` entry
- [ ] Data change? Safe for existing production data, never run against production from a local machine
- [ ] New env var? Added to `.env.example` and to the host, and the feature degrades gracefully without it
- [ ] AGENTS.md / CLAUDE.md / README / docs updated if a rule, command or step changed

## Open items

<!-- Known gaps, follow-ups, things deliberately left out. "None." if empty. -->
