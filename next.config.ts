import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep `next dev` from rewriting AGENTS.md/CLAUDE.md: the agent rules for
  // this repo are hand-written in AGENTS.md.
  agentRules: false,
  // Tailwind CSS v4 compiles app CSS through its Turbopack loader.
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"] },
    },
  },
};

export default nextConfig;
