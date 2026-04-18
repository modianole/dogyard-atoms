import { describe, expect, it } from "vitest";
import { resolveSafeNextPath } from "@/lib/authRedirect";

describe("resolveSafeNextPath", () => {
  it("falls back to root when path is missing", () => {
    expect(resolveSafeNextPath(undefined)).toBe("/");
    expect(resolveSafeNextPath(null)).toBe("/");
    expect(resolveSafeNextPath("")).toBe("/");
  });

  it("rejects external and non-absolute values", () => {
    expect(resolveSafeNextPath("https://evil.example")).toBe("/");
    expect(resolveSafeNextPath("map")).toBe("/");
  });

  it("blocks loops back to auth screens", () => {
    expect(resolveSafeNextPath("/auth")).toBe("/");
    expect(resolveSafeNextPath("/auth/callback")).toBe("/");
  });

  it("allows valid internal app routes", () => {
    expect(resolveSafeNextPath("/map")).toBe("/map");
    expect(resolveSafeNextPath("/garden/123?tab=info")).toBe("/garden/123?tab=info");
  });
});

