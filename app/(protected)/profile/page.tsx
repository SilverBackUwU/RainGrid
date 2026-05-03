import type { Metadata } from "next";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata: Metadata = {
  title: "Profile | RainGrid",
};

export default function ProfilePage() {
  return (
    <ProtectedPage
      title="Profile"
      eyebrow="Identity verified"
      description="Profile pages rely on your existing Supabase trigger to link new Auth users to the profiles table."
      metrics={[
        { label: "Signup", value: "Auth" },
        { label: "Profile link", value: "Trigger" },
        { label: "Schema edits", value: "None" },
      ]}
    />
  );
}
