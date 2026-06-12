import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { logActivity } from "@/models/ActivityLog";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  const query: Record<string, any> = { status: "active" };
  const type = searchParams.get("type");
  const condition = searchParams.get("condition");
  const district = searchParams.get("district");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const featured = searchParams.get("featured");

  if (type) query.type = type;
  if (condition) query.condition = condition;
  if (district) query["location.district"] = district;
  if (featured) query.featured = true;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { "location.district": { $regex: search, $options: "i" } },
    ];
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap: Record<string, Record<string, number>> = {
    newest: { listedAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
  };
  const sort = sortMap[searchParams.get("sort") || "newest"] || { listedAt: -1 };
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const skip = (page - 1) * limit;

  const [listings, total] = await Promise.all([
    Listing.find(query).sort(sort as any).skip(skip).limit(limit).lean(),
    Listing.countDocuments(query),
  ]);

  return Response.json({ listings, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const slug = `${slugify(body.title)}-${Date.now()}`;
  const user = session.user as any;

  const listing = await Listing.create({ ...body, slug, source: "admin" });

  logActivity(user.id, user.name || user.email, "created listing", "Listing", listing._id.toString(), listing.title).catch(() => {});

  return Response.json({ listing }, { status: 201 });
}
