import "server-only";

import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  type ListingStatus,
  type ListingsSummary,
  type MarketplaceSummary,
  type RequestStatus,
  type RequestWithListing,
  type WaterListing,
  type WaterRequest,
} from "@/lib/marketplace/types";

type ListingRow = {
  id: string;
  user_id: string;
  available_liters: number | string | null;
  location: string | null;
  pincode: string | null;
  contact_number: string | null;
  status: string | null;
  created_at: string;
};

type RequestRow = {
  id: string;
  requester_id: string;
  listing_id: string;
  requested_liters: number | string | null;
  status: string | null;
  created_at: string;
};

export async function getListingsPageData() {
  const user = await requireUser("/listings");
  const supabase = await createClient();

  const { data: listingRows, error: listingsError } = await supabase
    .from("water_listings")
    .select("id,user_id,available_liters,location,pincode,contact_number,status,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const listings = ((listingRows ?? []) as ListingRow[]).map(normalizeListing);
  const listingIds = listings.map((listing) => listing.id);
  const incomingRequests = listingIds.length
    ? await getRequestsForListings(listingIds)
    : [];

  return {
    listings,
    incomingRequests,
    summary: buildListingsSummary(listings),
    error: listingsError?.message ?? null,
  };
}

export async function getMarketplacePageData() {
  const user = await requireUser("/marketplace");
  const supabase = await createClient();

  const { data: listingRows, error: listingsError } = await supabase
    .from("water_listings")
    .select("id,user_id,available_liters,location,pincode,contact_number,status,created_at")
    .eq("status", "available")
    .neq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: requestRows, error: requestsError } = await supabase
    .from("water_requests")
    .select("id,requester_id,listing_id,requested_liters,status,created_at")
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false });

  const listings = ((listingRows ?? []) as ListingRow[]).map(normalizeListing);
  const requests = ((requestRows ?? []) as RequestRow[]).map(normalizeRequest);
  const requestListingIds = requests.map((request) => request.listingId);
  const requestListings = requestListingIds.length
    ? await getListingsById(requestListingIds)
    : [];
  const listingsById = new Map(
    requestListings.map((listing) => [listing.id, listing]),
  );

  const requestHistory: RequestWithListing[] = requests.map((request) => ({
    ...request,
    listing: listingsById.get(request.listingId) ?? null,
  }));

  return {
    listings,
    requestHistory,
    summary: buildMarketplaceSummary(listings, requests),
    error: listingsError?.message ?? requestsError?.message ?? null,
  };
}

async function getRequestsForListings(listingIds: string[]) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("water_requests")
    .select("id,requester_id,listing_id,requested_liters,status,created_at")
    .in("listing_id", listingIds)
    .order("created_at", { ascending: false });

  const requests = ((data ?? []) as RequestRow[]).map(normalizeRequest);
  const listingMap = new Map(
    (await getListingsById(listingIds)).map((listing) => [listing.id, listing]),
  );

  return requests.map((request) => ({
    ...request,
    listing: listingMap.get(request.listingId) ?? null,
  }));
}

async function getListingsById(ids: string[]) {
  const supabase = await createClient();
  const uniqueIds = Array.from(new Set(ids));
  const { data } = await supabase
    .from("water_listings")
    .select("id,user_id,available_liters,location,pincode,contact_number,status,created_at")
    .in("id", uniqueIds);

  return ((data ?? []) as ListingRow[]).map(normalizeListing);
}

function normalizeListing(row: ListingRow): WaterListing {
  return {
    id: row.id,
    userId: row.user_id,
    availableLiters: Number(row.available_liters) || 0,
    location: row.location ?? "",
    pincode: row.pincode ?? "",
    contactNumber: row.contact_number ?? "",
    status: normalizeListingStatus(row.status),
    createdAt: row.created_at,
  };
}

function normalizeRequest(row: RequestRow): WaterRequest {
  return {
    id: row.id,
    requesterId: row.requester_id,
    listingId: row.listing_id,
    requestedLiters: Number(row.requested_liters) || 0,
    status: normalizeRequestStatus(row.status),
    createdAt: row.created_at,
  };
}

function buildListingsSummary(listings: WaterListing[]): ListingsSummary {
  return {
    totalListings: listings.length,
    totalLitersAvailable: listings.reduce(
      (total, listing) =>
        listing.status === "available" ? total + listing.availableLiters : total,
      0,
    ),
    activeListings: listings.filter((listing) => listing.status === "available")
      .length,
    fulfilledListings: listings.filter((listing) => listing.status === "fulfilled")
      .length,
    inactiveListings: listings.filter((listing) => listing.status === "inactive")
      .length,
  };
}

function buildMarketplaceSummary(
  listings: WaterListing[],
  requests: WaterRequest[],
): MarketplaceSummary {
  const locations = new Set(
    listings.map((listing) => listing.location.toLowerCase()).filter(Boolean),
  );

  return {
    activeListings: listings.length,
    totalLitersAvailable: listings.reduce(
      (total, listing) => total + listing.availableLiters,
      0,
    ),
    locations: locations.size,
    requestsMade: requests.length,
    pendingRequests: requests.filter((request) => request.status === "pending")
      .length,
    acceptedRequests: requests.filter((request) => request.status === "accepted")
      .length,
    fulfilledRequests: requests.filter((request) => request.status === "fulfilled")
      .length,
  };
}

function normalizeListingStatus(status: string | null): ListingStatus {
  if (status === "inactive" || status === "fulfilled") {
    return status;
  }

  return "available";
}

function normalizeRequestStatus(status: string | null): RequestStatus {
  if (
    status === "accepted" ||
    status === "fulfilled" ||
    status === "rejected"
  ) {
    return status;
  }

  return "pending";
}
