"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, MapPin, Bed, Bath } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatRWF, timeAgo } from "@/lib/utils";

interface PropertyTableProps {
  properties: any[];
  propertyType?: string;
}

export default function PropertyTable({ properties: initial, propertyType }: PropertyTableProps) {
  const router = useRouter();
  const [properties, setProperties] = useState(initial);
  const [selected, setSelected] = useState<string[]>([]);
  const showZoning = propertyType === "land";

  const toggleAll = () =>
    setSelected(selected.length === properties.length ? [] : properties.map((p) => p._id));

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setProperties((prev) => prev.map((p) => p._id === id ? { ...p, status } : p));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setSelected((s) => s.filter((x) => x !== id));
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.length} properties? This cannot be undone.`)) return;
    await Promise.all(selected.map((id) => fetch(`/api/listings/${id}`, { method: "DELETE" })));
    setProperties((prev) => prev.filter((p) => !selected.includes(p._id)));
    setSelected([]);
  }

  const editHref = (id: string) =>
    propertyType ? `/admin/properties/${propertyType}/${id}/edit` : `/admin/properties/${id}/edit`;

  const viewHref = (p: any) => {
    const locale = "en";
    return `/${locale}/properties/${p._id}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border-b border-blue-100">
          <span className="text-sm text-blue-700 font-medium">{selected.length} selected</span>
          <button
            onClick={handleBulkDelete}
            className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete selected
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:text-gray-700 ml-auto">
            Clear
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={selected.length === properties.length && properties.length > 0}
                  onChange={toggleAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Property</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Condition</th>
              {showZoning ? (
                <th className="px-4 py-3 text-left font-medium text-gray-600">Zoning / UPI</th>
              ) : (
                <th className="px-4 py-3 text-left font-medium text-gray-600">Specs</th>
              )}
              <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Listed</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  No properties found.
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr
                  key={p._id}
                  className={`hover:bg-gray-50 transition-colors ${selected.includes(p._id) ? "bg-blue-50" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p._id)}
                      onChange={() => toggle(p._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.photos?.[0] ? (
                          <Image src={p.photos[0]} alt={p.title} fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1 max-w-48">{p.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {p.location?.district}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.condition} />
                  </td>
                  <td className="px-4 py-3">
                    {showZoning ? (
                      <div>
                        <p className="text-gray-600 text-xs">{p.zoning || "—"}</p>
                        <p className="text-xs text-gray-400">{p.upi || "No UPI"}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        {p.specs?.bedrooms > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Bed className="w-3 h-3" />{p.specs.bedrooms}
                          </span>
                        )}
                        {p.specs?.bathrooms > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Bath className="w-3 h-3" />{p.specs.bathrooms}
                          </span>
                        )}
                        {p.specs?.area_sqm > 0 && <span>{p.specs.area_sqm}m²</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {formatRWF(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                    >
                      {["pending", "active", "sold", "inactive"].map((s) => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {timeAgo(p.listedAt || p.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={viewHref(p)}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View on site"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={editHref(p._id)}
                        className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
