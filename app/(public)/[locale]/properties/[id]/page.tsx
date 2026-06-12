import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2, CalendarCheck, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import PropertyCard from "@/components/public/PropertyCard";
import PropertyMapLoader from "@/components/public/PropertyMapLoader";
import { formatRWF } from "@/lib/utils";

const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Gasabo": [-1.9441, 30.0619],
  "Kicukiro": [-1.9999, 30.0700],
  "Nyarugenge": [-1.9441, 30.0566],
  "Bugesera": [-2.1958, 30.2142],
  "Gatsibo": [-1.5884, 30.4664],
  "Kayonza": [-1.8834, 30.6466],
  "Kirehe": [-2.2384, 30.6800],
  "Ngoma": [-2.1500, 30.4800],
  "Nyagatare": [-1.2982, 30.3279],
  "Rwamagana": [-1.9500, 30.4333],
  "Burera": [-1.4614, 29.8736],
  "Gakenke": [-1.6958, 29.7800],
  "Gicumbi": [-1.5742, 30.0658],
  "Musanze": [-1.4992, 29.6349],
  "Rulindo": [-1.7267, 29.9800],
  "Gisagara": [-2.6000, 29.8300],
  "Huye": [-2.5959, 29.7378],
  "Kamonyi": [-2.0583, 29.8917],
  "Muhanga": [-2.0833, 29.7500],
  "Nyamagabe": [-2.4667, 29.4833],
  "Nyamasheke": [-2.3334, 29.1334],
  "Nyanza": [-2.3500, 29.7500],
  "Nyaruguru": [-2.7167, 29.5167],
  "Ruhango": [-2.2167, 29.7833],
  "Karongi": [-2.0000, 29.3667],
  "Ngororero": [-1.8833, 29.5333],
  "Nyabihu": [-1.6667, 29.5000],
  "Rubavu": [-1.6800, 29.2600],
  "Rutsiro": [-1.9167, 29.4167],
  "Rusizi": [-2.4833, 28.9000],
};

