import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-outfit font-light tracking-[0.02em] antialiased">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
