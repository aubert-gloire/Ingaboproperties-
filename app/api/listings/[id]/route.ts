import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { auth } from "@/lib/auth";
import { logActivity } from "@/models/ActivityLog";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const listing = await Listing.findById(id).lean();
  if (!listing) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ listing });
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const body = await request.json();
  const user = session.user as any;

  const listing = await Listing.findByIdAndUpdate(id, body, { new: true });

  logActivity(user.id, user.name || user.email, "updated listing", "Listing", id, listing?.title).catch(() => {});

  return Response.json({ listing });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const user = session.user as any;

  const listing = await Listing.findByIdAndDelete(id);

  logActivity(user.id, user.name || user.email, "deleted listing", "Listing", id, listing?.title).catch(() => {});

  return Response.json({ success: true });
}
