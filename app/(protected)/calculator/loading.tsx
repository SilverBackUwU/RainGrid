export default function CalculatorLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="h-72 animate-pulse rounded-lg bg-zinc-900" />
        <div className="h-72 animate-pulse rounded-lg border border-zinc-200 bg-white" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="h-[520px] animate-pulse rounded-lg border border-zinc-200 bg-white" />
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-lg border border-zinc-200 bg-white"
              />
            ))}
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-lg border border-zinc-200 bg-white" />
            <div className="h-80 animate-pulse rounded-lg border border-zinc-200 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
