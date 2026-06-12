import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import Listing from "@/models/Listing";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { logActivity } from "@/models/ActivityLog";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const body = await request.json();
  const user = session.user as any;

  const updated = await Submission.findByIdAndUpdate(
    id,
    { ...body, reviewedBy: user.id, reviewedAt: new Date() },
    { new: true }
  );

  if (body.status === "approved" && updated) {
    const slug = `${slugify(updated.title)}-${Date.now()}`;
    await Listing.create({
      title: updated.title, slug, description: updated.description,
      type: updated.type, condition: updated.condition, price: updated.price,
      location: updated.location, specs: updated.specs, amenities: updated.amenities,
      photos: updated.photos, upi: updated.upi, zoning: updated.zoning,
      status: "active", source: "owner-submission",
      submittedBy: { name: updated.ownerName, email: updated.ownerEmail, phone: updated.ownerPhone },
    });
    logActivity(user.id, user.name || user.email, "approved submission", "Submission", id, updated.title).catch(() => {});
  } else if (body.status === "rejected" && updated) {
    logActivity(user.id, user.name || user.email, "rejected submission", "Submission", id, updated.title).catch(() => {});
  }

  return Response.json({ submission: updated });
}
