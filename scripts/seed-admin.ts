import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing in .env.local");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: { type: String, select: false },
  role: { type: String, default: "staff" },
  department: String,
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);

  const email = "ingaboproperties@gmail.com";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("nathan2026", 12);
  await User.create({
    name: "Ingabo Admin",
    email,
    passwordHash,
    role: "superadmin",
    department: "Management",
  });

  console.log("Admin created successfully");
  console.log("  Email:", email);
  console.log("  Password: nathan2026");
  console.log("\n  Change this password immediately after first login!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
