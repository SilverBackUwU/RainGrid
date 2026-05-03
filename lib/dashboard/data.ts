import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type DashboardProfile = {
  fullName: string | null;
  city: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
};

export type DashboardCalculation = {
  id: string;
  city: string;
  roofArea: number;
  rainfallMm: number;
  tankSizeLiters: number;
  estimatedCost: number;
  waterSavedLiters: number;
  createdAt: string | null;
};

export type DashboardListing = {
  id: string;
  status: string | null;
  litersAvailable: number;
  city: string | null;
  createdAt: string | null;
};

export type DashboardRequest = {
  id: string;
  status: string | null;
  city: string | null;
  litersRequested: number;
  createdAt: string | null;
};

export type DashboardSeriesPoint = {
  month: string;
  waterSaved: number;
  moneySaved: number;
  calculations: number;
};

export type DashboardData = {
  profile: DashboardProfile;
  calculations: DashboardCalculation[];
  listings: DashboardListing[];
  requestsMade: DashboardRequest[];
  requestsReceived: DashboardRequest[];
  kpis: {
    totalWaterSaved: number;
    totalCalculations: number;
    activeListings: number;
    requestsReceived: number;
    sustainabilityScore: number;
    estimatedMoneySaved: number;
    co2ReductionKg: number;
    groundwaterPreservedLiters: number;
    litersAvailable: number;
    pendingRequests: number;
    acceptedRequests: number;
  };
  monthlySavingsTrend: DashboardSeriesPoint[];
  cityConservation: Array<{
    city: string;
    waterSaved: number;
  }>;
  dataErrors: string[];
};

type Row = Record<string, unknown>;

const WATER_PRICE_PER_LITER = 0.018;
const CO2_KG_PER_LITER = 0.00029;
const GROUNDWATER_PRESERVATION_RATIO = 0.62;

export async function getDashboardData(): Promise<DashboardData> {
  const user = await requireUser("/dashboard");
  const supabase = await createClient();
  const dataErrors: string[] = [];

  const profileRow = await getProfileRow(supabase, user.id, dataErrors);
  const calculationRows = await getOwnedRows(
    supabase,
    "rwh_calculations",
    user.id,
    ["user_id"],
    dataErrors,
  );
  const listingRows = await getOwnedRows(
    supabase,
    "water_listings",
    user.id,
    ["user_id", "owner_id", "profile_id", "created_by"],
    dataErrors,
  );
  const requestRowsMade = await getOwnedRows(
    supabase,
    "water_requests",
    user.id,
    ["requester_id", "user_id", "created_by"],
    dataErrors,
  );
  const requestRowsReceived = await getReceivedRequests(
    supabase,
    user.id,
    listingRows,
    dataErrors,
  );

  const calculations = calculationRows.map(normalizeCalculation);
  const listings = listingRows.map(normalizeListing);
  const requestsMade = requestRowsMade.map(normalizeRequest);
  const requestsReceived = requestRowsReceived.map(normalizeRequest);
  const activeListings = listings.filter(isActiveListing);
  const allRequests = dedupeById([...requestsMade, ...requestsReceived]);
  const pendingRequests = allRequests.filter((request) =>
    statusMatches(request.status, ["pending", "open", "requested"]),
  ).length;
  const acceptedRequests = allRequests.filter((request) =>
    statusMatches(request.status, ["accepted", "approved", "fulfilled"]),
  ).length;
  const totalWaterSaved = sum(calculations, "waterSavedLiters");
  const estimatedMoneySaved = Math.round(totalWaterSaved * WATER_PRICE_PER_LITER);
  const sustainabilityScore = calculateSustainabilityScore({
    totalWaterSaved,
    totalCalculations: calculations.length,
    activeListings: activeListings.length,
    acceptedRequests,
  });

  return {
    profile: normalizeProfile(profileRow, user.email ?? null),
    calculations,
    listings,
    requestsMade,
    requestsReceived,
    kpis: {
      totalWaterSaved,
      totalCalculations: calculations.length,
      activeListings: activeListings.length,
      requestsReceived: requestsReceived.length,
      sustainabilityScore,
      estimatedMoneySaved,
      co2ReductionKg: Math.round(totalWaterSaved * CO2_KG_PER_LITER),
      groundwaterPreservedLiters: Math.round(
        totalWaterSaved * GROUNDWATER_PRESERVATION_RATIO,
      ),
      litersAvailable: sum(activeListings, "litersAvailable"),
      pendingRequests,
      acceptedRequests,
    },
    monthlySavingsTrend: buildMonthlySavingsTrend(calculations),
    cityConservation: buildCityConservation(calculations),
    dataErrors,
  };
}

