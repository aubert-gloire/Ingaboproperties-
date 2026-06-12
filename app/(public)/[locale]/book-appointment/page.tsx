"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarCheck, CheckCircle } from "lucide-react";

export default function BookAppointmentPage() {
  const t = useTranslations("bookAppointment");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", whatsapp: "",
    propertyInterest: "", preferredDate: "", preferredTime: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_APPOINTMENT;
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, preferredDate: new Date(form.preferredDate) }),
      });
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-paper pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-forest-900 mb-2">{t("successTitle")}</h2>
          <p className="text-muted-fg">{t("successMessage")}</p>
        </div>
      </div>
    );
  }

  const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="min-h-screen bg-paper pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-forest-50 rounded-xl mb-4">
            <CalendarCheck className="w-6 h-6 text-forest-500" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900 mb-2">{t("title")}</h1>
          <p className="text-muted-fg">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper-2 rounded-2xl p-6 sm:p-8 border border-border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("fullName")} *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("email")} *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("phone")} *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("whatsapp")}</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-900 mb-1">{t("propertyInterest")}</label>
            <input name="propertyInterest" value={form.propertyInterest} onChange={handleChange}
              placeholder="e.g. 3-bedroom apartment in Gasabo"
              className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("preferredDate")} *</label>
              <input name="preferredDate" type="date" value={form.preferredDate} onChange={handleChange} required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1">{t("preferredTime")} *</label>
              <select name="preferredTime" value={form.preferredTime} onChange={handleChange} required
                className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500">
                <option value="">Select time</option>
                {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-900 mb-1">{t("message")}</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3}
              className="w-full px-3 py-2.5 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-forest-800 hover:bg-forest-700 disabled:opacity-60 text-paper font-semibold rounded-xl transition-colors text-sm">
            {loading ? "Booking..." : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
