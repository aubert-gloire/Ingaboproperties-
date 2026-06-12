import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogCard from "@/components/public/BlogCard";

async function getPosts() {
  try {
    await connectDB();
    const posts = await Blog.find({ status: "published" }).sort({ publishedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-paper pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm font-medium uppercase tracking-widest mb-2">Insights</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900 mb-2">Our Blog</h1>
          <p className="text-muted-fg">Real estate insights, tips, and Rwanda property market news</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <BlogCard
                key={post._id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                category={post.category}
                tags={post.tags}
                author={post.author}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-fg">
            <p>No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
