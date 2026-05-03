"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { ListingStatus, RequestStatus } from "@/lib/marketplace/types";

export type ListingFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fields?: {
    id?: string;
    availableLiters?: string;
    location?: string;
    pincode?: string;
    contactNumber?: string;
  };
};

export type MarketplaceActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

const listingSchema = z.object({
  availableLiters: z.coerce
    .number()
    .positive("Available liters must be greater than 0.")
    .max(10000000, "Available liters looks too high."),
  location: z.string().min(2, "Location is required.").max(120),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode."),
  contactNumber: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid contact number."),
});

const requestSchema = z.object({
  listingId: z.string().uuid("Invalid listing selected."),
  requestedLiters: z.coerce
    .number()
    .positive("Requested liters must be greater than 0.")
    .max(10000000, "Requested liters looks too high."),
});

const listingStatusSchema = z.enum(["available", "inactive", "fulfilled"]);
const requestStatusSchema = z.enum(["pending", "accepted", "fulfilled", "rejected"]);

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function listingFields(formData: FormData): ListingFormState["fields"] {
  return {
    id: field(formData, "id"),
    availableLiters: field(formData, "availableLiters"),
    location: field(formData, "location"),
    pincode: field(formData, "pincode"),
    contactNumber: field(formData, "contactNumber"),
  };
}

export async function createListing(
  _previousState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const user = await requireUser("/listings");
  const fields = listingFields(formData);
  const parsed = listingSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check your listing details.",
      fields,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("water_listings").insert({
    user_id: user.id,
    available_liters: parsed.data.availableLiters,
    location: parsed.data.location,
    pincode: parsed.data.pincode,
    contact_number: parsed.data.contactNumber,
    status: "available",
  });

  if (error) {
    return { status: "error", message: error.message, fields };
  }

  revalidateMarketplace();

  return {
    status: "success",
    message: "Listing published to the marketplace.",
  };
}

export async function updateListing(
  _previousState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const user = await requireUser("/listings");
  const fields = listingFields(formData);
  const id = fields?.id;
  const parsed = listingSchema.safeParse(fields);

  if (!id) {
    return { status: "error", message: "Missing listing id.", fields };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check your listing details.",
      fields,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("water_listings")
    .update({
      available_liters: parsed.data.availableLiters,
      location: parsed.data.location,
      pincode: parsed.data.pincode,
      contact_number: parsed.data.contactNumber,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { status: "error", message: error.message, fields };
  }

  revalidateMarketplace();

  return {
    status: "success",
    message: "Listing updated.",
    fields,
  };
}

export async function deleteListing(formData: FormData) {
  const user = await requireUser("/listings");
  const id = field(formData, "id");

  if (!id) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("water_listings").delete().eq("id", id).eq("user_id", user.id);

  revalidateMarketplace();
}

export async function setListingStatus(formData: FormData) {
  const user = await requireUser("/listings");
  const id = field(formData, "id");
  const parsedStatus = listingStatusSchema.safeParse(field(formData, "status"));

  if (!id || !parsedStatus.success) {
    return;
  }

  const supabase = await createClient();
  await supabase
    .from("water_listings")
    .update({ status: parsedStatus.data satisfies ListingStatus })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidateMarketplace();
}

export async function requestWater(
  _previousState: MarketplaceActionState,
  formData: FormData,
): Promise<MarketplaceActionState> {
  const user = await requireUser("/marketplace");
  const parsed = requestSchema.safeParse({
    listingId: field(formData, "listingId"),
    requestedLiters: field(formData, "requestedLiters"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check request details.",
    };
  }

  const supabase = await createClient();
  const { data: listing, error: listingError } = await supabase
    .from("water_listings")
    .select("id,user_id,available_liters,status")
    .eq("id", parsed.data.listingId)
    .eq("status", "available")
    .single();

  if (listingError || !listing) {
    return {
      status: "error",
      message: "This listing is no longer available.",
    };
  }

  if (listing.user_id === user.id) {
    return {
      status: "error",
      message: "You cannot request water from your own listing.",
    };
  }

  if (parsed.data.requestedLiters > Number(listing.available_liters)) {
    return {
      status: "error",
      message: "Requested liters exceed this listing's available supply.",
    };
  }

  const { error } = await supabase.from("water_requests").insert({
    requester_id: user.id,
    listing_id: parsed.data.listingId,
    requested_liters: parsed.data.requestedLiters,
    status: "pending",
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateMarketplace();

  return {
    status: "success",
    message: "Water request sent.",
  };
}

export async function setRequestStatus(formData: FormData) {
  const user = await requireUser("/listings");
  const id = field(formData, "id");
  const parsedStatus = requestStatusSchema.safeParse(field(formData, "status"));

  if (!id || !parsedStatus.success) {
    return;
  }

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("water_requests")
    .select("id,listing_id")
    .eq("id", id)
    .single();

  if (!request) {
    return;
  }

  const { data: listing } = await supabase
    .from("water_listings")
    .select("id,user_id")
    .eq("id", request.listing_id)
    .eq("user_id", user.id)
    .single();

  if (!listing) {
    return;
  }

  await supabase
    .from("water_requests")
    .update({ status: parsedStatus.data satisfies RequestStatus })
    .eq("id", id);

  revalidateMarketplace();
}

function revalidateMarketplace() {
  revalidatePath("/listings");
  revalidatePath("/marketplace");
  revalidatePath("/dashboard");
}