async function getProfileRow(
  supabase: SupabaseClient,
  userId: string,
  dataErrors: string[],
) {
  const byId = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (byId.data) {
    return byId.data as Row;
  }

  const byUserId = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (byUserId.data) {
    return byUserId.data as Row;
  }

  if (byId.error && byUserId.error) {
    dataErrors.push(`profiles: ${byId.error.message}`);
  }

  return null;
}

async function getOwnedRows(
  supabase: SupabaseClient,
  table: string,
  userId: string,
  ownerColumns: string[],
  dataErrors: string[],
) {
  for (const column of ownerColumns) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq(column, userId)
      .order("created_at", { ascending: false });

    if (!error) {
      return (data ?? []) as Row[];
    }
  }

  dataErrors.push(`${table}: unable to match authenticated user column.`);
  return [] as Row[];
}

async function getReceivedRequests(
  supabase: SupabaseClient,
  userId: string,
  listingRows: Row[],
  dataErrors: string[],
) {
  const listingIds = listingRows
    .map((listing) => stringValue(listing, ["id"]))
    .filter(Boolean);
  const results: Row[] = [];

  if (listingIds.length > 0) {
    const { data } = await supabase
      .from("water_requests")
      .select("*")
      .in("listing_id", listingIds)
      .order("created_at", { ascending: false });

    results.push(...((data ?? []) as Row[]));
  }

  for (const column of ["recipient_id", "owner_id", "provider_id"]) {
    const { data, error } = await supabase
      .from("water_requests")
      .select("*")
      .eq(column, userId)
      .order("created_at", { ascending: false });

    if (!error) {
      results.push(...((data ?? []) as Row[]));
      return dedupeRows(results);
    }
  }

  if (results.length === 0) {
    dataErrors.push("water_requests: received request owner column not found.");
  }

  return dedupeRows(results);
}

function normalizeProfile(row: Row | null, email: string | null): DashboardProfile {
  return {
    fullName: row ? stringValue(row, ["full_name", "name", "display_name"]) : null,
    city: row ? stringValue(row, ["city", "location_city"]) : null,
    pincode: row ? stringValue(row, ["pincode", "pin_code", "postal_code"]) : null,
    phone: row ? stringValue(row, ["phone", "phone_number", "mobile"]) : null,
    email,
  };
}

function normalizeCalculation(row: Row): DashboardCalculation {
  return {
    id: stringValue(row, ["id"]) ?? crypto.randomUUID(),
    city: stringValue(row, ["city"]) ?? "Unknown",
    roofArea: numberValue(row, ["roof_area", "roofArea"]),
    rainfallMm: numberValue(row, ["rainfall_mm", "rainfallMm"]),
    tankSizeLiters: numberValue(row, ["tank_size_liters", "tankSizeLiters"]),
    estimatedCost: numberValue(row, ["estimated_cost", "estimatedCost"]),
    waterSavedLiters: numberValue(row, [
      "water_saved_liters",
      "waterSavedLiters",
    ]),
    createdAt: stringValue(row, ["created_at", "createdAt"]),
  };
}

