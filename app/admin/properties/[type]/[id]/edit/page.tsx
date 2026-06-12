import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function EditPropertyPage(props: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await props.params;
  await connectDB();
  const listing = await Listing.findById(id).lean() as any;
  if (!listing) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/admin/properties/${{ house: "houses", apartment: "apartments", villa: "villas", land: "land", commercial: "commercial" }[type] || "houses"}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Listing</h1>
          <p className="text-gray-500 text-sm line-clamp-1">{listing.title}</p>
        </div>
      </div>
      <PropertyForm listing={JSON.parse(JSON.stringify(listing))} defaultType={type} />
    </div>
  );
}
