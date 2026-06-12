import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-gray-500 text-sm">Draft a post — publish when ready</p>
        </div>
      </div>
      <BlogForm />
    </div>
  );
}
