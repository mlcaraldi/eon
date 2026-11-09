// Copy for the sign-in screen (docs/onboarding.md, step 0).
export const signInCopy = {
  tagline: "Your month at a glance, read from your banks.",
  readOnly: "Eon only reads. It never moves money.",
  emailLabel: "Email",
  sendCode: "Send me a code",
  codeSent: "We sent a 6-digit code to this address. It expires in a few minutes.",
  codeLabel: "Code",
  verify: "Sign in",
  useAnotherEmail: "Use another email",
  cancelled: "Sign-in was cancelled. Nothing changed.",
  failed: "Sign-in didn't work. Nothing changed. Try again.",
  badCode: "That code didn't work. Check it, or ask for a new one.",
  notInvited: { title: "This account is not invited.", body: "Eon is private. Use the email that was invited." },
  notConfigured: {
    title: "Sign-in is not set up.",
    body: "These environment variables are missing. Values are never shown. See .env.example for what each one is.",
  },
} as const;
