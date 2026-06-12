import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Link from "next/link";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import StatusBadge from "@/components/admin/StatusBadge";
import BlogListClient from "./BlogListClient";

export default async function AdminBlogPage() {
  await connectDB();
  const posts = await Blog.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 text-sm">Create and manage blog posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-forest-800 text-white rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>
      <BlogListClient posts={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
}
