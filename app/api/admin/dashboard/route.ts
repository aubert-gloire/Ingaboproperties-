import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import Submission from "@/models/Submission";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const [total, houses, land, apartments, villas, pendingSubmissions, appointments, users] = await Promise.all([
    Listing.countDocuments({ status: "active" }),
    Listing.countDocuments({ type: "house", status: "active" }),
    Listing.countDocuments({ type: "land", status: "active" }),
    Listing.countDocuments({ type: "apartment", status: "active" }),
    Listing.countDocuments({ type: "villa", status: "active" }),
    Submission.countDocuments({ status: "pending" }),
    Appointment.countDocuments(),
    User.countDocuments({ status: "active" }),
  ]);

  return Response.json({ total, houses, land, apartments, villas, pendingSubmissions, appointments, users });
}
