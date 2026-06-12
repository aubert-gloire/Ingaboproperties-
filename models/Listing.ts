import mongoose, { Schema, models } from "mongoose";

const ListingSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["house", "land", "apartment", "villa", "commercial"],
      required: true,
    },
    condition: {
      type: String,
      enum: ["for-sale", "for-rent"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "sold", "inactive"],
      default: "pending",
    },
    price: { type: Number, required: true },
    location: {
      district: { type: String, required: true },
      sector: { type: String, default: "" },
      address: { type: String, default: "" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    specs: {
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      area_sqm: { type: Number, default: 0 },
    },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    upi: { type: String, default: "" },
    zoning: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    submittedBy: {
      name: String,
      email: String,
      phone: String,
      whatsapp: String,
    },
    source: { type: String, enum: ["admin", "owner-submission"], default: "admin" },
    listedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ListingSchema.index({ type: 1, condition: 1, status: 1 });
ListingSchema.index({ "location.district": 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ featured: 1 });

export default models.Listing || mongoose.model("Listing", ListingSchema);
