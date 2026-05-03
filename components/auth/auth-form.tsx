"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import type { AuthFormState } from "@/lib/auth/actions";

type AuthAction = (
  previousState: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>;

type AuthFormProps = {
  mode: "login" | "signup";
  action: AuthAction;
  redirectTo?: string;
};

const initialState: AuthFormState = {
  status: "idle",
  message: "",
};

function SubmitButton({ mode }: { mode: AuthFormProps["mode"] }) {
  const { pending } = useFormStatus();
  const label = mode === "login" ? "Sign in" : "Create account";

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : mode === "login" ? (
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      ) : (
        <UserPlus className="h-4 w-4" aria-hidden="true" />
      )}
      {pending ? "Working..." : label}
    </button>
  );
}

export function AuthForm({ mode, action, redirectTo }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo ? (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Email address
        </span>
        <span className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 text-zinc-100 shadow-inner shadow-black/10 transition focus-within:border-emerald-400/70 focus-within:bg-white/[0.08]">
          <Mail className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.fields?.email}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
            placeholder="you@company.com"
          />
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Password
        </span>
        <span className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 text-zinc-100 shadow-inner shadow-black/10 transition focus-within:border-emerald-400/70 focus-within:bg-white/[0.08]">
          <Lock className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={6}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
            placeholder="Minimum 6 characters"
          />
        </span>
      </label>

      {isSignup ? (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">
            Confirm password
          </span>
          <span className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 text-zinc-100 shadow-inner shadow-black/10 transition focus-within:border-emerald-400/70 focus-within:bg-white/[0.08]">
            <ShieldCheck
              className="h-4 w-4 text-zinc-400"
              aria-hidden="true"
            />
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
              placeholder="Repeat your password"
            />
          </span>
        </label>
      ) : null}

      {state.message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            state.status === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/30 bg-red-500/10 text-red-100"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton mode={mode} />
    </form>
  );
}
