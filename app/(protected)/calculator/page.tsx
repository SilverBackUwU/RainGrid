import type { Metadata } from "next";
import { RwhCalculator } from "@/components/calculator/rwh-calculator";
import { getRainfallCities } from "@/lib/calculator/data";

export const metadata: Metadata = {
  title: "Calculator | RainGrid",
};

export default async function CalculatorPage() {
  const { cities, error } = await getRainfallCities();

  return <RwhCalculator cities={cities} error={error} />;
}
