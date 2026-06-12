import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags?: string[];
  author: { name: string; avatar?: string };
  publishedAt: string | Date;
}

export default function BlogCard({
  slug, title, excerpt, coverImage, category, tags = [], author, publishedAt,
}: BlogCardProps) {
  const t = useTranslations("common");

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="bg-paper-2 rounded-2xl overflow-hidden border border-border hover:border-forest-500 hover:shadow-md transition-all">
        <div className="relative h-48 bg-forest-50">
          <Image
            src={coverImage || "/placeholder-blog.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-forest-900/80 text-gold-400 rounded-md text-xs font-medium capitalize">
              {category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-muted-fg mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(publishedAt), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {author.name}
            </span>
          </div>

          <h3 className="font-heading font-semibold text-forest-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-forest-500 transition-colors">
            {title}
          </h3>
          <p className="text-muted-fg text-sm leading-relaxed line-clamp-3 mb-4">{excerpt}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-forest-50 text-forest-600 rounded-md text-xs">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-0.5 bg-forest-50 text-muted-fg rounded-md text-xs">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 text-forest-500 text-sm font-medium group-hover:gap-2 transition-all">
            {t("readMore")}
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}
