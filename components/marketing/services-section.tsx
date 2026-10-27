"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  GraduationCap,
  TrendingUp,
  Factory,
  ArrowUpRight,
  Loader2,
  Clock,
  Users,
  Info,
  X,
  Tag,
} from "lucide-react";
import { getServices, getCourses, type ServiceRecord, type CourseRecord } from "@/lib/firebase-service";
import { Pagination } from "@/components/ui/pagination";
import { useTrainingSelection } from "@/components/marketing/training-selection-context";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  GraduationCap,
  TrendingUp,
  Factory,
};

const PAGE_SIZE = 4;

export function ServicesSection() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [detailsCourse, setDetailsCourse] = useState<CourseRecord | null>(null);
  const { selectTraining } = useTrainingSelection();

  useEffect(() => {
    Promise.all([getServices(), getCourses()])
      .then(([servicesData, coursesData]) => {
        setServices(servicesData);
        setCourses(coursesData);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const coursesByServiceId = useMemo(() => {
    const map: Record<string, CourseRecord[]> = {};
    for (const course of courses) {
      (map[course.serviceId] ||= []).push(course);
    }
    return map;
  }, [courses]);

  const handleEnroll = (course: CourseRecord) => {
    selectTraining({ courseId: course.id, title: course.title });
    setDetailsCourse(null);
    document.getElementById("inscription")?.scrollIntoView({ behavior: "smooth" });
  };

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
                const serviceCourses =
                  service.category === "Formation" ? coursesByServiceId[service.id] || [] : [];
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

                      {serviceCourses.length > 0 && (
                        <div className="mt-5 space-y-2.5">
                          {serviceCourses.map((course) => (
                            <div
                              key={course.id}
                              className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-stone-900 truncate">{course.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-500">
                                  {course.duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {course.duration}
                                    </span>
                                  )}
                                  {course.targetAudience && (
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3" /> {course.targetAudience}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setDetailsCourse(course)}
                                title="Voir les détails"
                                className="shrink-0 p-2 rounded-xl bg-[#1B4D3E] text-white hover:bg-[#143B2F] transition cursor-pointer"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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

      {detailsCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setDetailsCourse(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 text-stone-500 hover:text-stone-800 hover:bg-white transition cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {detailsCourse.imageUrl && (
              <img
                src={detailsCourse.imageUrl}
                alt={detailsCourse.title}
                className="w-full h-48 object-cover rounded-t-3xl"
              />
            )}

            <div className="p-6 sm:p-8">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  detailsCourse.status === "Ouvert"
                    ? "bg-emerald-100 text-[#1B4D3E]"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {detailsCourse.status}
              </span>

              <h3 className="text-2xl font-extrabold text-[#1B4D3E] mt-3">{detailsCourse.title}</h3>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-500">
                {detailsCourse.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {detailsCourse.duration}
                  </span>
                )}
                {detailsCourse.targetAudience && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> {detailsCourse.targetAudience}
                  </span>
                )}
                {detailsCourse.price && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {detailsCourse.price}
                  </span>
                )}
              </div>

              {detailsCourse.description && (
                <p className="mt-4 text-stone-600 text-sm leading-relaxed">{detailsCourse.description}</p>
              )}

              <button
                type="button"
                onClick={() => handleEnroll(detailsCourse)}
                disabled={detailsCourse.status !== "Ouvert"}
                className="mt-6 w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {detailsCourse.status === "Ouvert" ? "S'inscrire à cette formation" : "Bientôt disponible"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
