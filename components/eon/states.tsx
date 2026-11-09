import { Layers, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StateProps = {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
};

/** Empty state: outlined strata mark (the only illustration allowed), title, body, one action. */
export function EmptyState({ title, body, action, className }: StateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <Layers aria-hidden className="size-8 text-muted-foreground" strokeWidth={1.5} />
      <h2 className="text-heading-3">{title}</h2>
      <p className="max-w-prose text-ui text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}

/** Error state: icon + text, says what happened and offers one fix. */
export function ErrorState({ title, body, action, className }: StateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border border-status-overdue bg-card px-4 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-status-overdue">
        <TriangleAlert aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
        <h2 className="text-label">{title}</h2>
      </div>
      <p className="text-ui text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}
