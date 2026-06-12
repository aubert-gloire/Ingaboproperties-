"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Landmark, Home, Building, Layers,
  Clipboard, Calendar, BookOpen, Users, Activity, Settings,
  Briefcase, Shield, Wrench, Menu, X, ChevronDown, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  superadminOnly?: boolean;
  children?: NavItem[];
};

type NavSection = {
  section: string;
  superadminOnly?: boolean;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    section: "OVERVIEW",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    section: "PROPERTY MANAGEMENT",
    items: [
      {
        href: "/admin/properties",
        icon: Building2,
        label: "Properties",
        children: [
          { href: "/admin/properties/land", icon: Landmark, label: "Land" },
          { href: "/admin/properties/houses", icon: Home, label: "Houses" },
          { href: "/admin/properties/apartments", icon: Building, label: "Apartments" },
          { href: "/admin/properties/villas", icon: Layers, label: "Villas" },
          { href: "/admin/properties/commercial", icon: Briefcase, label: "Commercial" },
        ],
      },
    ],
  },
  {
    section: "SUBMISSIONS",
    items: [
      { href: "/admin/submissions", icon: Clipboard, label: "Submissions" },
      { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
    ],
  },
  {
    section: "CONTENT",
    items: [
      { href: "/admin/blog", icon: BookOpen, label: "Blog Management" },
    ],
  },
  {
    section: "SERVICES",
    items: [
      { href: "/admin/services", icon: Wrench, label: "Services" },
    ],
  },
  {
    section: "ADMINISTRATION",
    superadminOnly: true,
    items: [
      { href: "/admin/users", icon: Users, label: "Users" },
      { href: "/admin/roles", icon: Shield, label: "Roles" },
      { href: "/admin/departments", icon: Briefcase, label: "Departments" },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { href: "/admin/activity-logs", icon: Activity, label: "Activity Logs" },
      { href: "/admin/settings", icon: Settings, label: "Settings", superadminOnly: true },
    ],
  },
];

export default function Sidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["/admin/properties"]);
  const isSuperadmin = userRole === "superadmin";

  const isActive = (href: string) => pathname === href || (href !== "/admin" && pathname.startsWith(href));
  const toggleExpand = (href: string) => {
    setExpandedItems((e) => e.includes(href) ? e.filter((x) => x !== href) : [...e, href]);
  };

  return (
    <aside className={cn(
      "flex flex-col bg-forest-900 text-paper transition-all duration-300 min-h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-forest-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded-md flex items-center justify-center">
              <span className="text-forest-900 text-xs font-bold">IP</span>
            </div>
            <span className="font-heading font-bold text-paper text-sm">Ingabo Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-forest-800 transition-colors ml-auto"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {NAV.map(({ section, superadminOnly, items }) => {
          if (superadminOnly && !isSuperadmin) return null;

          const visibleItems = items.filter((item) => !item.superadminOnly || isSuperadmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={section}>
              {!collapsed && (
                <p className="px-4 text-[10px] font-semibold tracking-widest text-paper/30 uppercase mb-1 mt-3">
                  {section}
                </p>
              )}
              {visibleItems.map((item) => {
                const isExpanded = expandedItems.includes(item.href);
                const hasChildren = Array.isArray(item.children);
                const active = isActive(item.href);

                return (
                  <div key={item.href}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.href)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                            active ? "bg-forest-800 text-paper" : "text-paper/60 hover:text-paper hover:bg-forest-800"
                          )}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </>
                          )}
                        </button>
                        {isExpanded && !collapsed && item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 pl-10 pr-4 py-2 text-sm transition-colors",
                              isActive(child.href)
                                ? "text-gold-400 bg-forest-800/60"
                                : "text-paper/50 hover:text-paper hover:bg-forest-800/40"
                            )}
                          >
                            <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                            {child.label}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-forest-800 text-paper border-r-2 border-gold-500"
                            : "text-paper/60 hover:text-paper hover:bg-forest-800"
                        )}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-forest-800">
          <Link href="/" target="_blank" className="text-xs text-paper/40 hover:text-paper/70 transition-colors">
            ← View Site
          </Link>
        </div>
      )}
    </aside>
  );
}
