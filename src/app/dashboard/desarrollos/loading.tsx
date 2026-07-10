export default function DashboardDesarrollosLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-3 w-28 rounded bg-tl-gold/25" />
      <div className="h-10 w-56 rounded bg-tl-beige/15" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-36 rounded-2xl border border-tl-gold/15 bg-tl-black/40" />
        <div className="h-36 rounded-2xl border border-tl-gold/15 bg-tl-black/40" />
      </div>
    </div>
  );
}
