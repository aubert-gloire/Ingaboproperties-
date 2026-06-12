import { Building2 } from "lucide-react";

const DEVELOPMENTS = [
  {
    name: "Kigali Heights Residences",
    location: "Gasabo, Kigali",
    status: "ongoing",
    description: "A premium residential development featuring modern apartments with panoramic city views.",
    image: "/placeholder-dev.jpg",
  },
  {
    name: "Green Valley Estate",
    location: "Bugesera District",
    status: "coming-soon",
    description: "An eco-friendly residential estate with single-family homes surrounded by nature.",
    image: "/placeholder-dev.jpg",
  },
];

const STATUS_COLORS: Record<string, string> = {
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  "coming-soon": "bg-gold-100 text-gold-700",
};

export default function DevelopmentsPage() {
  return (
    <div className="min-h-screen bg-paper pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm font-medium uppercase tracking-widest mb-2">Projects</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest-900 mb-2">Developments</h1>
          <p className="text-muted-fg">Our ongoing and upcoming real estate development projects in Rwanda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEVELOPMENTS.map((dev) => (
            <div key={dev.name} className="bg-paper-2 rounded-2xl overflow-hidden border border-border hover:border-forest-500 hover:shadow-md transition-all">
              <div className="relative h-56 bg-forest-100 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-forest-300" />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${STATUS_COLORS[dev.status] || "bg-gray-100 text-gray-700"}`}>
                  {dev.status.replace("-", " ")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-forest-900 text-xl mb-1">{dev.name}</h3>
                <p className="text-muted-fg text-sm mb-3">{dev.location}</p>
                <p className="text-muted-fg text-sm leading-relaxed">{dev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
