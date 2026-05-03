import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { signup } from "@/lib/auth/actions";
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/auth/routes";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Signup | RainGrid",
  description: "Create your RainGrid account.",
};

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(DEFAULT_AUTHENTICATED_ROUTE);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Use email and password authentication through your Supabase project."
      footer={{
        label: "Already have access?",
        href: "/login",
        cta: "Sign in",
      }}
    >
      <AuthForm mode="signup" action={signup} />
    </AuthShell>
  );
}
