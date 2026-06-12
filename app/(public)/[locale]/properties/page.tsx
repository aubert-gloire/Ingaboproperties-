import { Suspense } from "react";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import PropertyCard from "@/components/public/PropertyCard";
import PropertyFilters from "@/components/public/PropertyFilters";
import PropertyPagination from "@/components/public/PropertyPagination";

interface Props {
  searchParams: Promise<{
    search?: string;
    type?: string;
    condition?: string;
    district?: string;
    minPrice?: string;
    maxPrice?: string;
    minBedrooms?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getListings(params: Awaited<Props["searchParams"]>) {
  try {
    await connectDB();
    const query: Record<string, any> = { status: "active" };

    if (params.search) {
      query.$or = [
        { title: { $regex: params.search, $options: "i" } },
        { "location.district": { $regex: params.search, $options: "i" } },
        { "location.sector": { $regex: params.search, $options: "i" } },
      ];
    }
    if (params.type) query.type = params.type;
    if (params.condition) query.condition = params.condition;
    if (params.district) query["location.district"] = params.district;
    if (params.minPrice || params.maxPrice) {
      query.price = {};
      if (params.minPrice) query.price.$gte = Number(params.minPrice);
      if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
    }
    if (params.minBedrooms) query["specs.bedrooms"] = { $gte: Number(params.minBedrooms) };

    const sortMap: Record<string, Record<string, number>> = {
      newest: { listedAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
    };
    const sort = sortMap[params.sort || "newest"] || { listedAt: -1 };

    const page = Number(params.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(query).sort(sort as any).skip(skip).limit(limit).lean(),
      Listing.countDocuments(query),
    ]);

    return { listings: JSON.parse(JSON.stringify(listings)), total };
  } catch {
    return { listings: [], total: 0 };
  }
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { listings, total } = await getListings(params);

  return (
    <div className="min-h-screen bg-paper pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900 mb-2">
            Properties
          </h1>
          <p className="text-muted-fg">Browse all available properties across Rwanda</p>
        </div>

        <Suspense fallback={null}>
          <PropertyFilters total={total} />
        </Suspense>

        <div id="property-results" className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <PropertyCard
              key={listing._id}
              id={listing._id}
              title={listing.title}
              type={listing.type}
              condition={listing.condition}
              price={listing.price}
              location={listing.location}
              specs={listing.specs}
              amenities={listing.amenities}
              photos={listing.photos}
              listedAt={listing.listedAt}
              status={listing.status}
            />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-24 text-muted-fg">
            <p className="text-lg">No properties found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your filters.</p>
          </div>
        )}

        <Suspense fallback={null}>
          <PropertyPagination total={total} perPage={12} />
        </Suspense>
      </div>
    </div>
  );
}
