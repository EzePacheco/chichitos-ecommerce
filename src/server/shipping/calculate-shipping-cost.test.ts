import { describe, expect, it } from "vitest";
import { calculateShippingCost } from "./calculate-shipping-cost";

const baseInput = {
  basePriceCents: 250000,
  baseRadiusKm: 3,
  distanceKm: 3,
  extraStepKm: 0.5,
  extraStepPriceCents: 75000,
};

describe("calculateShippingCost", () => {
  it("keeps the base price when distance is exactly the base radius", () => {
    expect(calculateShippingCost(baseInput)).toEqual({
      billableExtraSteps: 0,
      totalCents: 250000,
    });
  });

  it("charges one extra step when distance is barely over the base radius", () => {
    expect(calculateShippingCost({ ...baseInput, distanceKm: 3.01 })).toEqual({
      billableExtraSteps: 1,
      totalCents: 325000,
    });
  });

  it("charges one extra step at the 0.5km boundary", () => {
    expect(calculateShippingCost({ ...baseInput, distanceKm: 3.5 })).toEqual({
      billableExtraSteps: 1,
      totalCents: 325000,
    });
  });

  it("rounds up to the next extra step after each 0.5km boundary", () => {
    expect(calculateShippingCost({ ...baseInput, distanceKm: 3.51 })).toEqual({
      billableExtraSteps: 2,
      totalCents: 400000,
    });
  });
});
