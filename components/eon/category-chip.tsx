import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type CategoryId } from "@/lib/types";

// Static class names so Tailwind can see them.
const DOT: Record<CategoryId, string> = {
  income: "bg-amount-income",
  card: "bg-chart-1",
  housing: "bg-cat-housing",
  utilities: "bg-cat-utilities",
  groceries: "bg-cat-groceries",
  dining: "bg-cat-dining",
  transport: "bg-cat-transport",
  health: "bg-cat-health",
  education: "bg-cat-education",
  shopping: "bg-cat-shopping",
  leisure: "bg-cat-leisure",
  subscriptions: "bg-cat-subscriptions",
  other: "bg-cat-other",
};

type CategoryChipProps = {
  category: CategoryId;
  size?: "default" | "lg";
  selected?: boolean;
  className?: string;
};

/** The name is always shown: color alone never carries the category. */
export function CategoryChip({
  category,
  size = "default",
  selected,
  className,
}: CategoryChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border bg-card text-foreground",
        size === "lg" ? "px-3 py-1.5 text-ui" : "px-2 py-0.5 text-caption",
        selected && "border-foreground",
        className,
      )}
    >
      <span aria-hidden className={cn("size-2 rounded-sm", DOT[category])} />
      {CATEGORY_LABELS[category]}
    </span>
  );
}
