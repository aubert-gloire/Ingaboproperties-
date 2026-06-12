import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/public/HeroSection";
import StatsSection from "@/components/public/StatsSection";
import WhyUsSection from "@/components/public/WhyUsSection";
import PropertyCard from "@/components/public/PropertyCard";
import BlogCard from "@/components/public/BlogCard";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import Blog from "@/models/Blog";

async function getFeaturedListings() {
  try {
    await connectDB();
    const listings = await Listing.find({ status: "active", featured: true })
      .sort({ listedAt: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(listings));
  } catch {
    return [];
  }
}

async function getLatestBlogs() {
  try {
    await connectDB();
    const posts = await Blog.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [t, tCommon, tContact, listings, blogs] = await Promise.all([
    getTranslations("featured"),
    getTranslations("common"),
    getTranslations("contact"),
    getFeaturedListings(),
    getLatestBlogs(),
  ]);

  return (
    <>
      <HeroSection />

      {/* Featured Properties */}
      <section className="py-16 sm:py-24 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-gold-600 text-sm font-medium uppercase tracking-widest mb-2">
                {t("label")}
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900">
                {t("title")}
              </h2>
            </div>
            <Link
              href="/properties"
              className="flex items-center gap-2 text-forest-500 font-medium text-sm hover:text-forest-700 transition-colors"
            >
              {tCommon("viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any) => (
                <PropertyCard
                  key={listing._id}
                  id={listing._id}
                  title={listing.title}
                  type={listing.type}
                  condition={listing.condition}
                  price={listing.price}
                  location={listing.location}
                  specs={listing.specs}
                  amenities={listing.amenities}
                  photos={listing.photos}
                  listedAt={listing.listedAt}
                  status={listing.status}
                  featured={listing.featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-fg">
              <p>{tCommon("noResults")}</p>
            </div>
          )}
        </div>
      </section>

      <StatsSection />
      <WhyUsSection />

      {/* Blog Teaser */}
      {blogs.length > 0 && (
        <section className="py-16 sm:py-24 bg-paper-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-gold-600 text-sm font-medium uppercase tracking-widest mb-2">
                  Latest News
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900">
                  From Our Blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="flex items-center gap-2 text-forest-500 font-medium text-sm hover:text-forest-700 transition-colors"
              >
                {tCommon("viewAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post: any) => (
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-forest-900 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-paper mb-4">
            Ready to find your <span className="text-gold-400">perfect property</span>?
          </h2>
          <p className="text-paper/60 text-lg mb-10 max-w-2xl mx-auto">
            Our team of Rwanda real estate experts is ready to help you find, buy, rent, or sell your property.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/properties"
              className="px-7 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 border border-paper/30 hover:bg-paper/10 text-paper font-semibold rounded-xl transition-colors"
            >
              {tContact("title")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