function normalizeListing(row: Row): DashboardListing {
  return {
    id: stringValue(row, ["id"]) ?? crypto.randomUUID(),
    status: stringValue(row, ["status", "listing_status"]),
    litersAvailable: numberValue(row, [
      "liters_available",
      "available_liters",
      "water_available_liters",
      "quantity_liters",
      "water_quantity",
    ]),
    city: stringValue(row, ["city", "location_city"]),
    createdAt: stringValue(row, ["created_at", "createdAt"]),
  };
}

function normalizeRequest(row: Row): DashboardRequest {
  return {
    id: stringValue(row, ["id"]) ?? crypto.randomUUID(),
    status: stringValue(row, ["status", "request_status"]),
    city: stringValue(row, ["city", "location_city"]),
    litersRequested: numberValue(row, [
      "liters_requested",
      "requested_liters",
      "quantity_liters",
      "water_quantity",
    ]),
    createdAt: stringValue(row, ["created_at", "createdAt"]),
  };
}

function stringValue(row: Row, keys: string[]) {
  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return null;
}

function numberValue(row: Row, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    const numeric = typeof value === "number" ? value : Number(value);

    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return 0;
}

function isActiveListing(listing: DashboardListing) {
  if (!listing.status) {
    return true;
  }

  return statusMatches(listing.status, ["active", "available", "open"]);
}

function statusMatches(status: string | null, matches: string[]) {
  return status ? matches.includes(status.toLowerCase()) : false;
}

function sum<T>(rows: T[], key: keyof T) {
  return rows.reduce((total, row) => {
    const value = row[key];
    return total + (typeof value === "number" ? value : Number(value) || 0);
  }, 0);
}

function buildMonthlySavingsTrend(calculations: DashboardCalculation[]) {
  const buckets = new Map<string, DashboardSeriesPoint>();
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = monthKey(date);

    buckets.set(key, {
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      waterSaved: 0,
      moneySaved: 0,
      calculations: 0,
    });
  }

  calculations.forEach((calculation) => {
    if (!calculation.createdAt) {
      return;
    }

    const key = monthKey(new Date(calculation.createdAt));
    const bucket = buckets.get(key);

    if (!bucket) {
      return;
    }

    bucket.waterSaved += calculation.waterSavedLiters;
    bucket.moneySaved += Math.round(
      calculation.waterSavedLiters * WATER_PRICE_PER_LITER,
    );
    bucket.calculations += 1;
  });

  return Array.from(buckets.values());
}

function buildCityConservation(calculations: DashboardCalculation[]) {
  const buckets = new Map<string, number>();

  calculations.forEach((calculation) => {
    buckets.set(
      calculation.city,
      (buckets.get(calculation.city) ?? 0) + calculation.waterSavedLiters,
    );
  });

  return Array.from(buckets.entries())
    .map(([city, waterSaved]) => ({ city, waterSaved }))
    .sort((a, b) => b.waterSaved - a.waterSaved)
    .slice(0, 5);
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function calculateSustainabilityScore(input: {
  totalWaterSaved: number;
  totalCalculations: number;
  activeListings: number;
  acceptedRequests: number;
}) {
  if (
    input.totalWaterSaved === 0 &&
    input.totalCalculations === 0 &&
    input.activeListings === 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      Math.min(45, input.totalWaterSaved / 4000) +
        Math.min(25, input.totalCalculations * 5) +
        Math.min(15, input.activeListings * 5) +
        Math.min(15, input.acceptedRequests * 5),
    ),
  );
}

function dedupeRows(rows: Row[]) {
  const map = new Map<string, Row>();

  rows.forEach((row) => {
    const id = stringValue(row, ["id"]) ?? JSON.stringify(row);
    map.set(id, row);
  });

  return Array.from(map.values());
}

function dedupeById<T extends { id: string }>(rows: T[]) {
  const map = new Map<string, T>();

  rows.forEach((row) => {
    map.set(row.id, row);
  });

  return Array.from(map.values());
}
