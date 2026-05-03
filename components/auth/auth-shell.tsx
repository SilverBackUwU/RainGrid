import Link from "next/link";
import { Droplets, Grid3X3 } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  footer: {
    label: string;
    href: string;
    cta: string;
  };
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#0c0f0e] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-zinc-950 lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.24),rgba(24,24,27,0)_46%),radial-gradient(circle_at_70%_30%,rgba(14,165,233,0.18),transparent_32%)]" />
          <div className="absolute inset-8 grid grid-cols-6 grid-rows-6 gap-3 opacity-70">
            {Array.from({ length: 36 }).map((_, index) => (
              <div
                key={index}
                className="rounded-md border border-white/10 bg-white/[0.035]"
              />
            ))}
          </div>
          <div className="relative flex h-full flex-col justify-between p-12">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400 text-zinc-950">
                <Droplets className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-wide">
                RainGrid
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-emerald-100">
                <Grid3X3 className="h-4 w-4" aria-hidden="true" />
                Verified access for energy operators
              </div>
              <h1 className="text-5xl font-semibold leading-tight text-white">
                Manage solar decisions from one secure workspace.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-300">
                Keep calculators, marketplace data, listings, and customer
                profiles behind Supabase-backed authentication.
              </p>
            </div>

            <p className="text-sm text-zinc-500">
              Supabase Auth, server-validated sessions, and route-level
              protection.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400 text-zinc-950">
                <Droplets className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold">RainGrid</span>
            </Link>

            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-normal text-white">
                  {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {subtitle}
                </p>
              </div>

              {children}

              <p className="mt-7 text-center text-sm text-zinc-400">
                {footer.label}{" "}
                <Link
                  href={footer.href}
                  className="font-medium text-emerald-300 transition hover:text-emerald-200"
                >
                  {footer.cta}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
