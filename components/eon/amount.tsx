import { cn } from "@/lib/utils";
import { formatBRL, formatForecast } from "@/lib/format";

const SIZES = {
  hero: "text-amount-hero",
  lg: "text-amount-lg",
  md: "text-ui font-medium",
  sm: "text-caption",
} as const;

const TONES = {
  default: "text-foreground",
  income: "text-amount-income",
  muted: "text-muted-foreground",
} as const;

type AmountProps = {
  /** Integer centavos. */
  value: number;
  size?: keyof typeof SIZES;
  tone?: keyof typeof TONES;
  kind?: "real" | "forecast";
  signed?: boolean;
  className?: string;
};

export function Amount({
  value,
  size = "md",
  tone = "default",
  kind = "real",
  signed,
  className,
}: AmountProps) {
  const forecast = kind === "forecast";
  return (
    <span
      className={cn(
        "amount",
        SIZES[size],
        forecast ? "amount-forecast" : TONES[tone],
        className,
      )}
    >
      {forecast ? formatForecast(value) : formatBRL(value, { signed })}
    </span>
  );
}
