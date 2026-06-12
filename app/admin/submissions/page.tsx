import { connectDB } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import SubmissionsClient from "./SubmissionsClient";

export default async function SubmissionsPage() {
  await connectDB();
  const submissions = await Submission.find().sort({ createdAt: -1 }).lean();
  return <SubmissionsClient submissions={JSON.parse(JSON.stringify(submissions))} />;
}
