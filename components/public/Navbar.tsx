"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent dark mode only on the home page (hero covers full viewport)
  const pathSegments = pathname.split("/").filter(Boolean);
  const isHomePage = pathSegments.length <= 1; // e.g. "/en" or "/"
  const transparent = isHomePage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent"
          : "bg-paper/98 backdrop-blur-md border-b border-border/60 shadow-[0_1px_20px_rgba(10,31,21,0.06)]"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-18 lg:h-22" style={{ height: transparent ? "5.5rem" : "4.5rem", transition: "height 0.4s ease" }}>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Ingabo Properties"
              width={130}
              height={52}
              className={cn(
                "h-20 w-auto object-contain transition-all duration-300",
                transparent ? "brightness-0 invert" : "brightness-0"
              )}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-300",
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:transition-transform after:duration-300 after:origin-left",
                    transparent
                      ? active
                        ? "text-gold-400 after:bg-gold-400 after:scale-x-100"
                        : "text-paper/70 hover:text-paper after:bg-paper/60 after:scale-x-0 hover:after:scale-x-100"
                      : active
                        ? "text-forest-900 after:bg-gold-500 after:scale-x-100"
                        : "text-forest-900/50 hover:text-forest-900 after:bg-forest-900 after:scale-x-0 hover:after:scale-x-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-5">
            <LanguageSwitcher />
            <a
              href="https://wa.me/250788812776"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 text-[12px] tracking-wide transition-colors duration-300",
                transparent ? "text-paper/60 hover:text-paper" : "text-forest-900/60 hover:text-forest-900"
              )}
            >
              <FaWhatsapp className="text-[#25D366] text-base" />
              <span className="hidden xl:block">+250 788 812 776</span>
            </a>
            <Link
              href="/book-appointment"
              className={cn(
                "px-5 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase transition-all duration-300 border",
                transparent
                  ? "bg-transparent text-paper border-paper/50 hover:bg-paper hover:text-forest-900"
                  : "bg-forest-900 text-paper border-forest-900 hover:bg-forest-800"
              )}
            >
              {t("bookAppointment")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "lg:hidden p-2 transition-colors duration-300",
              transparent ? "text-paper" : "text-forest-900"
            )}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-forest-900 border-t border-forest-800">
          <div className="px-6 py-6 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block py-3 text-[12px] font-medium tracking-[0.1em] uppercase border-b border-forest-800/60 transition-colors",
                  isActive(link.href)
                    ? "text-gold-400"
                    : "text-paper/60 hover:text-paper"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-5 flex items-center justify-between">
              <LanguageSwitcher />
              <a
                href="https://wa.me/250788812776"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[12px] text-paper/60"
              >
                <FaWhatsapp className="text-[#25D366] text-base" />
                <span>+250 788 812 776</span>
              </a>
            </div>
            <Link
              href="/book-appointment"
              onClick={() => setOpen(false)}
              className="block w-full mt-4 px-4 py-3 bg-gold-500 text-forest-900 text-[11px] font-semibold tracking-[0.12em] uppercase text-center hover:bg-gold-400 transition-colors"
            >
              {t("bookAppointment")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
