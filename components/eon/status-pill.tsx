import {
  CircleCheck,
  CircleDashed,
  Clock,
  Hourglass,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PillStatus = "paid" | "pending" | "due-soon" | "overdue" | "forecast";

const CONFIG: Record<
  PillStatus,
  { icon: LucideIcon; label: string; classes: string }
> = {
  paid: { icon: CircleCheck, label: "Paid", classes: "bg-status-paid-bg text-status-paid" },
  pending: { icon: CircleDashed, label: "Pending", classes: "bg-status-pending-bg text-status-pending" },
  "due-soon": { icon: Clock, label: "Due soon", classes: "bg-status-due-soon-bg text-status-due-soon" },
  overdue: { icon: TriangleAlert, label: "Overdue", classes: "bg-status-overdue-bg text-status-overdue" },
  forecast: {
    icon: Hourglass,
    label: "Forecast",
    classes: "border border-dashed border-status-forecast bg-transparent text-status-forecast",
  },
};

type StatusPillProps = {
  status: PillStatus;
  label?: string;
  size?: "default" | "sm" | "icon";
  /** paid + in reads "Received". */
  direction?: "in" | "out";
  className?: string;
};

/** Status is always icon + text; `icon` size keeps the text for screen readers. */
export function StatusPill({
  status,
  label,
  size = "default",
  direction = "out",
  className,
}: StatusPillProps) {
  const { icon: Icon, label: defaultLabel, classes } = CONFIG[status];
  const text = label ?? (status === "paid" && direction === "in" ? "Received" : defaultLabel);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium whitespace-nowrap",
        size === "sm" ? "px-1.5 py-0.5 text-caption" : "px-2 py-1 text-label",
        size === "icon" && "px-1.5",
        classes,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
      <span className={cn(size === "icon" && "sr-only")}>{text}</span>
    </span>
  );
}
