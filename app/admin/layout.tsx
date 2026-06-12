import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";

const ADMIN_ROLES = ["superadmin", "agent", "staff", "marketing"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as any;

  if (!session || !ADMIN_ROLES.includes(user?.role)) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar userRole={user?.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar userName={user?.name} userRole={user?.role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
