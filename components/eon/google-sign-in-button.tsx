"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function GoogleSignInButton() {
  return (
    <Button
      size="lg"
      className="min-h-touch w-full"
      onClick={() =>
        authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
          errorCallbackURL: "/sign-in",
        })
      }
    >
      Continue with Google
    </Button>
  );
}
