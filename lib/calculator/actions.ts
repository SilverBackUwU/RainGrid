"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { calculateRwh, type RwhCalculationResult } from "@/lib/calculator/rwh";
import { createClient } from "@/lib/supabase/server";

export type CalculatorFormState = {
  status: "idle" | "error" | "success";
  message: string;
  result: RwhCalculationResult | null;
  fields?: {
    city?: string;
    roofArea?: string;
    familySize?: string;
    monthlyWaterUsage?: string;
  };
};

const calculatorSchema = z.object({
  city: z.string().min(1, "Select a city."),
  roofArea: z.coerce
    .number()
    .positive("Roof area must be greater than 0.")
    .max(100000, "Roof area looks too high."),
  familySize: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .int("Family size must be a whole number.")
      .positive("Family size must be greater than 0.")
      .max(100, "Family size looks too high.")
      .optional(),
  ),
  monthlyWaterUsage: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .positive("Monthly usage must be greater than 0.")
      .max(10000000, "Monthly usage looks too high.")
      .optional(),
  ),
});

function emptyToUndefined(value: unknown) {
  return value === "" || value === null ? undefined : value;
}

function formField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fieldsFrom(formData: FormData): CalculatorFormState["fields"] {
  return {
    city: formField(formData, "city"),
    roofArea: formField(formData, "roofArea"),
    familySize: formField(formData, "familySize"),
    monthlyWaterUsage: formField(formData, "monthlyWaterUsage"),
  };
}

export async function saveRwhCalculation(
  _previousState: CalculatorFormState,
  formData: FormData,
): Promise<CalculatorFormState> {
  const user = await requireUser("/calculator");
  const fields = fieldsFrom(formData);
  const parsed = calculatorSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check your inputs.",
      result: null,
      fields,
    };
  }

  const supabase = await createClient();
  const { data: rainfallData, error: rainfallError } = await supabase
    .from("rainfall_data")
    .select("city, annual_rainfall_mm")
    .eq("city", parsed.data.city)
    .single();

  if (rainfallError || !rainfallData) {
    return {
      status: "error",
      message: "Could not load rainfall data for the selected city.",
      result: null,
      fields,
    };
  }

  const rainfallMm = Number(rainfallData.annual_rainfall_mm);

  if (!Number.isFinite(rainfallMm) || rainfallMm <= 0) {
    return {
      status: "error",
      message: "Rainfall data for this city is unavailable.",
      result: null,
      fields,
    };
  }

  const result = calculateRwh({
    city: rainfallData.city,
    roofArea: parsed.data.roofArea,
    rainfallMm,
    familySize: parsed.data.familySize,
    monthlyWaterUsage: parsed.data.monthlyWaterUsage,
  });

  const { error: insertError } = await supabase.from("rwh_calculations").insert({
    user_id: user.id,
    roof_area: result.roofArea,
    city: result.city,
    rainfall_mm: result.rainfallMm,
    tank_size_liters: result.tankSizeLiters,
    estimated_cost: result.estimatedCost,
    water_saved_liters: result.waterSavedLiters,
  });

  if (insertError) {
    return {
      status: "error",
      message: insertError.message,
      result,
      fields,
    };
  }

  revalidatePath("/calculator");

  return {
    status: "success",
    message: "Calculation saved to RainGrid.",
    result,
    fields,
  };
}
