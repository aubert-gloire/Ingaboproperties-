"use client";

import { useLocale } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { RWANDA_DISTRICTS } from "@/lib/utils";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "house", label: "Houses" },
  { key: "apartment", label: "Apartments & Condos" },
  { key: "land", label: "Land" },
  { key: "commercial", label: "Commercial" },
  { key: "developments", label: "Developments" },
] as const;

type Cat = (typeof CATEGORIES)[number]["key"];

function resolveCat(type: string): Cat {
  const map: Record<string, Cat> = {
    house: "house",
    apartment: "apartment",
    land: "land",
    commercial: "commercial",
  };
  return map[type] || "all";
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
];

const BEDROOM_OPTIONS = [
  { value: "1", label: "1+ Bedrooms" },
  { value: "2", label: "2+ Bedrooms" },
  { value: "3", label: "3+ Bedrooms" },
  { value: "4", label: "4+ Bedrooms" },
  { value: "5", label: "5+ Bedrooms" },
];

export default function PropertyFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const cat = resolveCat(searchParams.get("type") || "");
  const sp = (k: string) => searchParams.get(k) || "";

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Keep a stable ref so the debounce effect doesn't re-run when pushParams identity changes
  const pushParamsRef = useRef(pushParams);
  useEffect(() => { pushParamsRef.current = pushParams; });

  // Skip-first-render flag so we don't fire on mount
  const mounted = useRef(false);

  // Debounced live search — fires 300ms after the user stops typing
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const t = setTimeout(() => pushParamsRef.current({ search }), 300);
    return () => clearTimeout(t);
  }, [search]); // intentionally only `search` — ref keeps pushParams stable

  // Auto-scroll flag — set before navigation, consumed after searchParams update
  const scrollAfterNav = useRef(false);

  useEffect(() => {
    if (scrollAfterNav.current) {
      scrollAfterNav.current = false;
      document
        .getElementById("property-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams({ search });
  };

  const handleCategory = (key: Cat) => {
    if (key === "developments") {
      router.push(`/${locale}/developments`);
      return;
    }
    scrollAfterNav.current = true;
    const params = new URLSearchParams();
    const q = searchParams.get("search");
    if (q) params.set("search", q);
    if (key !== "all") params.set("type", key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters =
    sp("condition") || sp("minPrice") || sp("maxPrice") ||
    sp("minBedrooms") || sp("district") || sp("search");

  const clearAll = () => {
    setSearch("");
    const params = new URLSearchParams();
    if (sp("type")) params.set("type", sp("type"));
    router.push(`${pathname}?${params.toString()}`);
  };

  const sel =
    "w-full px-3 py-2.5 bg-paper-2 border border-border rounded-lg text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500 cursor-pointer";
  const inp =
    "w-full px-3 py-2.5 bg-paper-2 border border-border rounded-lg text-sm text-forest-900 placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-forest-500";

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, location, or keyword..."
          className="w-full pl-10 pr-12 py-3 bg-paper-2 border border-border rounded-xl text-sm text-forest-900 placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
        />
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); pushParams({ search: "" }); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg hover:text-forest-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Category toggle pills — horizontal scroll on mobile with snap */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => handleCategory(c.key)}
            className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              cat === c.key && c.key !== "developments"
                ? "bg-forest-800 text-paper shadow-sm"
                : "bg-paper-2 border border-border text-forest-900 hover:border-forest-500 hover:bg-forest-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Context-sensitive filters — 3 per category, 2-col on mobile / 3-col on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

        {/* ALL: Condition | District | Sort */}
        {cat === "all" && (
          <>
            <select value={sp("condition")} onChange={(e) => pushParams({ condition: e.target.value })} className={sel}>
              <option value="">For Sale &amp; Rent</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
            <select value={sp("district")} onChange={(e) => pushParams({ district: e.target.value })} className={sel}>
              <option value="">All Districts</option>
              {RWANDA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={sp("sort") || "newest"} onChange={(e) => pushParams({ sort: e.target.value })} className={`${sel} col-span-2 sm:col-span-1`}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </>
        )}

        {/* HOUSES: Condition | Bedrooms | Sort */}
        {cat === "house" && (
          <>
            <select value={sp("condition")} onChange={(e) => pushParams({ condition: e.target.value })} className={sel}>
              <option value="">For Sale &amp; Rent</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
            <select value={sp("minBedrooms")} onChange={(e) => pushParams({ minBedrooms: e.target.value })} className={sel}>
              <option value="">Any Bedrooms</option>
              {BEDROOM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={sp("sort") || "newest"} onChange={(e) => pushParams({ sort: e.target.value })} className={`${sel} col-span-2 sm:col-span-1`}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </>
        )}

        {/* APARTMENTS & CONDOS: Condition | Bedrooms | Sort */}
        {cat === "apartment" && (
          <>
            <select value={sp("condition")} onChange={(e) => pushParams({ condition: e.target.value })} className={sel}>
              <option value="">For Sale &amp; Rent</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
            <select value={sp("minBedrooms")} onChange={(e) => pushParams({ minBedrooms: e.target.value })} className={sel}>
              <option value="">Any Bedrooms</option>
              {BEDROOM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={sp("sort") || "newest"} onChange={(e) => pushParams({ sort: e.target.value })} className={`${sel} col-span-2 sm:col-span-1`}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </>
        )}

        {/* LAND: Min Price | District | Sort */}
        {cat === "land" && (
          <>
            <input
              type="number"
              placeholder="Min Price (RWF)"
              defaultValue={sp("minPrice")}
              key={`land-min-${sp("minPrice")}`}
              onBlur={(e) => pushParams({ minPrice: e.target.value })}
              className={inp}
            />
            <select value={sp("district")} onChange={(e) => pushParams({ district: e.target.value })} className={sel}>
              <option value="">All Districts</option>
              {RWANDA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={sp("sort") || "newest"} onChange={(e) => pushParams({ sort: e.target.value })} className={`${sel} col-span-2 sm:col-span-1`}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </>
        )}

        {/* COMMERCIAL: Condition | Min Price | Sort */}
        {cat === "commercial" && (
          <>
            <select value={sp("condition")} onChange={(e) => pushParams({ condition: e.target.value })} className={sel}>
              <option value="">For Sale &amp; Rent</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
            <input
              type="number"
              placeholder="Min Price (RWF)"
              defaultValue={sp("minPrice")}
              key={`comm-min-${sp("minPrice")}`}
              onBlur={(e) => pushParams({ minPrice: e.target.value })}
              className={inp}
            />
            <select value={sp("sort") || "newest"} onChange={(e) => pushParams({ sort: e.target.value })} className={`${sel} col-span-2 sm:col-span-1`}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </>
        )}
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-fg">
          Showing <span className="font-semibold text-forest-900">{total}</span>{" "}
          {total === 1 ? "property" : "properties"}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-forest-600 hover:text-forest-800 underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
