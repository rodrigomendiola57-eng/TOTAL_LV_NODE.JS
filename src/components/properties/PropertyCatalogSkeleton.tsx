export function PropertyCatalogSkeleton() {
  return (
    <main className="flex flex-1 flex-col bg-tl-black">
      <section className="min-h-[min(78vh,720px)] animate-pulse bg-[#111111]" />

      <div className="border-b border-white/10 bg-tl-black/80">
        <div className="mx-auto flex max-w-6xl gap-4 px-4 py-4 sm:px-6">
          <div className="h-10 w-44 rounded-full bg-[#1a1a1a]" />
          <div className="h-10 w-44 rounded-full bg-[#1a1a1a]" />
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/5 bg-[#111111]"
            >
              <div className="h-44 animate-pulse bg-[#1a1a1a] sm:aspect-[5/4] sm:h-auto" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-[#1a1a1a]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#1a1a1a]" />
                <div className="h-7 w-full animate-pulse rounded-full bg-[#1a1a1a]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
