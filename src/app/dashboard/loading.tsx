export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-3 w-24 rounded bg-tl-gold/25" />
        <div className="mt-3 h-10 w-64 rounded bg-tl-beige/15" />
        <div className="mt-3 h-4 w-full max-w-md rounded bg-tl-beige/10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-tl-gold/15 bg-tl-black/50"
          />
        ))}
      </div>
      <div className="h-40 rounded-2xl border border-tl-gold/15 bg-tl-black/40" />
    </div>
  );
}
