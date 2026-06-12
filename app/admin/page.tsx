import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import Submission from "@/models/Submission";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import StatCard from "@/components/admin/StatCard";
import { Building2, Home, Landmark, Users, Clipboard, CalendarCheck, Activity, TrendingUp, Briefcase } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

async function getDashboardStats() {
  try {
    await connectDB();
    const [
      totalListings, houseCount, landCount, apartmentCount, villaCount, commercialCount,
      pendingSubmissions, totalAppointments, totalUsers,
    ] = await Promise.all([
      Listing.countDocuments({ status: "active" }),
      Listing.countDocuments({ type: "house", status: "active" }),
      Listing.countDocuments({ type: "land", status: "active" }),
      Listing.countDocuments({ type: "apartment", status: "active" }),
      Listing.countDocuments({ type: "villa", status: "active" }),
      Listing.countDocuments({ type: "commercial", status: "active" }),
      Submission.countDocuments({ status: "pending" }),
      Appointment.countDocuments(),
      User.countDocuments({ status: "active" }),
    ]);
    return { totalListings, houseCount, landCount, apartmentCount, villaCount, commercialCount, pendingSubmissions, totalAppointments, totalUsers };
  } catch {
    return { totalListings: 0, houseCount: 0, landCount: 0, apartmentCount: 0, villaCount: 0, commercialCount: 0, pendingSubmissions: 0, totalAppointments: 0, totalUsers: 0 };
  }
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const user = session?.user as any;
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const stats = await getDashboardStats();

  const row1 = [
    { label: "All Properties", value: stats.totalListings, icon: Building2, color: "green" as const, description: `Houses: ${stats.houseCount} · Land: ${stats.landCount}`, href: "/admin/properties", progress: 100 },
    { label: "House Listings", value: stats.houseCount, icon: Home, color: "blue" as const, description: `${stats.totalListings ? Math.round((stats.houseCount / stats.totalListings) * 100) : 0}% of total`, href: "/admin/properties/houses", progress: stats.totalListings ? (stats.houseCount / stats.totalListings) * 100 : 0 },
    { label: "Land Listings", value: stats.landCount, icon: Landmark, color: "gold" as const, description: `${stats.totalListings ? Math.round((stats.landCount / stats.totalListings) * 100) : 0}% of total`, href: "/admin/properties/land", progress: stats.totalListings ? (stats.landCount / stats.totalListings) * 100 : 0 },
    { label: "Apartments", value: stats.apartmentCount, icon: Building2, color: "green" as const, description: `${stats.totalListings ? Math.round((stats.apartmentCount / stats.totalListings) * 100) : 0}% of total`, href: "/admin/properties/apartments", progress: stats.totalListings ? (stats.apartmentCount / stats.totalListings) * 100 : 0 },
  ];

  const row2 = [
    { label: "Active Users", value: stats.totalUsers, icon: Users, color: "blue" as const, description: "Agents, staff, admins", href: "/admin/users" },
    { label: "Pending Submissions", value: stats.pendingSubmissions, icon: Clipboard, color: "gold" as const, description: "Awaiting review", href: "/admin/submissions" },
    { label: "Appointments", value: stats.totalAppointments, icon: CalendarCheck, color: "green" as const, description: "Total booked", href: "/admin/appointments" },
    { label: "Commercial", value: stats.commercialCount, icon: Briefcase, color: "red" as const, description: "Office & retail spaces", href: "/admin/properties/commercial" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {user?.name?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Here's your Ingabo Properties overview for today — {format(now, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Link href="/admin/activity-logs"
          className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Activity className="w-4 h-4" />
          Activity Logs
        </Link>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {row1.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {row2.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "+ Add House", href: "/admin/properties/houses", color: "bg-forest-800 text-white" },
            { label: "+ Add Land", href: "/admin/properties/land", color: "bg-forest-800 text-white" },
            { label: "Review Submissions", href: "/admin/submissions", color: "bg-amber-500 text-white" },
            { label: "View Appointments", href: "/admin/appointments", color: "bg-blue-600 text-white" },
            { label: "New Blog Post", href: "/admin/blog", color: "bg-gray-800 text-white" },
          ].map(({ label, href, color }) => (
            <Link key={href} href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 ${color}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
