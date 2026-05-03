"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  createListing,
  updateListing,
  type ListingFormState,
} from "@/lib/marketplace/actions";
import type { WaterListing } from "@/lib/marketplace/types";

type ListingFormProps = {
  mode: "create" | "edit";
  listing?: WaterListing;
  onSuccess?: () => void;
};

const initialState: ListingFormState = {
  status: "idle",
  message: "",
};

export function ListingForm({ mode, listing, onSuccess }: ListingFormProps) {
  const action = mode === "create" ? createListing : updateListing;
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
      onSuccess?.();
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [onSuccess, state.message, state.status]);

  return (
    <form action={formAction} className="space-y-4">
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Available liters">
          <input
            name="availableLiters"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={
              state.fields?.availableLiters ?? listing?.availableLiters ?? ""
            }
            placeholder="12000"
            className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </Field>
        <Field label="Pincode">
          <input
            name="pincode"
            inputMode="numeric"
            required
            minLength={6}
            maxLength={6}
            defaultValue={state.fields?.pincode ?? listing?.pincode ?? ""}
            placeholder="560001"
            className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </Field>
      </div>
      <Field label="Location">
        <input
          name="location"
          required
          defaultValue={state.fields?.location ?? listing?.location ?? ""}
          placeholder="Indiranagar, Bengaluru"
          className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </Field>
      <Field label="Contact number">
        <input
          name="contactNumber"
          required
          defaultValue={
            state.fields?.contactNumber ?? listing?.contactNumber ?? ""
          }
          placeholder="+91 98765 43210"
          className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </Field>
      {state.status === "error" && state.message ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}
      <SubmitButton mode={mode} />
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : mode === "create" ? (
        <Plus className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Save className="h-4 w-4" aria-hidden="true" />
      )}
      {pending
        ? "Saving..."
        : mode === "create"
          ? "Publish listing"
          : "Save changes"}
    </button>
  );
}
