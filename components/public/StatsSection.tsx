"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Users, Award, MapPin } from "lucide-react";

const STATS = [
  { key: "totalProperties", value: 250, icon: Building2, suffix: "+" },
  { key: "happyClients", value: 500, icon: Users, suffix: "+" },
  { key: "yearsExperience", value: 8, icon: Award, suffix: "" },
  { key: "districtsCovered", value: 15, icon: MapPin, suffix: "" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const t = useTranslations("stats");

  return (
    <section className="bg-forest-900 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map(({ key, value, icon: Icon, suffix }) => (
            <div key={key} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-forest-800 rounded-xl mb-4">
                <Icon className="w-6 h-6 text-gold-400" />
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-bold text-paper mb-1">
                <Counter target={value} suffix={suffix} />
              </div>
              <p className="text-paper/60 text-sm">{t(key as any)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
