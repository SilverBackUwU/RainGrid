export default function MarketplaceLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8">
      <div className="h-80 animate-pulse rounded-lg bg-zinc-950" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-lg border border-zinc-200 bg-white"
          />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="h-[680px] animate-pulse rounded-lg border border-zinc-200 bg-white" />
        <div className="h-[680px] animate-pulse rounded-lg border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}
