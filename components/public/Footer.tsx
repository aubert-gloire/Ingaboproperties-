import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaYoutube, FaLinkedin, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-forest-900 text-paper/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Ingabo Properties"
                width={160}
                height={64}
                className="h-28 w-auto object-contain brightness-0 invert scale-125 origin-left"
              />
            </div>
            <p className="text-sm text-paper/60 leading-relaxed mb-5">{t("tagline")}</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/ingaboproperties/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-forest-800 rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="https://wa.me/250788812776"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-forest-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-sm" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-forest-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-forest-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-sm" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-forest-800 rounded-full flex items-center justify-center hover:bg-forest-600 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-semibold text-paper text-sm uppercase tracking-wider mb-4">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: tNav("about") },
                { href: "/properties", label: tNav("properties") },
                { href: "/developments", label: tNav("developments") },
                { href: "/blog", label: tNav("blog") },
                { href: "/contact", label: tNav("contact") },
                { href: "/list-with-us", label: tNav("listWithUs") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/60 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h3 className="font-heading font-semibold text-paper text-sm uppercase tracking-wider mb-4">
              {t("propertyTypes")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/properties?type=house", label: t("houses") },
                { href: "/properties?type=apartment", label: t("apartments") },
                { href: "/properties?type=land", label: t("land") },
                { href: "/properties?type=villa", label: t("villas") },
                { href: "/properties?type=commercial", label: t("commercial") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/60 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-paper text-sm uppercase tracking-wider mb-4">
              {t("contactUs")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-paper/60">KG 11 Ave, Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <a
                  href="tel:+250788812776"
                  className="text-sm text-paper/60 hover:text-gold-400 transition-colors"
                >
                  +250 788 812 776
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <a
                  href="mailto:ingaboproperties@gmail.com"
                  className="text-sm text-paper/60 hover:text-gold-400 transition-colors"
                >
                  ingaboproperties@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaWhatsapp className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a
                  href="https://wa.me/250788812776"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-paper/60 hover:text-gold-400 transition-colors"
                >
                  +250 788 812 776
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} Ingabo Properties. {t("allRightsReserved")}.
          </p>
          <p className="text-xs text-paper/40">Built with ❤ for Rwanda</p>
        </div>
      </div>
    </footer>
  );
}
