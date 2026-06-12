import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
  return Response.json({ appointments });
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const appointment = await Appointment.create(body);
  return Response.json({ appointment }, { status: 201 });
}
