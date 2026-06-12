import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRWF(amount: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function timeAgo(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const RWANDA_DISTRICTS = [
  "Nyarugenge", "Gasabo", "Kicukiro",
  "Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo",
  "Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango",
  "Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana",
  "Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro", "Rusizi",
  "Gicumbi", "Ruhango",
].filter((v, i, a) => a.indexOf(v) === i).sort();

export const PROPERTY_TYPES = ["house", "land", "apartment", "villa", "commercial"] as const;
export const PROPERTY_CONDITIONS = ["for-sale", "for-rent"] as const;
export const PROPERTY_STATUSES = ["pending", "active", "sold", "inactive"] as const;
export const AMENITIES = [
  "Water Supply", "Electricity", "Garden", "Parking", "Security",
  "Air Conditioning", "Swimming Pool", "Gym", "Elevator", "Balcony",
  "Internet", "Solar Power", "Backup Generator", "CCTV",
];
