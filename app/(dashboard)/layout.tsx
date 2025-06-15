
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
// You might want a sidebar or a shared header for the dashboard
// import DashboardSidebar from "@/components/dashboard-sidebar"; 

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth(); // Protects all routes in this group
  if (!user) {
    redirect("/login"); // Should be handled by requireAuth, but as a fallback
  }

  return (
    <div className="flex min-h-screen">
      {/* <DashboardSidebar /> Example: Add a sidebar */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
