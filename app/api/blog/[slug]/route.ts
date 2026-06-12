import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import { logActivity } from "@/models/ActivityLog";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  await connectDB();
  const post = await Blog.findOne({ slug }).lean();
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ post });
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  await connectDB();
  const body = await request.json();
  const user = session.user as any;

  if (body.status === "published" && !body.publishedAt) body.publishedAt = new Date();

  const post = await Blog.findOneAndUpdate({ slug }, body, { new: true });

  logActivity(user.id, user.name || user.email, "updated blog post", "Blog", post?._id?.toString(), post?.title).catch(() => {});

  return Response.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  await connectDB();
  const user = session.user as any;

  const post = await Blog.findOneAndDelete({ slug });

  logActivity(user.id, user.name || user.email, "deleted blog post", "Blog", post?._id?.toString(), post?.title).catch(() => {});

  return Response.json({ success: true });
}
