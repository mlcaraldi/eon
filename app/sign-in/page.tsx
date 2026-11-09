import Image from "next/image";
import { ErrorState } from "@/components/eon/states";
import { GoogleSignInButton } from "@/components/eon/google-sign-in-button";
import { signInProblem } from "@/lib/auth/rules";
import { readConfig } from "@/lib/config";
import { signInCopy } from "@/lib/copy/sign-in";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const problem = signInProblem(typeof params.error === "string" ? params.error : undefined);
  const config = readConfig(process.env);
  const missing = [...config.database.missing, ...config.auth.missing];
  const ready = missing.length === 0;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-gutter py-12">
      <Image src="/brand/eon-horizontal-light.svg" alt="Eon" width={120} height={35} className="dark:hidden" priority />
      <Image src="/brand/eon-horizontal-dark.svg" alt="" aria-hidden width={120} height={35} className="hidden dark:block" priority />
      <h1 className="text-heading-2">{signInCopy.tagline}</h1>
      {problem === "not-invited" && <ErrorState title={signInCopy.notInvited.title} body={signInCopy.notInvited.body} />}
      {problem === "cancelled" && <p className="text-ui text-muted-foreground">{signInCopy.cancelled}</p>}
      {problem === "failed" && <p className="text-ui text-muted-foreground">{signInCopy.failed}</p>}
      {ready ? (
        <GoogleSignInButton />
      ) : (
        <ErrorState
          title={signInCopy.notConfigured.title}
          body={signInCopy.notConfigured.body}
          action={
            <ul className="list-disc pl-5 text-caption">
              {missing.map((name) => (
                <li key={name}>
                  <code>{name}</code>
                </li>
              ))}
            </ul>
          }
        />
      )}
      <p className="text-caption text-muted-foreground">{signInCopy.readOnly}</p>
    </main>
  );
}
