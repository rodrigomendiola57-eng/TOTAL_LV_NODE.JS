function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-tl-gold/20 bg-tl-black/60 p-6">
      <div className="h-3 w-24 animate-pulse rounded bg-tl-gold/30" />
      <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-tl-beige/20" />
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-tl-beige/15" />
      <div className="mt-8 h-6 w-1/2 animate-pulse rounded bg-tl-gold/25" />
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-tl-gold/20 pt-4">
        <div className="h-3 animate-pulse rounded bg-tl-beige/15" />
        <div className="h-3 animate-pulse rounded bg-tl-beige/15" />
        <div className="h-3 animate-pulse rounded bg-tl-beige/15" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col bg-tl-black">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="h-16 w-72 animate-pulse rounded bg-tl-beige/20 sm:w-96" />
        <div className="mt-6 h-4 w-80 animate-pulse rounded bg-tl-gold/30" />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="mb-10 h-12 w-80 animate-pulse rounded bg-tl-beige/20" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    </main>
  );
}
