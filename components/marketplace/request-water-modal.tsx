"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { requestWater } from "@/lib/marketplace/actions";
import { formatLitersCompact } from "@/lib/marketplace/format";
import type { WaterListing } from "@/lib/marketplace/types";

type RequestWaterModalProps = {
  listing: WaterListing | null;
  onClose: () => void;
};

const initialState = {
  status: "idle" as const,
  message: "",
};

export function RequestWaterModal({
  listing,
  onClose,
}: RequestWaterModalProps) {
  const [state, formAction] = useActionState(requestWater, initialState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
      onClose();
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [onClose, state.message, state.status]);

  if (!listing) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-white/10 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Request water
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {listing.location} · {listing.pincode}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="Close request modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <form action={formAction} className="space-y-5 p-5">
          <input type="hidden" name="listingId" value={listing.id} />
          <div className="rounded-lg bg-zinc-950 p-4 text-white">
            <p className="text-sm text-zinc-400">Available supply</p>
            <p className="mt-2 text-3xl font-semibold">
              {formatLitersCompact(listing.availableLiters)} L
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Contact visible after you send the request: {listing.contactNumber}
            </p>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Requested liters
            </span>
            <input
              name="requestedLiters"
              type="number"
              min="1"
              max={listing.availableLiters}
              step="1"
              required
              defaultValue={Math.min(listing.availableLiters, 1000)}
              className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          {state.status === "error" && state.message ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Send className="h-4 w-4" aria-hidden="true" />
      )}
      {pending ? "Sending request..." : "Send request"}
    </button>
  );
}
