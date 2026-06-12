"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import StatusBadge from "@/components/admin/StatusBadge";

type Post = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author?: { name?: string };
  publishedAt?: string;
  status: string;
};

export default function BlogListClient({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initial);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.slug !== slug));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Author</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                No posts yet.{" "}
                <Link href="/admin/blog/new" className="text-forest-600 hover:underline">
                  Create your first post
                </Link>
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 line-clamp-1 max-w-64">{post.title}</p>
                  <p className="text-xs text-gray-400">/blog/{post.slug}</p>
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">{post.category}</td>
                <td className="px-4 py-3 text-gray-600">{post.author?.name || "—"}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "Draft"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/en/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View on site"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/blog/${post.slug}/edit`}
                      className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug, post.title)}
                      className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
