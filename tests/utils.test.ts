import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("keeps design-system type sizes next to a text color", () => {
    expect(cn("text-amount-hero", "text-foreground")).toBe("text-amount-hero text-foreground");
    expect(cn("text-ui font-medium", "text-muted-foreground")).toContain("text-ui");
  });
  it("still merges conflicting sizes", () => {
    expect(cn("text-ui", "text-caption")).toBe("text-caption");
  });
});
