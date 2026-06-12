"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, Star } from "lucide-react";
import { RWANDA_DISTRICTS, AMENITIES, PROPERTY_TYPES } from "@/lib/utils";

type Listing = {
  _id?: string;
  title?: string;
  description?: string;
  type?: string;
  condition?: string;
  status?: string;
  price?: number;
  location?: { district?: string; sector?: string; address?: string; coordinates?: { lat?: number; lng?: number } };
  specs?: { bedrooms?: number; bathrooms?: number; area_sqm?: number };
  amenities?: string[];
  photos?: string[];
  upi?: string;
  zoning?: string;
  featured?: boolean;
};

type Props = {
  listing?: Listing;
  defaultType?: string;
};

export default function PropertyForm({ listing, defaultType }: Props) {
  const router = useRouter();
  const isEdit = !!listing?._id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: listing?.title || "",
    description: listing?.description || "",
    type: listing?.type || defaultType || "house",
    condition: listing?.condition || "for-sale",
    status: listing?.status || "active",
    price: listing?.price?.toString() || "",
    district: listing?.location?.district || "",
    sector: listing?.location?.sector || "",
    address: listing?.location?.address || "",
    lat: listing?.location?.coordinates?.lat?.toString() || "",
    lng: listing?.location?.coordinates?.lng?.toString() || "",
    bedrooms: listing?.specs?.bedrooms?.toString() || "0",
    bathrooms: listing?.specs?.bathrooms?.toString() || "0",
    area_sqm: listing?.specs?.area_sqm?.toString() || "0",
    upi: listing?.upi || "",
    zoning: listing?.zoning || "",
    featured: listing?.featured || false,
  });

  const [amenities, setAmenities] = useState<string[]>(listing?.amenities || []);
  const [photos, setPhotos] = useState<string[]>(listing?.photos || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isLand = form.type === "land";

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleAmenity(a: string) {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ingabo-properties");
      data.append("folder", "ingabo/properties");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      if (json.secure_url) uploaded.push(json.secure_url);
    }

    setPhotos((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p !== url));
  }

  function setCover(url: string) {
    setPhotos((prev) => [url, ...prev.filter((p) => p !== url)]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      title: form.title,
      description: form.description,
      type: form.type,
      condition: form.condition,
      status: form.status,
      price: Number(form.price),
      location: {
        district: form.district,
        sector: form.sector,
        address: form.address,
        ...(form.lat && form.lng ? { coordinates: { lat: Number(form.lat), lng: Number(form.lng) } } : {}),
      },
      specs: {
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area_sqm: Number(form.area_sqm),
      },
      amenities,
      photos,
      upi: form.upi,
      zoning: form.zoning,
      featured: form.featured,
    };

    const url = isEdit ? `/api/listings/${listing!._id}` : "/api/listings";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save property");
      setSaving(false);
      return;
    }

    router.push(`/admin/properties/${form.type}s`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Basic info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Modern 3-Bedroom House in Kiyovu"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the property in detail…"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="active">Active (visible)</option>
              <option value="pending">Pending (hidden)</option>
              <option value="sold">Sold</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="e.g. 75000000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="rounded border-gray-300 text-gold-500"
          />
          <label htmlFor="featured" className="text-sm text-gray-700 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-gold-500" />
            Feature this property on the homepage
          </label>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              required
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="">Select district…</option>
              {RWANDA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <input
              type="text"
              value={form.sector}
              onChange={(e) => set("sector", e.target.value)}
              placeholder="e.g. Kiyovu"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street / Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="e.g. KN 12 St"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude <span className="text-gray-400 font-normal">(optional — for exact map pin)</span>
            </label>
            <input
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => set("lat", e.target.value)}
              placeholder="-1.9441"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => set("lng", e.target.value)}
              placeholder="30.0619"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
        </div>
      </section>

      {/* Specs */}
      {!isLand && (
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Property Specs</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number" min="0"
                value={form.bedrooms}
                onChange={(e) => set("bedrooms", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number" min="0"
                value={form.bathrooms}
                onChange={(e) => set("bathrooms", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
              <input
                type="number" min="0"
                value={form.area_sqm}
                onChange={(e) => set("area_sqm", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        </section>
      )}

      {/* Land Details */}
      {isLand && (
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Land Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
              <input
                type="number" min="0"
                value={form.area_sqm}
                onChange={(e) => set("area_sqm", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI Number</label>
              <input
                type="text"
                value={form.upi}
                onChange={(e) => set("upi", e.target.value)}
                placeholder="e.g. 1/01/05/01/1234"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zoning</label>
              <input
                type="text"
                value={form.zoning}
                onChange={(e) => set("zoning", e.target.value)}
                placeholder="e.g. Residential"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        </section>
      )}

      {/* Photos */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Photos</h2>
        <p className="text-xs text-gray-500">First photo is the cover image. Click the star icon to set a different cover.</p>

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
              <p className="text-sm text-gray-500">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — multiple files allowed</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />

        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {photos.map((url, i) => (
              <div key={url} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
                {i === 0 && (
                  <div className="absolute top-1 left-1 bg-gold-500 text-forest-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    COVER
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => setCover(url)}
                      className="p-1 bg-gold-500 rounded-full text-forest-900"
                      title="Set as cover"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    className="p-1 bg-red-500 rounded-full text-white"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Amenities */}
      {!isLand && (
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {AMENITIES.map((a) => (
              <label
                key={a}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                  amenities.includes(a)
                    ? "bg-forest-50 border-forest-500 text-forest-800"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                  className="sr-only"
                />
                <span className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center text-[9px] ${
                  amenities.includes(a) ? "bg-forest-500 border-forest-500 text-white" : "border-gray-300"
                }`}>
                  {amenities.includes(a) && "✓"}
                </span>
                {a}
              </label>
            ))}
          </div>
        </section>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4 pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-8 py-2.5 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Publish Listing"}
        </button>
      </div>
    </form>
  );
}
