import Link from "next/link";
import { Home, Landmark, Building, Layers, Briefcase } from "lucide-react";

const TYPES = [
  { href: "/admin/properties/houses", icon: Home, label: "Houses", desc: "Single-family homes and townhouses" },
  { href: "/admin/properties/land", icon: Landmark, label: "Land", desc: "Plots and land parcels" },
  { href: "/admin/properties/apartments", icon: Building, label: "Apartments", desc: "Apartments and condos" },
  { href: "/admin/properties/villas", icon: Layers, label: "Villas", desc: "Premium villa properties" },
  { href: "/admin/properties/commercial", icon: Briefcase, label: "Commercial", desc: "Office, retail, and industrial spaces" },
];

export default function PropertiesIndexPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Property Management</h1>
        <p className="text-gray-500 text-sm">Select a property category to manage</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TYPES.map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-forest-500 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-forest-50 group-hover:bg-forest-800 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <Icon className="w-5 h-5 text-forest-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
