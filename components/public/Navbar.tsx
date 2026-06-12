"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/properties", label: t("properties") },
    { href: "/developments", label: t("developments") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) => {
    const segments = pathname.split("/").slice(2).join("/") || "/";
    if (href === "/") return segments === "" || segments === "/";
    return pathname.includes(href.slice(1));
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-forest-800 rounded-lg flex items-center justify-center">
              <span className="text-gold-400 font-heading font-bold text-sm">IP</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-forest-900 text-lg leading-none">Ingabo</p>
              <p className="text-muted-fg text-xs tracking-widest uppercase">Properties</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-forest-500 bg-forest-50"
                    : "text-forest-900 hover:text-forest-500 hover:bg-forest-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="https://wa.me/250788812776"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-500 transition-colors"
            >
              <FaWhatsapp className="text-green-500 text-lg" />
              <span className="hidden xl:block">+250 788 812 776</span>
            </a>
            <Link
              href="/book-appointment"
              className="px-4 py-2 bg-forest-800 text-paper text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors"
            >
              {t("bookAppointment")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-forest-900 hover:bg-forest-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-paper border-t border-border shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-forest-500 bg-forest-50"
                    : "text-forest-900 hover:text-forest-500 hover:bg-forest-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-border flex items-center justify-between">
              <LanguageSwitcher />
              <a
                href="https://wa.me/250788812776"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-forest-600"
              >
                <FaWhatsapp className="text-green-500 text-xl" />
                <span>+250 788 812 776</span>
              </a>
            </div>
            <Link
              href="/book-appointment"
              onClick={() => setOpen(false)}
              className="block w-full mt-2 px-4 py-2.5 bg-forest-800 text-paper text-sm font-medium rounded-lg text-center hover:bg-forest-700 transition-colors"
            >
              {t("bookAppointment")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
