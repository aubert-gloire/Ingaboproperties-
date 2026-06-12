import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const contact = await Contact.create(body);
  return Response.json({ contact }, { status: 201 });
}
