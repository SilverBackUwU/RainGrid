"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Droplets,
  Filter,
  History,
  MapPin,
  Phone,
  Search,
  Send,
  Store,
  Waves,
} from "lucide-react";
import { RequestWaterModal } from "@/components/marketplace/request-water-modal";
import { StatusPill } from "@/components/marketplace/status-pill";
import { formatDateShort, formatLitersCompact } from "@/lib/marketplace/format";
import type {
  MarketplaceSummary,
  RequestWithListing,
  WaterListing,
} from "@/lib/marketplace/types";

type CommunityMarketplaceProps = {
  listings: WaterListing[];
  requestHistory: RequestWithListing[];
  summary: MarketplaceSummary;
  error?: string | null;
};

export function CommunityMarketplace({
  listings,
  requestHistory,
  summary,
  error,
}: CommunityMarketplaceProps) {
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState("all");
  const [selectedListing, setSelectedListing] = useState<WaterListing | null>(
    null,
  );
  const locations = useMemo(
    () =>
      Array.from(
        new Set(listings.map((listing) => listing.location).filter(Boolean)),
      ).sort(),
    [listings],
  );
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesPincode = pincode
        ? listing.pincode.includes(pincode.trim())
        : true;
      const matchesLocation =
        location === "all" ||
        listing.location.toLowerCase() === location.toLowerCase();

      return matchesPincode && matchesLocation;
    });
  }, [listings, location, pincode]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8">
      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 text-white shadow-xl shadow-zinc-300/40">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-200">
              <Store className="h-4 w-4" aria-hidden="true" />
              Community marketplace
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Find available harvested water nearby
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
              Discover active listings from other RainGrid users, filter by
              pincode or location, and request water in one secure flow.
            </p>
            {error ? (
              <p className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            ) : null}
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-medium text-zinc-400">
              Marketplace liquidity
            </p>
            <p className="mt-5 text-5xl font-semibold">
              {formatLitersCompact(summary.totalLitersAvailable)} L
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Across {summary.activeListings} active listings and{" "}
              {summary.locations} locations.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Store}
          label="Active listings"
          value={String(summary.activeListings)}
          detail="Other users only"
        />
        <SummaryCard
          icon={Droplets}
          label="Liters available"
          value={`${formatLitersCompact(summary.totalLitersAvailable)} L`}
          detail="Community supply"
        />
        <SummaryCard
          icon={MapPin}
          label="Locations"
          value={String(summary.locations)}
          detail="Distinct areas"
        />
        <SummaryCard
          icon={Send}
          label="Requests made"
          value={String(summary.requestsMade)}
          detail="Your request history"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  Active listings
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Search live marketplace supply from Supabase.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px]">
                <label className="relative block">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                  <input
                    value={pincode}
                    onChange={(event) => setPincode(event.target.value)}
                    placeholder="Search pincode"
                    className="h-11 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="relative block">
                  <Filter
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                  <select
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-11 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="all">All locations</option>
                    {locations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
          {filteredListings.length ? (
            <div className="grid gap-4 p-5 lg:grid-cols-2">
              {filteredListings.map((listing) => (
                <MarketplaceCard
                  key={listing.id}
                  listing={listing}
                  onRequest={() => setSelectedListing(listing)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Waves}
              title="No active listings match"
              text="Adjust filters or check back when another user publishes supply."
            />
          )}
        </div>

        <RequestHistory requestHistory={requestHistory} summary={summary} />
      </section>

      <RequestWaterModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-200/70">
      <div className="mb-6 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
          <Icon className="h-5 w-5" aria-hidden={true} />
        </span>
        <ArrowUpRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </article>
  );
}

function MarketplaceCard({
  listing,
  onRequest,
}: {
  listing: WaterListing;
  onRequest: () => void;
}) {
  return (
    <article className="group rounded-lg border border-zinc-200 bg-zinc-50 p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Available water</p>
          <h3 className="mt-2 text-3xl font-semibold text-zinc-950">
            {formatLitersCompact(listing.availableLiters)} L
          </h3>
        </div>
        <StatusPill status={listing.status} />
      </div>
      <div className="mt-5 space-y-2 text-sm text-zinc-600">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          {listing.location} · {listing.pincode}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          {listing.contactNumber}
        </p>
        <p className="text-xs text-zinc-500">
          Posted {formatDateShort(listing.createdAt)}
        </p>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Request water
      </button>
    </article>
  );
}

function RequestHistory({
  requestHistory,
  summary,
}: {
  requestHistory: RequestWithListing[];
  summary: MarketplaceSummary;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Request history
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Track requests you sent to water providers.
            </p>
          </div>
          <History className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <MiniMetric label="Pending" value={String(summary.pendingRequests)} />
          <MiniMetric label="Accepted" value={String(summary.acceptedRequests)} />
          <MiniMetric
            label="Fulfilled"
            value={String(summary.fulfilledRequests)}
          />
        </div>
      </div>
      {requestHistory.length ? (
        <div className="space-y-3 p-5">
          {requestHistory.map((request) => (
            <article
              key={request.id}
              className="rounded-md border border-zinc-200 bg-zinc-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-950">
                    {formatLitersCompact(request.requestedLiters)} L
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {request.listing?.location ?? "Listing"} ·{" "}
                    {formatDateShort(request.createdAt)}
                  </p>
                </div>
                <StatusPill status={request.status} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Send}
          title="No requests yet"
          text="Request water from an active listing to start your history."
        />
      )}
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-medium uppercase text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  text: string;
}) {
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-sky-50 text-sky-700">
          <Icon className="h-6 w-6" aria-hidden={true} />
        </span>
        <p className="mt-4 font-semibold text-zinc-950">{title}</p>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">{text}</p>
      </div>
    </div>
  );
}
