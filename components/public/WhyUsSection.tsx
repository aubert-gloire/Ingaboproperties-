import { useTranslations } from "next-intl";
import { ShieldCheck, Star, MapPin, Zap } from "lucide-react";

const FEATURES = [
  { key: "professional", icon: Star },
  { key: "verified", icon: ShieldCheck },
  { key: "rwandaExperts", icon: MapPin },
  { key: "fastProcess", icon: Zap },
];

export default function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <section className="py-16 sm:py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
            {t("title")}
          </h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="bg-paper-2 rounded-2xl p-6 border border-border hover:border-forest-500 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-forest-50 group-hover:bg-forest-800 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-6 h-6 text-forest-500 group-hover:text-gold-400 transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-forest-900 text-base mb-2">
                {t(`${key}` as any)}
              </h3>
              <p className="text-muted-fg text-sm leading-relaxed">
                {t(`${key}Desc` as any)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
