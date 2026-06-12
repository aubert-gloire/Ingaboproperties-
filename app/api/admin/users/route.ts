import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { logActivity } from "@/models/ActivityLog";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (user?.role !== "superadmin") return Response.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return Response.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const actor = session?.user as any;
  if (actor?.role !== "superadmin") return Response.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const { name, email, password, role, department } = await request.json();

  if (!name || !email || !password) {
    return Response.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return Response.json({ error: "A user with this email already exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role, department });

  logActivity(actor.id, actor.name || actor.email, "created user", "User", user._id.toString(), `${name} (${role})`).catch(() => {});

  return Response.json({ user: { ...user.toObject(), passwordHash: undefined } }, { status: 201 });
}
