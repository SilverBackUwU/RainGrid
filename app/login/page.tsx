import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { login } from "@/lib/auth/actions";
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  getSafeRedirectPath,
} from "@/lib/auth/routes";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Login | RainGrid",
  description: "Sign in to RainGrid.",
};

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect(DEFAULT_AUTHENTICATED_ROUTE);
  }

  const params = await searchParams;
  const redirectTo = getSafeRedirectPath(params.redirectTo ?? null);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with your RainGrid email and password to continue."
      footer={{
        label: "New to RainGrid?",
        href: "/signup",
        cta: "Create an account",
      }}
    >
      <AuthForm mode="login" action={login} redirectTo={redirectTo} />
    </AuthShell>
  );
}