export default async function PropertyDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  await connectDB();
  const listing = await Listing.findById(id).lean() as any;
  if (!listing || listing.status !== "active") notFound();

  const similar = await Listing.find({
    _id: { $ne: listing._id },
    type: listing.type,
    status: "active",
  })
    .limit(3)
    .lean();

  const l = JSON.parse(JSON.stringify(listing));
  const similars = JSON.parse(JSON.stringify(similar));

  return (
    <div className="min-h-screen bg-paper pt-20 pb-16">
      {/* Photo gallery */}
      <div className="relative h-80 sm:h-96 lg:h-[500px] bg-forest-900">
        {l.photos[0] && (
          <Image
            src={l.photos[0]}
            alt={l.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />
      </div>

      {/* Thumbnail strip */}
      {l.photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-4 bg-paper-2 border-b border-border">
          {l.photos.map((photo: string, i: number) => (
            <div key={i} className="flex-shrink-0 relative w-20 h-16 rounded-lg overflow-hidden">
              <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="80px" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-forest-50 text-forest-600 rounded-md text-xs font-medium capitalize">
                  {l.type}
                </span>
                <span className="px-2.5 py-1 bg-gold-100 text-gold-600 rounded-md text-xs font-medium capitalize">
                  {l.condition === "for-sale" ? "For Sale" : "For Rent"}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
                {l.title}
              </h1>
              <div className="flex items-center gap-1.5 text-muted-fg text-sm">
                <MapPin className="w-4 h-4" />
                {l.location.sector ? `${l.location.sector}, ` : ""}
                {l.location.district}
                {l.location.address ? ` — ${l.location.address}` : ""}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {l.specs.bedrooms > 0 && (
                <div className="bg-paper-2 rounded-xl p-4 text-center border border-border">
                  <Bed className="w-5 h-5 text-forest-500 mx-auto mb-1" />
                  <p className="font-semibold text-forest-900 text-lg">{l.specs.bedrooms}</p>
                  <p className="text-xs text-muted-fg">Bedrooms</p>
                </div>
              )}
              {l.specs.bathrooms > 0 && (
                <div className="bg-paper-2 rounded-xl p-4 text-center border border-border">
                  <Bath className="w-5 h-5 text-forest-500 mx-auto mb-1" />
                  <p className="font-semibold text-forest-900 text-lg">{l.specs.bathrooms}</p>
                  <p className="text-xs text-muted-fg">Bathrooms</p>
                </div>
              )}
              {l.specs.area_sqm > 0 && (
                <div className="bg-paper-2 rounded-xl p-4 text-center border border-border">
                  <Maximize2 className="w-5 h-5 text-forest-500 mx-auto mb-1" />
                  <p className="font-semibold text-forest-900 text-lg">{l.specs.area_sqm}</p>
                  <p className="text-xs text-muted-fg">sqm</p>
                </div>
              )}
              {l.amenities.length > 0 && (
                <div className="bg-paper-2 rounded-xl p-4 text-center border border-border">
                  <div className="w-5 h-5 mx-auto mb-1 text-forest-500 text-lg font-bold">✓</div>
                  <p className="font-semibold text-forest-900 text-lg">{l.amenities.length}</p>
                  <p className="text-xs text-muted-fg">Amenities</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading font-semibold text-xl text-forest-900 mb-3">Description</h2>
              <p className="text-muted-fg leading-relaxed whitespace-pre-line">{l.description}</p>
            </div>

            {/* Amenities */}
            {l.amenities.length > 0 && (
              <div>
                <h2 className="font-heading font-semibold text-xl text-forest-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {l.amenities.map((a: string) => (
                    <span key={a} className="px-3 py-1.5 bg-forest-50 border border-forest-500/20 text-forest-700 rounded-full text-sm">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Land details */}
            {l.type === "land" && (l.upi || l.zoning) && (
              <div className="bg-gold-100 rounded-xl p-4 border border-gold-400/20">
                <h3 className="font-heading font-semibold text-forest-900 mb-2">Land Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {l.upi && (
                    <div>
                      <span className="text-muted-fg">UPI Number</span>
                      <p className="font-medium text-forest-900">{l.upi}</p>
                    </div>
                  )}
                  {l.zoning && (
                    <div>
                      <span className="text-muted-fg">Zoning</span>
                      <p className="font-medium text-forest-900">{l.zoning}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="font-heading font-semibold text-xl text-forest-900 mb-3">Location</h2>
              <div className="h-72 rounded-xl overflow-hidden border border-border">
                {(() => {
                  const lat = l.location?.coordinates?.lat || DISTRICT_COORDS[l.location.district]?.[0] || -1.9441;
                  const lng = l.location?.coordinates?.lng || DISTRICT_COORDS[l.location.district]?.[1] || 30.0619;
                  return (
                    <PropertyMapLoader
                      lat={lat}
                      lng={lng}
                      label={`${l.title} — ${l.location.district}`}
                      zoom={l.location?.coordinates?.lat ? 15 : 12}
                    />
                  );
                })()}
              </div>
              <p className="text-xs text-muted-fg mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {l.location.sector ? `${l.location.sector}, ` : ""}{l.location.district}, Rwanda
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="bg-forest-900 rounded-2xl p-6 text-paper">
              <p className="text-paper/60 text-sm mb-1">Price</p>
              <p className="font-heading text-3xl font-bold text-gold-400 mb-1">
                {formatRWF(l.price)}
              </p>
              <p className="text-paper/50 text-xs">
                {l.condition === "for-sale" ? "Purchase price" : "Per month"}
              </p>
            </div>

            {/* Contact card */}
            <div className="bg-paper-2 rounded-2xl p-5 border border-border space-y-3">
              <h3 className="font-heading font-semibold text-forest-900">Contact Us</h3>
              <p className="text-muted-fg text-sm">Interested in this property? Reach out to our team.</p>

              <a
                href="tel:+250788812776"
                className="flex items-center gap-2.5 w-full px-4 py-3 bg-forest-800 hover:bg-forest-700 text-paper rounded-xl text-sm font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                +250 788 812 776
              </a>

              <a
                href="https://wa.me/250788812776"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <FaWhatsapp className="text-base" />
                Chat on WhatsApp
              </a>

              <Link
                href="/book-appointment"
                className="flex items-center gap-2.5 w-full px-4 py-3 border-2 border-forest-800 text-forest-900 hover:bg-forest-50 rounded-xl text-sm font-medium transition-colors text-center justify-center"
              >
                <CalendarCheck className="w-4 h-4" />
                Book Appointment
              </Link>
            </div>

            {/* Email card */}
            <div className="bg-paper-2 rounded-xl p-4 border border-border text-center">
              <p className="text-xs text-muted-fg mb-1">Email Us</p>
              <a
                href="mailto:ingaboproperties@gmail.com"
                className="text-sm text-forest-500 hover:text-forest-700 font-medium"
              >
                ingaboproperties@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similars.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-forest-900 mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similars.map((s: any) => (
                <PropertyCard
                  key={s._id}
                  id={s._id}
                  title={s.title}
                  type={s.type}
                  condition={s.condition}
                  price={s.price}
                  location={s.location}
                  specs={s.specs}
                  amenities={s.amenities}
                  photos={s.photos}
                  listedAt={s.listedAt}
                  status={s.status}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
