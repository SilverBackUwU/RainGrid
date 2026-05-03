export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8">
      <div className="h-80 animate-pulse rounded-lg border border-zinc-200 bg-white" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-lg border border-zinc-200 bg-white"
          />
        ))}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="h-[420px] animate-pulse rounded-lg border border-zinc-200 bg-white" />
        <div className="h-[420px] animate-pulse rounded-lg bg-zinc-950" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-lg border border-zinc-200 bg-white" />
        <div className="h-[360px] animate-pulse rounded-lg border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}
