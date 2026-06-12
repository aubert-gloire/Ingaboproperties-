"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, CheckCircle } from "lucide-react";
import { RWANDA_DISTRICTS, AMENITIES, PROPERTY_TYPES } from "@/lib/utils";

export default function ListWithUsPage() {
  const t = useTranslations("listWithUs");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", type: "", condition: "for-sale", price: "",
    district: "", sector: "", address: "", description: "",
    bedrooms: "", bathrooms: "", areaSqm: "", upi: "", zoning: "",
    amenities: [] as string[],
    ownerName: "", ownerEmail: "", ownerPhone: "", ownerWhatsapp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const toggleAmenity = (a: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos((p) => [...p, ...Array.from(e.target.files!)]);
  };

  const removePhoto = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length < 3) { setError("Please upload at least 3 photos."); return; }
    setLoading(true);
    setError("");

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_SUBMISSION;
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, Array.isArray(v) ? v.join(", ") : v));
    data.append("photos_count", String(photos.length));

    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photos: [] }),
      });
      setSubmitted(true);
    } else {
      setError("Submission failed. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-paper pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-forest-900 mb-2">{t("successTitle")}</h2>
          <p className="text-muted-fg">{t("successMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900 mb-2">{t("title")}</h1>
          <p className="text-muted-fg">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Details */}
          <section className="bg-paper-2 rounded-2xl p-6 border border-border space-y-4">
            <h2 className="font-heading font-semibold text-xl text-forest-900">Property Details</h2>

            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("propertyTitle")} *</label>
              <input name="title" value={form.title} onChange={handleChange} required
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("propertyType")} *</label>
                <select name="type" value={form.type} onChange={handleChange} required
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500">
                  <option value="">Select type</option>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("listingType")} *</label>
                <select name="condition" value={form.condition} onChange={handleChange} required
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500">
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("price")} *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("district")} *</label>
                <select name="district" value={form.district} onChange={handleChange} required
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500">
                  <option value="">Select district</option>
                  {RWANDA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("sector")}</label>
                <input name="sector" value={form.sector} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("description")} *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("bedrooms")}</label>
                <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("bathrooms")}</label>
                <input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("areaSqm")}</label>
                <input name="areaSqm" type="number" min="0" value={form.areaSqm} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
            </div>

            {form.type === "land" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest-900 mb-1">{t("upi")}</label>
                  <input name="upi" value={form.upi} onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-900 mb-1">{t("zoning")}</label>
                  <select name="zoning" value={form.zoning} onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500">
                    <option value="">Select zoning</option>
                    <option value="R1">R1 (Residential)</option>
                    <option value="R2">R2 (Residential)</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-forest-900 mb-2">{t("amenities")}</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      form.amenities.includes(a)
                        ? "bg-forest-800 text-paper"
                        : "bg-paper border border-border text-forest-900 hover:border-forest-500"
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="bg-paper-2 rounded-2xl p-6 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-xl text-forest-900">{t("photos")}</h2>
              <span className={`text-sm font-medium ${photos.length >= 3 ? "text-green-600" : "text-red-500"}`}>
                {photos.length}/3 minimum
              </span>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-forest-500 hover:bg-forest-50 transition-colors">
              <Upload className="w-8 h-8 text-muted-fg mb-2" />
              <span className="text-sm text-muted-fg">{t("photosHint")}</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
            </label>

            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((file, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(file)} alt="" className="w-20 h-16 object-cover rounded-lg" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Contact Info */}
          <section className="bg-paper-2 rounded-2xl p-6 border border-border space-y-4">
            <h2 className="font-heading font-semibold text-xl text-forest-900">Your Contact Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("yourName")} *</label>
                <input name="ownerName" value={form.ownerName} onChange={handleChange} required
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("yourEmail")} *</label>
                <input name="ownerEmail" type="email" value={form.ownerEmail} onChange={handleChange} required
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("yourPhone")} *</label>
                <input name="ownerPhone" value={form.ownerPhone} onChange={handleChange} required
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">{t("yourWhatsapp")}</label>
                <input name="ownerWhatsapp" value={form.ownerWhatsapp} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
            </div>
          </section>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-paper font-semibold rounded-xl transition-colors text-sm">
            {loading ? "Submitting..." : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
