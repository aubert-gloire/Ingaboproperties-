import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 50;
  const page = Number(searchParams.get("page")) || 1;

  const [logs, total] = await Promise.all([
    ActivityLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ActivityLog.countDocuments(),
  ]);

  return Response.json({ logs, total, page, pages: Math.ceil(total / limit) });
}
