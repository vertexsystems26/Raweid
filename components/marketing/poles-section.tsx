import React from "react";
import { MapPin, Building2, GraduationCap, Factory, Compass } from "lucide-react";

export function PolesSection() {
  const poles = [
    {
      city: "Siliana / Makthar",
      badge: "Siège Social & Usine",
      icon: Factory,
      description: "Siège de l'entreprise et unité industrielle moderne de fabrication d'aliments composés pour ruminants.",
      role: "Production & Direction Générale",
    },
    {
      city: "Tunis - El Menzah 9",
      badge: "Centre de Formation",
      icon: GraduationCap,
      description: "Salles de cours multimédias et ateliers pratiques pour les sessions de formation en élevage et hydroponie.",
      role: "Sessions Théoriques & Masterclasses",
    },
    {
      city: "Nabeul (Partenariat UTAP)",
      badge: "Pôle Cap-Bon",
      icon: Building2,
      description: "Formations régulières et accompagnement des éleveurs bovins et avicoles fermiers en collaboration avec l'UTAP.",
      role: "Formations & Encadrement Terrain",
    },
    {
      city: "Béja & Bizerte",
      badge: "Extension Nord-Ouest",
      icon: Compass,
      description: "Interventions agronomiques directes, suivi des grandes fermes laitières et implantation de projets ovins.",
      role: "Suivi d'Exploitations & Rations",
    },
  ];

  return (
    <section className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C49A45] bg-[#C49A45]/10 px-3.5 py-1.5 rounded-full">
            Ancrage Géographique
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4D3E] mt-3">
            Nos Pôles & Zones d&apos;Intervention
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            De notre berceau à Siliana jusqu&apos;à notre centre de formation à Tunis et nos interventions dans le Nord de la Tunisie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {poles.map((pole, index) => {
            const Icon = pole.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1B4D3E]/10 text-[#1B4D3E] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-[#1B4D3E]">
                      {pole.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C49A45] shrink-0" />
                    {pole.city}
                  </h3>

                  <p className="text-xs font-semibold text-[#1B4D3E] mt-1">
                    {pole.role}
                  </p>

                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {pole.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
