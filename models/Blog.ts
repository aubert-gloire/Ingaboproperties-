import mongoose, { Schema, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
    author: {
      name: { type: String, required: true },
      avatar: String,
    },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: Date,
  },
  { timestamps: true }
);

export default models.Blog || mongoose.model("Blog", BlogSchema);
