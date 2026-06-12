import mongoose, { Schema, models } from "mongoose";

const AppointmentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: String,
    propertyId: { type: Schema.Types.ObjectId, ref: "Listing" },
    propertyTitle: String,
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    message: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Appointment || mongoose.model("Appointment", AppointmentSchema);
