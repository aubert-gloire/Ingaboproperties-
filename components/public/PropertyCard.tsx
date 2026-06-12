"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Bed, Bath, Maximize2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatRWF, timeAgo, cn } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  title: string;
  type: string;
  condition: "for-sale" | "for-rent";
  price: number;
  location: { district: string; sector?: string };
  specs: { bedrooms?: number; bathrooms?: number; area_sqm?: number };
  amenities?: string[];
  photos: string[];
  listedAt: string | Date;
  featured?: boolean;
  status?: string;
}

export default function PropertyCard({
  id, title, type, condition, price, location,
  specs, amenities = [], photos, listedAt, status,
}: PropertyCardProps) {
  const t = useTranslations("propertyCard");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const displayPhotos = photos.length > 0 ? photos : ["/placeholder-property.jpg"];

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    setPhotoIndex((i) => (i + 1) % displayPhotos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    setPhotoIndex((i) => (i - 1 + displayPhotos.length) % displayPhotos.length);
  };

  const conditionLabel =
    condition === "for-sale" ? t("forSale") :
    condition === "for-rent" ? t("forRent") : condition;

  const statusBadgeColor =
    status === "active" ? "bg-green-100 text-green-800" :
    status === "pending" ? "bg-yellow-100 text-yellow-800" :
    status === "sold" ? "bg-blue-100 text-blue-800" :
    "bg-gray-100 text-gray-800";

  return (
    <Link href={`/properties/${id}`} className="group block">
      <div className="bg-paper-2 rounded-2xl overflow-hidden border border-border hover:border-forest-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-forest-50">
          <Image
            src={displayPhotos[photoIndex]}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Status badge top-left */}
          <div className="absolute top-3 left-3">
            <span className={cn("px-2 py-1 rounded-md text-xs font-semibold", statusBadgeColor)}>
              {status === "active" ? conditionLabel : status || conditionLabel}
            </span>
          </div>

          {/* Type badge top-right */}
          <div className="absolute top-3 right-10">
            <span className="px-2 py-1 bg-forest-900/80 text-paper rounded-md text-xs font-medium capitalize">
              {type}
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Wishlist"
          >
            <Heart className={cn("w-3.5 h-3.5", wishlisted ? "fill-red-500 text-red-500" : "text-forest-900")} />
          </button>

          {/* Photo nav */}
          {displayPhotos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {displayPhotos.map((_, i) => (
                  <span
                    key={i}
                    className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === photoIndex ? "bg-white" : "bg-white/50")}
                  />
                ))}
              </div>
            </>
          )}

          {/* Price overlay bottom-left */}
          <div className="absolute bottom-3 left-3 bg-forest-900/90 text-paper px-2.5 py-1 rounded-lg">
            <span className="text-sm font-semibold">{formatRWF(price)}</span>
          </div>

          {/* Area overlay bottom-right */}
          {specs.area_sqm ? (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-0.5 rounded-md text-xs">
              {specs.area_sqm} sqm
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading font-semibold text-forest-900 text-base line-clamp-1 mb-1 group-hover:text-forest-500 transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-muted-fg text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{location.sector ? `${location.sector}, ` : ""}{location.district}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-fg mb-3">
            {specs.bedrooms !== undefined && specs.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" />
                {specs.bedrooms}
              </span>
            )}
            {specs.bathrooms !== undefined && specs.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />
                {specs.bathrooms}
              </span>
            )}
            {amenities.length > 0 && (
              <span>{amenities.length} {t("amenities").toLowerCase()}</span>
            )}
            <span className="ml-auto">{timeAgo(listedAt)}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-fg capitalize">{type}</span>
            <span className="text-xs font-medium text-forest-500 group-hover:text-forest-600 transition-colors">
              {t("viewDetails")} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
