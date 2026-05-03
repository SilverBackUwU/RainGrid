import "server-only";

import { requireUser } from "@/lib/auth/session";
import type { RainfallCity } from "@/lib/calculator/rwh";
import { createClient } from "@/lib/supabase/server";

export async function getRainfallCities() {
  await requireUser("/calculator");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rainfall_data")
    .select("city, annual_rainfall_mm")
    .order("city", { ascending: true });

  if (error) {
    return {
      cities: [] as RainfallCity[],
      error: error.message,
    };
  }

  return {
    cities: (data ?? []).map((row) => ({
      city: String(row.city),
      annual_rainfall_mm: Number(row.annual_rainfall_mm),
    })),
    error: null,
  };
}
