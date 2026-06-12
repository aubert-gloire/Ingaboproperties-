import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogForm from "@/components/admin/BlogForm";

export default async function EditBlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  await connectDB();
  const post = await Blog.findOne({ slug }).lean() as any;
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-500 text-sm line-clamp-1">{post.title}</p>
        </div>
      </div>
      <BlogForm post={JSON.parse(JSON.stringify(post))} />
    </div>
  );
}
