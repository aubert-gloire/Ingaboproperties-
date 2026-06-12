import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["superadmin", "agent", "staff", "marketing"],
      default: "staff",
    },
    department: { type: String, default: "" },
    avatar: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
