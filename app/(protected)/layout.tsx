import Link from "next/link";
import { Droplets } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { PROTECTED_ROUTES } from "@/lib/auth/routes";
import { requireUser } from "@/lib/auth/session";

const labels: Record<(typeof PROTECTED_ROUTES)[number], string> = {
  "/dashboard": "Dashboard",
  "/calculator": "Calculator",
  "/marketplace": "Marketplace",
  "/profile": "Profile",
  "/listings": "Listings",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f6]">
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-950 text-emerald-300">
                <Droplets className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold text-zinc-950">
                RainGrid
              </span>
            </Link>
            <div className="lg:hidden">
              <LogoutButton />
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto">
            {PROTECTED_ROUTES.map((href) => (
              <Link
                key={href}
                href={href}
                className="inline-flex h-10 shrink-0 items-center rounded-md px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                {labels[href]}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <LogoutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
