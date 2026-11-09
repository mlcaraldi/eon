"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { signInCopy as copy } from "@/lib/copy/sign-in";

/** Two steps: ask for a code by email, then enter it. No password is ever stored. */
export function EmailCodeForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email: email.trim().toLowerCase(), type: "sign-in" });
    setBusy(false);
    if (error) return setMessage(copy.failed);
    setMessage(null);
    setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await authClient.signIn.emailOtp({ email: email.trim().toLowerCase(), otp: code.trim() });
    setBusy(false);
    if (error) return setMessage(copy.badCode);
    router.push("/");
    router.refresh();
  }

  return step === "email" ? (
    <form onSubmit={send} className="flex flex-col gap-3">
      <label className="text-label" htmlFor="email">{copy.emailLabel}</label>
      <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-touch" />
      {message && <p role="alert" className="text-ui text-muted-foreground">{message}</p>}
      <Button type="submit" size="lg" disabled={busy} className="min-h-touch">{copy.sendCode}</Button>
    </form>
  ) : (
    <form onSubmit={verify} className="flex flex-col gap-3">
      <p className="text-ui text-muted-foreground">{copy.codeSent}</p>
      <label className="text-label" htmlFor="code">{copy.codeLabel}</label>
      <Input id="code" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value)} className="min-h-touch" />
      {message && <p role="alert" className="text-ui text-status-overdue">{message}</p>}
      <Button type="submit" size="lg" disabled={busy} className="min-h-touch">{copy.verify}</Button>
      <Button type="button" variant="link" onClick={() => { setStep("email"); setCode(""); setMessage(null); }}>{copy.useAnotherEmail}</Button>
    </form>
  );
}
