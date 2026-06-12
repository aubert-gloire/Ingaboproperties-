"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyPagination({
  total,
  perPage = 12,
}: {
  total: number;
  perPage?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
    document.getElementById("property-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build a compact page list: always show first, last, and ±1 around current
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const btn =
    "flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-lg border border-border bg-paper-2 text-sm font-medium text-forest-900 hover:border-forest-500 hover:bg-forest-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1} className={btn}>
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted-fg text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={`${btn} ${
              p === currentPage ? "!bg-forest-800 !text-paper !border-forest-800 shadow-sm" : ""
            }`}
          >
            {p}
          </button>
        )
      )}

      <button onClick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages} className={btn}>
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
