import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import PropertyTable from "@/components/admin/PropertyTable";
import Link from "next/link";
import { Plus } from "lucide-react";

const TABS = ["all", "for-sale", "for-rent", "active", "pending", "sold", "inactive"];

export default async function CommercialPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  await connectDB();

  const query: any = { type: "commercial" };
  if (params.status && params.status !== "all") {
    if (params.status === "for-sale" || params.status === "for-rent") query.condition = params.status;
    else query.status = params.status;
  }
  if (params.search) query.title = { $regex: params.search, $options: "i" };

  const [listings, counts] = await Promise.all([
    Listing.find(query).sort({ createdAt: -1 }).lean(),
    Promise.all(
      TABS.map((s) => {
        if (s === "all") return Listing.countDocuments({ type: "commercial" });
        if (s === "for-sale" || s === "for-rent")
          return Listing.countDocuments({ type: "commercial", condition: s });
        return Listing.countDocuments({ type: "commercial", status: s });
      })
    ),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Commercial Properties</h1>
          <p className="text-gray-500 text-sm">Admin / Properties / Commercial</p>
        </div>
        <Link
          href="/admin/properties/new?type=commercial"
          className="flex items-center gap-2 px-4 py-2 bg-forest-800 text-white rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Commercial
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto bg-white rounded-xl border border-gray-200 p-1">
        {TABS.map((s, i) => (
          <Link
            key={s}
            href={`?status=${s}`}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              (params.status || "all") === s
                ? "bg-forest-800 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "All" : s.replace(/-/g, " ")} [{counts[i]}]
          </Link>
        ))}
      </div>

      <PropertyTable
        properties={JSON.parse(JSON.stringify(listings))}
        propertyType="commercial"
      />
    </div>
  );
}
