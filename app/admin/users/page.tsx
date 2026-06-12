import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const session = await auth();
  const user = session?.user as any;
  if (user?.role !== "superadmin") redirect("/admin");

  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).lean();

  return <UsersClient users={JSON.parse(JSON.stringify(users))} />;
}
