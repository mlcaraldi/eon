/** One allow-listed account (D8). No configured address means nobody gets in. */
export function isAllowedEmail(email: string, allowed: string | null): boolean {
  const a = allowed?.trim().toLowerCase();
  if (!a) return false;
  return email.trim().toLowerCase() === a;
}

export type SignInProblem = "cancelled" | "not-invited" | "failed";

/** Maps the `error` query value on /sign-in to what the screen says. */
export function signInProblem(error: string | undefined): SignInProblem | null {
  if (!error) return null;
  if (error === "access_denied") return "cancelled";
  if (error === "unable_to_create_user" || error === "not_invited") return "not-invited";
  return "failed";
}
