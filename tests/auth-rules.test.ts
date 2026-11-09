import { describe, expect, it } from "vitest";
import { isAllowedEmail, signInProblem } from "@/lib/auth/rules";

describe("isAllowedEmail", () => {
  it("allows only the configured address, case-insensitively", () => {
    expect(isAllowedEmail("Me@Example.com", "me@example.com")).toBe(true);
    expect(isAllowedEmail(" me@example.com ", "me@example.com")).toBe(true);
  });
  it("rejects every other address", () => {
    expect(isAllowedEmail("you@example.com", "me@example.com")).toBe(false);
    expect(isAllowedEmail("me@example.com.evil.com", "me@example.com")).toBe(false);
    expect(isAllowedEmail("xme@example.com", "me@example.com")).toBe(false);
  });
  it("rejects everyone when no address is configured", () => {
    expect(isAllowedEmail("me@example.com", null)).toBe(false);
    expect(isAllowedEmail("", "")).toBe(false);
  });
});

describe("signInProblem", () => {
  it("maps a cancelled sign-in to a calm message", () => {
    expect(signInProblem("access_denied")).toBe("cancelled");
  });
  it("treats a rejected account as not invited", () => {
    expect(signInProblem("unable_to_create_user")).toBe("not-invited");
    expect(signInProblem("not_invited")).toBe("not-invited");
  });
  it("has no problem when there is no error", () => {
    expect(signInProblem(undefined)).toBeNull();
  });
  it("shows anything else as a generic failure", () => {
    expect(signInProblem("whatever")).toBe("failed");
  });
});
