"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Droplets,
  Edit3,
  Inbox,
  MapPin,
  Phone,
  Power,
  Store,
  Trash2,
  Waves,
} from "lucide-react";
import { ListingForm } from "@/components/marketplace/listing-form";
import { StatusPill } from "@/components/marketplace/status-pill";
import {
  deleteListing,
  setListingStatus,
  setRequestStatus,
} from "@/lib/marketplace/actions";
import { formatDateShort, formatLitersCompact } from "@/lib/marketplace/format";
import type {
  ListingsSummary,
  RequestWithListing,
  WaterListing,
} from "@/lib/marketplace/types";

type ListingsManagementProps = {
  listings: WaterListing[];
  incomingRequests: RequestWithListing[];
  summary: ListingsSummary;
  error?: string | null;
};

export function ListingsManagement({
  listings,
  incomingRequests,
  summary,
  error,
}: ListingsManagementProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8">
      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700">
              <Store className="h-4 w-4" aria-hidden="true" />
              Listings management
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
              Manage surplus water supply
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Publish, edit, pause, fulfill, and monitor requests for your
              available rainwater inventory.
            </p>
            {error ? (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>
          <div className="rounded-lg bg-zinc-950 p-5 text-white">
            <p className="text-sm font-medium text-zinc-400">Active supply</p>
            <p className="mt-5 text-5xl font-semibold">
              {formatLitersCompact(summary.totalLitersAvailable)} L
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Available across {summary.activeListings} active listings.
            </p>
            <div className="mt-6 h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-300"
                style={{
                  width: `${Math.min(
                    100,
                    summary.totalListings
                      ? (summary.activeListings / summary.totalListings) * 100
                      : 0,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Store}
          label="Total listings"
          value={String(summary.totalListings)}
          detail="Owned supply posts"
        />
        <SummaryCard
          icon={Droplets}
          label="Liters available"
          value={`${formatLitersCompact(summary.totalLitersAvailable)} L`}
          detail="Active inventory"
        />
        <SummaryCard
          icon={Power}
          label="Active listings"
          value={String(summary.activeListings)}
          detail="Visible in marketplace"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Fulfilled listings"
          value={String(summary.fulfilledListings)}
          detail="Completed supply"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Create new listing
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Add surplus water supply to the community marketplace.
              </p>
            </div>
            <Waves className="h-5 w-5 text-sky-600" aria-hidden="true" />
          </div>
          <ListingForm mode="create" />
        </div>

        <MyListings listings={listings} />
      </section>

      <IncomingRequests requests={incomingRequests} />
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
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
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

function MyListings({ listings }: { listings: WaterListing[] }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 p-5">
        <h2 className="text-lg font-semibold text-zinc-950">My listings</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Edit listing details or change marketplace status.
        </p>
      </div>
      {listings.length ? (
        <div className="divide-y divide-zinc-100">
          {listings.map((listing) => (
            <ListingRow key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Store}
          title="No listings yet"
          text="Create your first water listing to make surplus supply visible."
        />
      )}
    </section>
  );
}

function ListingRow({ listing }: { listing: WaterListing }) {
  const [editing, setEditing] = useState(false);

  return (
    <article className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-950">
              {formatLitersCompact(listing.availableLiters)} L
            </h3>
            <StatusPill status={listing.status} />
          </div>
          <div className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              {listing.location} · {listing.pincode}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              {listing.contactNumber}
            </p>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Posted {formatDateShort(listing.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["available", "inactive", "fulfilled"] as const).map((status) => (
            <form key={status} action={setListingStatus}>
              <input type="hidden" name="id" value={listing.id} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                disabled={listing.status === status}
                className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
              >
                {status}
              </button>
            </form>
          ))}
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white transition hover:bg-zinc-800"
          >
            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
          <form action={deleteListing}>
            <input type="hidden" name="id" value={listing.id} />
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Delete
            </button>
          </form>
        </div>
      </div>
      {editing ? (
        <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <ListingForm
            mode="edit"
            listing={listing}
            onSuccess={() => setEditing(false)}
          />
        </div>
      ) : null}
    </article>
  );
}

function IncomingRequests({ requests }: { requests: RequestWithListing[] }) {
  return (
    <section className="mt-6 rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 p-5">
        <h2 className="text-lg font-semibold text-zinc-950">
          Incoming requests
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Accept, fulfill, or reject requests made against your listings.
        </p>
      </div>
      {requests.length ? (
        <div className="grid gap-3 p-5 lg:grid-cols-2">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-zinc-950">
                    {formatLitersCompact(request.requestedLiters)} L requested
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {request.listing?.location ?? "Listing"} ·{" "}
                    {formatDateShort(request.createdAt)}
                  </p>
                </div>
                <StatusPill status={request.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["accepted", "fulfilled", "rejected"] as const).map(
                  (status) => (
                    <form key={status} action={setRequestStatus}>
                      <input type="hidden" name="id" value={request.id} />
                      <input type="hidden" name="status" value={status} />
                      <button
                        type="submit"
                        disabled={request.status === status}
                        className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
                      >
                        {status}
                      </button>
                    </form>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No incoming requests"
          text="Requests will appear here when marketplace users contact your listings."
        />
      )}
    </section>
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
    <div className="grid min-h-64 place-items-center p-8 text-center">
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
