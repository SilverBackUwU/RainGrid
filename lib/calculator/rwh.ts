export type RainfallCity = {
  city: string;
  annual_rainfall_mm: number;
};

export type RwhCalculationInput = {
  city: string;
  roofArea: number;
  rainfallMm: number;
  familySize?: number;
  monthlyWaterUsage?: number;
};

export type RwhCalculationResult = {
  city: string;
  roofArea: number;
  rainfallMm: number;
  harvestedWaterLiters: number;
  tankSizeLiters: number;
  tankTier: "small" | "medium" | "large";
  estimatedCost: number;
  waterSavedLiters: number;
  yearlyDemandLiters: number | null;
  coveragePercent: number;
  sustainabilityScore: number;
  roiYears: number;
  co2OffsetKg: number;
};

const RUNOFF_COEFFICIENT = 0.8;
const DAILY_PERSON_USAGE_LITERS = 135;
const WATER_PRICE_PER_LITER = 0.018;
const CO2_OFFSET_KG_PER_LITER = 0.00029;

export function formatLiters(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function calculateRwh(input: RwhCalculationInput): RwhCalculationResult {
  const harvestedWaterLiters =
    input.roofArea * input.rainfallMm * RUNOFF_COEFFICIENT;
  const tankSizeLiters = recommendTankSize(harvestedWaterLiters);
  const tankTier =
    tankSizeLiters <= 5000
      ? "small"
      : tankSizeLiters <= 10000
        ? "medium"
        : "large";
  const estimatedCost = estimateInstallationCost(tankSizeLiters);
  const yearlyDemandLiters = estimateYearlyDemand(input);
  const waterSavedLiters = yearlyDemandLiters
    ? Math.min(harvestedWaterLiters, yearlyDemandLiters)
    : harvestedWaterLiters;
  const yearlySavings = waterSavedLiters * WATER_PRICE_PER_LITER;
  const coveragePercent = yearlyDemandLiters
    ? Math.min(100, (waterSavedLiters / yearlyDemandLiters) * 100)
    : Math.min(100, (harvestedWaterLiters / 150000) * 100);
  const sustainabilityScore = Math.min(
    100,
    Math.round(45 + coveragePercent * 0.4 + Math.min(15, input.roofArea / 8)),
  );

  return {
    city: input.city,
    roofArea: input.roofArea,
    rainfallMm: input.rainfallMm,
    harvestedWaterLiters: Math.round(harvestedWaterLiters),
    tankSizeLiters,
    tankTier,
    estimatedCost,
    waterSavedLiters: Math.round(waterSavedLiters),
    yearlyDemandLiters: yearlyDemandLiters ? Math.round(yearlyDemandLiters) : null,
    coveragePercent: Math.round(coveragePercent),
    sustainabilityScore,
    roiYears: Math.max(1, Math.round((estimatedCost / yearlySavings) * 10) / 10),
    co2OffsetKg: Math.round(waterSavedLiters * CO2_OFFSET_KG_PER_LITER),
  };
}

function recommendTankSize(harvestedWaterLiters: number) {
  if (harvestedWaterLiters <= 75000) {
    return 5000;
  }

  if (harvestedWaterLiters <= 150000) {
    return 10000;
  }

  const bufferStorage = harvestedWaterLiters / 10;
  return Math.max(15000, Math.ceil(bufferStorage / 5000) * 5000);
}

function estimateInstallationCost(tankSizeLiters: number) {
  const baseSystemCost = 28000;
  const tankCost = tankSizeLiters * 7.2;
  const filtrationAndPlumbing = tankSizeLiters <= 10000 ? 24000 : 36000;

  return Math.round((baseSystemCost + tankCost + filtrationAndPlumbing) / 1000) * 1000;
}

function estimateYearlyDemand(input: RwhCalculationInput) {
  if (input.monthlyWaterUsage && input.monthlyWaterUsage > 0) {
    return input.monthlyWaterUsage * 12;
  }

  if (input.familySize && input.familySize > 0) {
    return input.familySize * DAILY_PERSON_USAGE_LITERS * 365;
  }

  return null;
}
