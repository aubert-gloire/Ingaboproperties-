import mongoose, { Schema, models } from "mongoose";

const SubmissionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["house", "land", "apartment", "villa", "commercial"],
      required: true,
    },
    condition: { type: String, enum: ["for-sale", "for-rent"], required: true },
    price: { type: Number, required: true },
    location: {
      district: String,
      sector: String,
      address: String,
    },
    specs: {
      bedrooms: Number,
      bathrooms: Number,
      area_sqm: Number,
    },
    amenities: [String],
    photos: [String],
    upi: String,
    zoning: String,
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    ownerWhatsapp: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
  },
  { timestamps: true }
);

export default models.Submission || mongoose.model("Submission", SubmissionSchema);
