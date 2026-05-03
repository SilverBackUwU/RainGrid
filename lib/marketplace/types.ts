export type ListingStatus = "available" | "inactive" | "fulfilled";
export type RequestStatus = "pending" | "accepted" | "fulfilled" | "rejected";

export type WaterListing = {
  id: string;
  userId: string;
  availableLiters: number;
  location: string;
  pincode: string;
  contactNumber: string;
  status: ListingStatus;
  createdAt: string;
};

export type WaterRequest = {
  id: string;
  requesterId: string;
  listingId: string;
  requestedLiters: number;
  status: RequestStatus;
  createdAt: string;
};

export type RequestWithListing = WaterRequest & {
  listing: WaterListing | null;
};

export type ListingsSummary = {
  totalListings: number;
  totalLitersAvailable: number;
  activeListings: number;
  fulfilledListings: number;
  inactiveListings: number;
};

export type MarketplaceSummary = {
  activeListings: number;
  totalLitersAvailable: number;
  locations: number;
  requestsMade: number;
  pendingRequests: number;
  acceptedRequests: number;
  fulfilledRequests: number;
};
