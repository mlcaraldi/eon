import Image from "next/image";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/eon/states";
import { Button } from "@/components/ui/button";
import { signInProblem } from "@/lib/auth/rules";
import { readConfig } from "@/lib/config";
import { signInCopy as copy } from "@/lib/copy/sign-in";
import { EmailCodeForm } from "@/components/eon/email-code-form";
import { getSessionState } from "@/lib/auth/server";
import { signOutAction } from "@/app/sign-in/actions";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const problem = signInProblem(one(params.error));
  const missing = readConfig(process.env).auth.missing;
  const state = missing.length === 0 ? await getSessionState() : { state: "signed-out" as const };
  if (state.state === "ok") redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-gutter py-12">
      <Image src="/brand/eon-horizontal-light.svg" alt="Eon" width={120} height={35} className="dark:hidden" priority />
      <Image src="/brand/eon-horizontal-dark.svg" alt="" aria-hidden width={120} height={35} className="hidden dark:block" priority />
      <h1 className="text-heading-2">{copy.tagline}</h1>
      {(problem === "not-invited" || state.state === "not-invited") && <ErrorState title={copy.notInvited.title} body={copy.notInvited.body} />}
      {problem === "cancelled" && <p className="text-ui text-muted-foreground">{copy.cancelled}</p>}
      {problem === "bad-code" && <p role="alert" className="text-ui text-status-overdue">{copy.badCode}</p>}
      {problem === "failed" && <p className="text-ui text-muted-foreground">{copy.failed}</p>}
      {missing.length > 0 ? (
        <ErrorState
          title={copy.notConfigured.title}
          body={copy.notConfigured.body}
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
      ) : state.state === "not-invited" ? (
        <form action={signOutAction}>
          <Button type="submit" variant="outline" className="min-h-touch">{copy.useAnotherEmail}</Button>
        </form>
      ) : (
        <EmailCodeForm />
      )}
      <p className="text-caption text-muted-foreground">{copy.readOnly}</p>
    </main>
  );
}
