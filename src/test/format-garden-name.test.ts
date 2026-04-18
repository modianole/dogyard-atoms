import { describe, expect, it } from "vitest";
import { formatGardenName } from "@/hooks/useGardens";

describe("formatGardenName", () => {
  it("normalizes Hebrew generic names with location", () => {
    const result = formatGardenName("גינת הכלבים", "רחוב אבן גבירול 35, תל אביב");
    expect(result).toBe("גינת אבן גבירול");
  });

  it("removes numbers from Hebrew names", () => {
    const result = formatGardenName("גינת המלך ג'ורג' 35");
    expect(result).toBe("גינת המלך ג'ורג'");
  });

  it("normalizes English generic names with street", () => {
    const result = formatGardenName("Best Dog Park", "Ibn Gabirol 35, Tel Aviv", "en");
    expect(result).toBe("Dog Park Ibn Gabirol");
  });

  it("keeps English custom names while collapsing duplicate spaces", () => {
    const result = formatGardenName("  Neighborhood   Paws  ", null, "en");
    expect(result).toBe("Neighborhood Paws");
  });
});

