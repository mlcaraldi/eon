// Copy for the sign-in screen (docs/onboarding.md, step 0).
export const signInCopy = {
  tagline: "Your month at a glance, read from your banks.",
  readOnly: "Eon only reads. It never moves money.",
  cancelled: "Sign-in was cancelled. Nothing changed.",
  failed: "Sign-in didn't work. Nothing changed. Try again.",
  notInvited: { title: "This account is not invited.", body: "Eon is private. Use the account that was invited." },
  notConfigured: {
    title: "Sign-in is not set up.",
    body: "These environment variables are missing. Values are never shown. See .env.example for what each one is.",
  },
} as const;
