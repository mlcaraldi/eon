import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep `next dev` from rewriting AGENTS.md/CLAUDE.md: the agent rules for
  // this repo are hand-written in AGENTS.md.
  agentRules: false,
};

export default nextConfig;
