import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import { logActivity } from "@/models/ActivityLog";

export async function GET() {
  await connectDB();
  const posts = await Blog.find({ status: "published" }).sort({ publishedAt: -1 }).lean();
  return Response.json({ posts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const user = session.user as any;

  if (body.status === "published" && !body.publishedAt) body.publishedAt = new Date();

  const post = await Blog.create(body);

  logActivity(user.id, user.name || user.email, "created blog post", "Blog", post._id.toString(), post.title).catch(() => {});

  return Response.json({ post }, { status: 201 });
}
