export type ShippingCostInput = {
  distanceKm: number;
  baseRadiusKm: number;
  basePriceCents: number;
  extraStepKm: number;
  extraStepPriceCents: number;
};

export type ShippingCostResult = {
  totalCents: number;
  billableExtraSteps: number;
};

function assertNonNegativeNumber(value: number, field: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${field} must be a non-negative finite number`);
  }
}

function assertPositiveNumber(value: number, field: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be a positive finite number`);
  }
}

export function calculateShippingCost(input: ShippingCostInput): ShippingCostResult {
  assertNonNegativeNumber(input.distanceKm, "distanceKm");
  assertNonNegativeNumber(input.baseRadiusKm, "baseRadiusKm");
  assertNonNegativeNumber(input.basePriceCents, "basePriceCents");
  assertPositiveNumber(input.extraStepKm, "extraStepKm");
  assertNonNegativeNumber(input.extraStepPriceCents, "extraStepPriceCents");

  if (input.distanceKm <= input.baseRadiusKm) {
    return {
      billableExtraSteps: 0,
      totalCents: input.basePriceCents,
    };
  }

  const extraDistanceKm = input.distanceKm - input.baseRadiusKm;
  const billableExtraSteps = Math.ceil(extraDistanceKm / input.extraStepKm);

  return {
    billableExtraSteps,
    totalCents: input.basePriceCents + billableExtraSteps * input.extraStepPriceCents,
  };
}
