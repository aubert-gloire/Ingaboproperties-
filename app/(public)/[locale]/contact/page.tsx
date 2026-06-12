"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaYoutube, FaLinkedin, FaTiktok } from "react-icons/fa";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT;
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    }
    setLoading(false);
  };

  const SOCIAL = [
    { icon: FaInstagram, label: "Instagram", handle: "@ingaboproperties", href: "https://www.instagram.com/ingaboproperties/", color: "hover:bg-pink-600" },
    { icon: FaWhatsapp, label: "WhatsApp", handle: "+250 788 812 776", href: "https://wa.me/250788812776", color: "hover:bg-green-600" },
    { icon: FaYoutube, label: "YouTube", handle: "Watch Property Tours", href: "#", color: "hover:bg-red-600" },
    { icon: FaLinkedin, label: "LinkedIn", handle: "Ingabo Properties", href: "#", color: "hover:bg-blue-600" },
    { icon: FaTiktok, label: "TikTok", handle: "@ingaboproperties", href: "#", color: "hover:bg-forest-600" },
  ];

  return (
    <div className="min-h-screen bg-paper pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900 mb-2">{t("title")}</h1>
          <p className="text-muted-fg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, label: t("address"), value: t("addressValue") },
              { icon: Phone, label: t("phone"), value: "+250 788 812 776", href: "tel:+250788812776" },
              { icon: Mail, label: t("email"), value: "ingaboproperties@gmail.com", href: "mailto:ingaboproperties@gmail.com" },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-paper-2 rounded-xl p-4 border border-border flex items-start gap-3">
                <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-forest-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-fg mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-forest-900 hover:text-forest-500">{value}</a>
                  ) : (
                    <p className="text-sm font-medium text-forest-900">{value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="bg-paper-2 rounded-xl p-4 border border-border flex items-start gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaWhatsapp className="text-green-500 text-base" />
              </div>
              <div>
                <p className="text-xs text-muted-fg mb-0.5">{t("whatsapp")}</p>
                <a href="https://wa.me/250788812776" target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-forest-900 hover:text-green-600">
                  +250 788 812 776
                </a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <div className="bg-paper-2 rounded-2xl p-6 sm:p-8 border border-border">
              <h2 className="font-heading font-semibold text-xl text-forest-900 mb-5">{t("sendMessage")}</h2>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-forest-900">{t("successTitle")}</p>
                  <p className="text-muted-fg text-sm mt-1">{t("successMessage")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-forest-900 mb-1">{t("yourName")} *</label>
                      <input name="name" value={form.name} onChange={handleChange} required
                        className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-900 mb-1">{t("yourEmail")} *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required
                        className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-900 mb-1">{t("subject")} *</label>
                    <input name="subject" value={form.subject} onChange={handleChange} required
                      className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-900 mb-1">{t("message")} *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-paper font-semibold rounded-xl transition-colors text-sm">
                    {loading ? "Sending..." : t("send")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Social media */}
        <div className="mt-12">
          <h2 className="font-heading font-semibold text-xl text-forest-900 mb-5 text-center">{t("followUs")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SOCIAL.map(({ icon: Icon, label, handle, href, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 bg-paper-2 rounded-xl p-4 border border-border hover:border-forest-500 ${color} hover:text-white group transition-all`}>
                <Icon className="text-2xl text-forest-600 group-hover:text-white transition-colors" />
                <p className="text-xs font-semibold text-forest-900 group-hover:text-white transition-colors">{label}</p>
                <p className="text-xs text-muted-fg group-hover:text-white/80 transition-colors text-center">{handle}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
