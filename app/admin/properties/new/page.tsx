import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function NewPropertyPage(props: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await props.searchParams;
  const defaultType = type || "house";
  const typeRouteMap: Record<string, string> = {
    house: "houses", apartment: "apartments", villa: "villas",
    land: "land", commercial: "commercial",
  };
  const backHref = `/admin/properties/${typeRouteMap[defaultType] || "houses"}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={backHref} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 capitalize">Add New {defaultType}</h1>
          <p className="text-gray-500 text-sm">This listing will be visible to buyers once set to Active</p>
        </div>
      </div>
      <PropertyForm defaultType={defaultType} />
    </div>
  );
}
