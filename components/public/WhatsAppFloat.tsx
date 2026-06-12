"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

export default function WhatsAppFloat() {
  const t = useTranslations("whatsapp");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-white rounded-2xl shadow-xl p-4 w-56 flex flex-col gap-2 border border-border animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-forest-900">{t("chatWithUs")}</p>
            <button
              onClick={() => setExpanded(false)}
              className="text-muted-fg hover:text-forest-900 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-fg">{t("phone")}</p>
          <a
            href="https://wa.me/250788812776"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <FaWhatsapp className="text-base" />
            Open WhatsApp
          </a>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </button>
    </div>
  );
}
