import { Landmark, Link2Off, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { BANK_LABELS, type BankId } from "@/lib/types";

type BankBadgeProps = {
  bank: BankId;
  state: "connected" | "syncing" | "expired";
  /** Shown as text, e.g. "Read 7 nov". Unknown is never shown as a time. */
  lastSync?: string;
  compact?: boolean;
  className?: string;
};

const STATE = {
  connected: { icon: Landmark, text: "Connected" },
  syncing: { icon: RefreshCw, text: "Syncing" },
  expired: { icon: Link2Off, text: "Access expired" },
} as const;

export function BankBadge({ bank, state, lastSync, compact, className }: BankBadgeProps) {
  const { icon: Icon, text } = STATE[state];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-caption text-muted-foreground", className)}>
      <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
      <span className="text-foreground">{BANK_LABELS[bank]}</span>
      {!compact && (
        <span>
          {text}
          {lastSync ? ` · ${lastSync}` : ""}
        </span>
      )}
    </span>
  );
}
