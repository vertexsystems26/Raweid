"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  GraduationCap,
  TrendingUp,
  Factory,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { getServices, type ServiceRecord } from "@/lib/firebase-service";
import { Pagination } from "@/components/ui/pagination";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  GraduationCap,
  TrendingUp,
  Factory,
};

const PAGE_SIZE = 4;

export function ServicesSection() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getServices()
      .then(setServices)
      .finally(() => setIsLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return services.slice(start, start + PAGE_SIZE);
  }, [services, page]);

  return (
    <section id="services" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C49A45] bg-[#C49A45]/10 px-3.5 py-1.5 rounded-full">
            Notre Cœur de Métier
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4D3E] mt-3">
            Les Piliers d&apos;Activités de RAWeiD Service
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Une chaîne de valeur intégrée pour maximiser la productivité agricole, de la formulation nutritionnelle au financement de projets.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#1B4D3E] animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-stone-400 text-sm py-16">
            Aucun service publié pour le moment.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pageItems.map((service) => {
                const Icon = ICONS[service.iconName] || Stethoscope;
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#1B4D3E]/10 text-[#1B4D3E] flex items-center justify-center group-hover:bg-[#1B4D3E] group-hover:text-white transition-colors">
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-[#1B4D3E]">
                          {service.category}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-stone-900 group-hover:text-[#1B4D3E] transition-colors">
                        {service.title}
                      </h3>

                      <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
                      <a
                        href="#inscription"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:text-[#C49A45] transition-colors"
                      >
                        <span>Demander ce service</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </section>
  );
}
