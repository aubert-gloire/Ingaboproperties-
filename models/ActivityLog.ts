import mongoose, { Schema, models } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: String,
    details: String,
  },
  { timestamps: true }
);

export async function logActivity(
  userId: string,
  userName: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: string
) {
  const ActivityLog = models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);
  return ActivityLog.create({ userId, userName, action, resourceType, resourceId, details });
}

export default models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);
