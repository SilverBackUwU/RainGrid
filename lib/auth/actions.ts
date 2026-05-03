"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_UNAUTHENTICATED_ROUTE,
  getSafeRedirectPath,
} from "@/lib/auth/routes";

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fields?: {
    email?: string;
  };
};

const credentialsSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signupSchema = credentialsSchema
  .extend({
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function toState(message: string, email?: string): AuthFormState {
  return {
    status: "error",
    message,
    fields: { email },
  };
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const redirectTo = getSafeRedirectPath(formData.get("redirectTo"));
  const email = formValue(formData, "email").toLowerCase();
  const password = formValue(formData, "password");
  const parsed = credentialsSchema.safeParse({ email, password });

  if (!parsed.success) {
    return toState(parsed.error.issues[0]?.message ?? "Check your details.", email);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return toState(error.message, email);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formValue(formData, "email").toLowerCase();
  const password = formValue(formData, "password");
  const confirmPassword = formValue(formData, "confirmPassword");
  const parsed = signupSchema.safeParse({ email, password, confirmPassword });

  if (!parsed.success) {
    return toState(parsed.error.issues[0]?.message ?? "Check your details.", email);
  }

  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return toState(error.message, email);
  }

  revalidatePath("/", "layout");

  if (!session) {
    return {
      status: "success",
      message:
        "Account created. Check your email to confirm your address before logging in.",
      fields: { email },
    };
  }

  redirect(DEFAULT_AUTHENTICATED_ROUTE);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect(DEFAULT_UNAUTHENTICATED_ROUTE);
}
