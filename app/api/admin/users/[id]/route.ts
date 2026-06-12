import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { logActivity } from "@/models/ActivityLog";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await auth();
  const actor = session?.user as any;
  if (actor?.role !== "superadmin") return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await connectDB();

  const body = await request.json();
  const update: Record<string, any> = {};

  if (body.name) update.name = body.name;
  if (body.email) update.email = body.email.toLowerCase();
  if (body.role) update.role = body.role;
  if (body.department !== undefined) update.department = body.department;
  if (body.status) update.status = body.status;
  if (body.password) update.passwordHash = await bcrypt.hash(body.password, 12);

  const user = await User.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({ user });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  const actor = session?.user as any;
  if (actor?.role !== "superadmin") return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  if (id === actor.id) return Response.json({ error: "You cannot delete your own account" }, { status: 400 });

  await connectDB();
  const deleted = await User.findByIdAndDelete(id);
  logActivity(actor.id, actor.name || actor.email, "deleted user", "User", id, deleted?.name).catch(() => {});
  return Response.json({ success: true });
}
