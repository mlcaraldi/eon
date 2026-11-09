import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/eon/states";
import { emptyStates, errorStates } from "@/lib/copy/states";

// Dev-only gallery of every empty and error state (docs/onboarding.md, phase 2).
export default function StatesGallery() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto flex max-w-content flex-col gap-6 px-gutter py-8">
      <h1 className="text-heading-1">Empty and error states</h1>
      <section className="grid gap-4 lg:grid-cols-2" aria-label="Empty states">
        {Object.entries(emptyStates).map(([key, c]) => (
          <EmptyState key={key} title={c.title} body={c.body} action={"action" in c && c.action ? <Button>{c.action}</Button> : undefined} />
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2" aria-label="Error states">
        {Object.entries(errorStates).map(([key, c]) => (
          <ErrorState key={key} title={c.title} body={c.body} action={c.action ? <Button variant="outline">{c.action}</Button> : undefined} />
        ))}
      </section>
    </main>
  );
}
