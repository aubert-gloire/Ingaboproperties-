import { cn } from "@/lib/utils";

const VARIANTS: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  published: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  sold: "bg-blue-100 text-blue-700 border-blue-200",
  inactive: "bg-red-100 text-red-600 border-red-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
  "for-sale": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "for-rent": "bg-sky-100 text-sky-700 border-sky-200",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize",
      VARIANTS[status] || "bg-gray-100 text-gray-600 border-gray-200"
    )}>
      {status.replace(/-/g, " ")}
    </span>
  );
}
