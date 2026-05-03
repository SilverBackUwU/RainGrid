import "server-only";

import type { User } from "@supabase/supabase-js";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_UNAUTHENTICATED_ROUTE,
  getSafeRedirectPath,
} from "@/lib/auth/routes";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
});

export async function requireUser(redirectTo?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const loginUrl = new URL(
      DEFAULT_UNAUTHENTICATED_ROUTE,
      "https://raingrid.local",
    );

    if (redirectTo) {
      loginUrl.searchParams.set("redirectTo", getSafeRedirectPath(redirectTo));
    }

    redirect(`${loginUrl.pathname}${loginUrl.search}`);
  }

  return user;
}
