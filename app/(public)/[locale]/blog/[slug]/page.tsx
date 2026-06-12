import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogCard from "@/components/public/BlogCard";

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  await connectDB();
  const post = await Blog.findOne({ slug, status: "published" }).lean() as any;
  if (!post) notFound();

  const related = await Blog.find({ _id: { $ne: post._id }, status: "published" }).limit(3).lean();
  const p = JSON.parse(JSON.stringify(post));
  const relatedPosts = JSON.parse(JSON.stringify(related));

  return (
    <div className="min-h-screen bg-paper pt-20 pb-16">
      {/* Cover */}
      <div className="relative h-72 sm:h-96 bg-forest-900">
        <Image src={p.coverImage} alt={p.title} fill className="object-cover opacity-80" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
          <span className="px-2.5 py-1 bg-gold-500/20 text-gold-400 rounded-md text-xs font-medium capitalize mb-3 inline-block">
            {p.category}
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-paper leading-tight">
            {p.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 text-sm text-muted-fg mb-8 pb-8 border-b border-border">
          <Link href="/blog" className="flex items-center gap-1 hover:text-forest-500 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {p.publishedAt ? format(new Date(p.publishedAt), "MMMM d, yyyy") : ""}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {p.author.name}
          </span>
        </div>

        <div
          className="prose prose-forest max-w-none text-forest-900 leading-relaxed [&>h2]:font-heading [&>h3]:font-heading"
          dangerouslySetInnerHTML={{ __html: p.content }}
        />

        {p.tags?.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-2">
            {p.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-forest-50 text-forest-600 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-forest-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp: any) => (
                <BlogCard key={rp._id} slug={rp.slug} title={rp.title} excerpt={rp.excerpt}
                  coverImage={rp.coverImage} category={rp.category} tags={rp.tags}
                  author={rp.author} publishedAt={rp.publishedAt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
