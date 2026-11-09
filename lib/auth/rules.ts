/** One allow-listed account (D8). No configured address means nobody gets in. */
export function isAllowedEmail(email: string, allowed: string | null): boolean {
  const a = allowed?.trim().toLowerCase();
  if (!a) return false;
  return email.trim().toLowerCase() === a;
}

/**
 * The signed-in user may use Eon only if their address is the allowed one and
 * is verified, so nobody can claim it by signing up with it first.
 */
export function isAllowedUser(
  user: { email: string; emailVerified: boolean },
  allowed: string | null,
): boolean {
  return user.emailVerified && isAllowedEmail(user.email, allowed);
}

export type SignInProblem = "cancelled" | "not-invited" | "bad-code" | "failed";

/** Maps the `error` query value on /sign-in to what the screen says. */
export function signInProblem(error: string | undefined): SignInProblem | null {
  if (!error) return null;
  if (error === "access_denied") return "cancelled";
  if (error === "not_invited") return "not-invited";
  if (error === "bad_code") return "bad-code";
  return "failed";
}
