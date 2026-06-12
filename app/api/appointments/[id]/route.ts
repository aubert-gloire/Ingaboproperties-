import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { auth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const body = await request.json();
  const appointment = await Appointment.findByIdAndUpdate(id, body, { new: true });
  return Response.json({ appointment });
}
