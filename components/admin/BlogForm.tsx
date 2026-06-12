"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { Upload, X, Loader2, Bold, Italic, List, ListOrdered, Heading2, Heading3, Link as LinkIcon, Quote, Undo, Redo } from "lucide-react";
import { slugify } from "@/lib/utils";

const CATEGORIES = ["Market Insights", "Investment Tips", "Rwanda Real Estate", "Property Guide", "News", "Lifestyle"];

type Post = {
  _id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  author?: { name?: string; avatar?: string };
  status?: string;
};

export default function BlogForm({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post?._id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    category: post?.category || CATEGORIES[0],
    tags: post?.tags?.join(", ") || "",
    authorName: post?.author?.name || "Ingabo Properties",
    coverImage: post?.coverImage || "",
    status: post?.status || "draft",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
    ],
    content: post?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function autoSlug(title: string) {
    if (!isEdit) set("slug", slugify(title));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ingabo-properties");
    data.append("folder", "ingabo/blog");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    const json = await res.json();
    if (json.secure_url) set("coverImage", json.secure_url);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const content = editor?.getHTML() || "";
    if (!content || content === "<p></p>") {
      setError("Content cannot be empty");
      setSaving(false);
      return;
    }

    const body = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      author: { name: form.authorName },
      coverImage: form.coverImage,
      status: form.status,
    };

    const url = isEdit ? `/api/blog/${post!.slug}` : "/api/blog";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save post");
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  if (!editor) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Post Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text" required
            value={form.title}
            onChange={(e) => { set("title", e.target.value); autoSlug(e.target.value); }}
            placeholder="e.g. Top 5 Neighbourhoods to Invest in Kigali"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              type="text" required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto-generated from title"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input
              type="text"
              value={form.authorName}
              onChange={(e) => set("authorName", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="kigali, investment, land"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (shown in listings)</label>
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Brief summary shown on the blog listing page…"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="draft">Draft (not visible)</option>
              <option value="published">Published (live)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Cover Image</h2>
        {form.coverImage ? (
          <div className="relative rounded-xl overflow-hidden h-48 bg-gray-100 group">
            <Image src={form.coverImage} alt="Cover" fill className="object-cover" sizes="600px" />
            <button
              type="button"
              onClick={() => set("coverImage", "")}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-forest-400 hover:bg-forest-50/30 transition-colors"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Uploading…</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload cover image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP recommended — 1200×630px</p>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-2 flex flex-wrap items-center gap-1">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded text-gray-500 hover:bg-gray-100 ${editor.isActive("bold") ? "bg-gray-100 text-gray-900" : ""}`}>
            <Bold className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded text-gray-500 hover:bg-gray-100 ${editor.isActive("italic") ? "bg-gray-100 text-gray-900" : ""}`}>
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded text-gray-500 hover:bg-gray-100 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-100 text-gray-900" : ""}`}>
            <Heading2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded text-gray-500 hover:bg-gray-100 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-100 text-gray-900" : ""}`}>
            <Heading3 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded text-gray-500 hover:bg-gray-100 ${editor.isActive("bulletList") ? "bg-gray-100 text-gray-900" : ""}`}>
            <List className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded text-gray-500 hover:bg-gray-100 ${editor.isActive("orderedList") ? "bg-gray-100 text-gray-900" : ""}`}>
            <ListOrdered className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded text-gray-500 hover:bg-gray-100 ${editor.isActive("blockquote") ? "bg-gray-100 text-gray-900" : ""}`}>
            <Quote className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button type="button" onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded text-gray-500 hover:bg-gray-100">
            <Undo className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded text-gray-500 hover:bg-gray-100">
            <Redo className="w-4 h-4" />
          </button>
        </div>
        <div className="min-h-[350px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      <div className="flex items-center gap-4 pb-8">
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving || uploading}
          className="px-8 py-2.5 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Save Changes" : form.status === "published" ? "Publish Post" : "Save as Draft"}
        </button>
      </div>
    </form>
  );
}
