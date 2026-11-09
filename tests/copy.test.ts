import { describe, expect, it } from "vitest";
import { allStateCopy } from "@/lib/copy/states";

const EMOJI = /\p{Extended_Pictographic}/u;

describe("state copy follows the voice rules (CLAUDE.md rule 6)", () => {
  const strings = allStateCopy.flatMap((c) => [c.title, c.body, c.action ?? ""]);
  it("has no exclamation marks", () => {
    expect(strings.filter((s) => s.includes("!"))).toEqual([]);
  });
  it("has no emoji", () => {
    expect(strings.filter((s) => EMOJI.test(s))).toEqual([]);
  });
  it("starts every title with a capital and ends it with a full stop or a word", () => {
    expect(allStateCopy.filter((c) => !/^[A-Z]/.test(c.title))).toEqual([]);
  });
  it("never offers a money-moving action", () => {
    expect(strings.filter((s) => /\b(pay|transfer|invest now|move money)\b/i.test(s))).toEqual([]);
  });
});
