"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { X, CheckCircle, XCircle, Eye, MapPin, Phone, Mail, Bed, Bath, Maximize2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatRWF } from "@/lib/utils";

type Submission = {
  _id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  title: string;
  description: string;
  type: string;
  condition: string;
  price: number;
  location: { district: string; sector?: string; address?: string };
  specs: { bedrooms: number; bathrooms: number; area_sqm: number };
  amenities: string[];
  photos: string[];
  upi?: string;
  zoning?: string;
  status: string;
  createdAt: string;
};

export default function SubmissionsClient({ submissions: initial }: { submissions: Submission[] }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initial);
  const [viewing, setViewing] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(id: string, action: "approved" | "rejected") {
    setLoading(id + action);
    const res = await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: action } : s))
      );
      if (viewing?._id === id) setViewing((v) => v ? { ...v, status: action } : null);
    }
    setLoading(null);
  }

  const pending = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Owner Submissions</h1>
          <p className="text-gray-500 text-sm">
            Properties submitted via "List With Us"
            {pending > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                {pending} pending review
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Owner</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Property</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Photos</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {format(new Date(sub.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{sub.ownerName}</p>
                    <p className="text-xs text-gray-400">{sub.ownerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 line-clamp-1 max-w-44">{sub.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />{sub.location?.district}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">{sub.type}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {formatRWF(sub.price)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{sub.photos?.length || 0} photos</td>
                  <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => setViewing(sub)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {sub.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAction(sub._id, "approved")}
                            disabled={loading === sub._id + "approved"}
                            className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 disabled:opacity-60 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(sub._id, "rejected")}
                            disabled={loading === sub._id + "rejected"}
                            className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 disabled:opacity-60 transition-colors"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">{viewing.title}</h2>
                <p className="text-xs text-gray-400">Submitted {format(new Date(viewing.createdAt), "MMM d, yyyy 'at' HH:mm")}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Owner info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Owner Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">{viewing.ownerName}</span>
                  </div>
                  <a href={`mailto:${viewing.ownerEmail}`} className="flex items-center gap-1.5 text-forest-600 hover:underline">
                    <Mail className="w-3.5 h-3.5" />{viewing.ownerEmail}
                  </a>
                  <a href={`tel:${viewing.ownerPhone}`} className="flex items-center gap-1.5 text-forest-600 hover:underline">
                    <Phone className="w-3.5 h-3.5" />{viewing.ownerPhone}
                  </a>
                </div>
              </div>

              {/* Property details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Type</p>
                  <p className="font-medium capitalize">{viewing.type}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Condition</p>
                  <p className="font-medium">{viewing.condition === "for-sale" ? "For Sale" : "For Rent"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Price</p>
                  <p className="font-medium text-forest-700">{formatRWF(viewing.price)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Location</p>
                  <p className="font-medium">{viewing.location?.sector ? `${viewing.location.sector}, ` : ""}{viewing.location?.district}</p>
                </div>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {viewing.specs?.bedrooms > 0 && (
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{viewing.specs.bedrooms} bed</span>
                )}
                {viewing.specs?.bathrooms > 0 && (
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{viewing.specs.bathrooms} bath</span>
                )}
                {viewing.specs?.area_sqm > 0 && (
                  <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" />{viewing.specs.area_sqm} m²</span>
                )}
                {viewing.upi && <span className="text-gray-500 text-xs">UPI: {viewing.upi}</span>}
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{viewing.description}</p>
              </div>

              {/* Amenities */}
              {viewing.amenities?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewing.amenities.map((a) => (
                      <span key={a} className="px-2 py-1 bg-forest-50 text-forest-700 rounded text-xs">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              {viewing.photos?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Photos ({viewing.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {viewing.photos.map((url, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="200px" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <StatusBadge status={viewing.status} />
              <div className="ml-auto flex gap-3">
                <button onClick={() => setViewing(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-white transition-colors">
                  Close
                </button>
                {viewing.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(viewing._id, "rejected")}
                      disabled={!!loading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(viewing._id, "approved")}
                      disabled={!!loading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve & Publish
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
