import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, CalendarCheck, Home } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-forest-900"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-forest-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 pt-36">
        <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Home className="w-4 h-4" />
          Rwanda Real Estate
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-paper max-w-4xl mx-auto leading-tight mb-6">
          {t("headline").split(" ").map((word, i) =>
            word === "Rwanda" ? (
              <span key={i} className="text-gold-400"> {word} </span>
            ) : (
              <span key={i}> {word} </span>
            )
          )}
        </h1>

        <p className="text-paper/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("subheadline")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
          >
            {t("viewProperties")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/book-appointment"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-paper/10 hover:bg-paper/20 border border-paper/30 text-paper font-semibold rounded-xl transition-colors backdrop-blur-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            {t("bookAppointment")}
          </Link>
          <Link
            href="/list-with-us"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 font-semibold rounded-xl transition-colors"
          >
            {t("listWithUs")}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-paper/40">
          <div className="w-0.5 h-8 bg-gradient-to-b from-paper/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
