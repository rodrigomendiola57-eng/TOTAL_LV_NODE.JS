import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardSidebar />
      <div className="pl-64">
        <main className="min-h-screen p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
