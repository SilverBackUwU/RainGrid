import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth/session";

type ProtectedPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
};

export async function ProtectedPage({
  title,
  eyebrow,
  description,
  metrics,
}: ProtectedPageProps) {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-zinc-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-zinc-950">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            {description}
          </p>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
          Signed in as{" "}
          <span className="font-medium text-zinc-950">{user.email}</span>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-zinc-950">
                  {metric.value}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-sky-600">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
