"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-400 text-sm">Loading map…</span>
    </div>
  ),
});

export default PropertyMap;
