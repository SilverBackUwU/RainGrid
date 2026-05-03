import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { getCurrentUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
