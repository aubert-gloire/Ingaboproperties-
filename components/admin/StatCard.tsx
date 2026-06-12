import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  href?: string;
  color?: "green" | "blue" | "gold" | "red";
  progress?: number;
}

const COLORS = {
  green: { border: "border-t-green-500", icon: "bg-green-50 text-green-600", bar: "bg-green-500" },
  blue: { border: "border-t-blue-500", icon: "bg-blue-50 text-blue-600", bar: "bg-blue-500" },
  gold: { border: "border-t-amber-500", icon: "bg-amber-50 text-amber-600", bar: "bg-amber-500" },
  red: { border: "border-t-red-500", icon: "bg-red-50 text-red-600", bar: "bg-red-500" },
};

export default function StatCard({ label, value, icon: Icon, description, href, color = "green", progress }: StatCardProps) {
  const c = COLORS[color];

  return (
    <div className={cn("bg-white rounded-xl p-5 border border-gray-200 border-t-4 shadow-sm", c.border)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", c.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {progress !== undefined && (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", c.bar)} style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      )}
      {href && (
        <Link href={href} className="text-xs text-forest-500 hover:text-forest-700 font-medium mt-2 inline-block transition-colors">
          View →
        </Link>
      )}
    </div>
  );
}
