export default function DashboardPropertiesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="h-3 w-20 rounded bg-tl-gold/25" />
          <div className="mt-3 h-10 w-72 rounded bg-tl-beige/15" />
          <div className="mt-3 h-4 w-80 rounded bg-tl-beige/10" />
        </div>
        <div className="h-11 w-44 rounded-full bg-tl-gold/30" />
      </div>
      <div className="h-16 rounded-2xl border border-tl-gold/15 bg-tl-black/40" />
      <div className="overflow-hidden rounded-2xl border border-tl-gold/15">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-tl-gold/10 px-5 py-4 last:border-0"
          >
            <div className="h-4 flex-1 rounded bg-tl-beige/10" />
            <div className="h-4 w-24 rounded bg-tl-beige/10" />
            <div className="h-4 w-20 rounded bg-tl-beige/10" />
            <div className="h-4 w-28 rounded bg-tl-beige/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
