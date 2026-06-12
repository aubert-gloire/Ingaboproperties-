import { Building2, Users, Award, Target } from "lucide-react";
import StatsSection from "@/components/public/StatsSection";

const TEAM = [
  { name: "Ingabo Team", role: "Real Estate Experts", bio: "Dedicated professionals serving Rwanda's real estate market." },
];

const VALUES = [
  { icon: Target, title: "Our Mission", desc: "To make premium real estate accessible and transparent for every Rwandan." },
  { icon: Users, title: "Client First", desc: "We put our clients' needs at the center of everything we do." },
  { icon: Award, title: "Excellence", desc: "Committed to the highest standards in property management and service." },
  { icon: Building2, title: "Rwanda Experts", desc: "Deep local knowledge of every district, sector, and neighborhood." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper pt-20">
      {/* Hero */}
      <section className="bg-forest-900 py-20 sm:py-28 text-center px-4">
        <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-3">About Us</p>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-paper max-w-3xl mx-auto leading-tight mb-5">
          Your Trusted Partner in Rwanda Real Estate
        </h1>
        <p className="text-paper/60 text-lg max-w-2xl mx-auto">
          Ingabo Properties connects buyers, sellers, and renters with verified real estate listings across all districts of Rwanda.
        </p>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold-600 text-sm font-medium uppercase tracking-widest mb-3">Our Story</p>
              <h2 className="font-heading text-3xl font-bold text-forest-900 mb-5">
                Building Rwanda's Real Estate Future
              </h2>
              <div className="space-y-4 text-muted-fg leading-relaxed">
                <p>
                  Ingabo Properties was founded with a clear vision: to create a trustworthy, transparent real estate platform built specifically for Rwanda's growing property market.
                </p>
                <p>
                  We understand the unique challenges of finding quality properties in Kigali and across Rwanda's 30 districts. Our team of local experts brings deep knowledge and a personal touch to every transaction.
                </p>
                <p>
                  From apartments in Gasabo to land in Bugesera, from commercial spaces in Nyarugenge to villas in Kicukiro — we've helped hundreds of Rwandans find their perfect property.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-paper-2 rounded-2xl p-5 border border-border">
                  <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-forest-500" />
                  </div>
                  <h3 className="font-heading font-semibold text-forest-900 text-sm mb-1">{title}</h3>
                  <p className="text-muted-fg text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Team */}
      <section className="py-16 sm:py-20 bg-paper-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold-600 text-sm font-medium uppercase tracking-widest mb-2">The Team</p>
            <h2 className="font-heading text-3xl font-bold text-forest-900">Meet Our Experts</h2>
          </div>
          <div className="flex justify-center">
            <div className="bg-paper-2 rounded-2xl p-6 border border-border text-center max-w-xs">
              <div className="w-16 h-16 bg-forest-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-forest-500" />
              </div>
              <h3 className="font-heading font-semibold text-forest-900">Ingabo Properties Team</h3>
              <p className="text-gold-600 text-xs mb-2">Real Estate Professionals</p>
              <p className="text-muted-fg text-sm">Dedicated to serving Rwanda's real estate market with professionalism and integrity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
