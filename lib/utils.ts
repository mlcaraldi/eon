import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Strata type scale (docs/design/eon-tokens.css). Without this, tailwind-merge
// reads `text-amount-hero` as a text color and drops it next to `text-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "amount-hero",
            "display",
            "heading-1",
            "heading-2",
            "heading-3",
            "amount-lg",
            "body",
            "ui",
            "label",
            "caption",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
