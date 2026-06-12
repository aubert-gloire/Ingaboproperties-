import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const submissions = await Submission.find().sort({ createdAt: -1 }).lean();
  return Response.json({ submissions });
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const submission = await Submission.create(body);
  return Response.json({ submission }, { status: 201 });
}
