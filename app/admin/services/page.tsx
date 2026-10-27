"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  X,
  Image as ImageIcon,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import {
  getServices,
  addService,
  updateService,
  deleteService,
  getCoursesByServiceId,
  addCourse,
  updateCourse,
  deleteCourse,
  uploadImage,
  type ServiceRecord,
  type ServiceCategory,
  type CourseRecord,
  type CourseStatus,
} from "@/lib/firebase-service";

const CATEGORIES: ServiceCategory[] = ["Conseil", "Formation", "Accompagnement", "Production"];
const ICON_OPTIONS = ["Stethoscope", "GraduationCap", "TrendingUp", "Factory"];
const COURSE_STATUSES: CourseStatus[] = ["Ouvert", "Bientôt disponible"];

const emptyForm = {
  title: "",
  description: "",
  category: "Conseil" as ServiceCategory,
  iconName: "Stethoscope",
  imageUrl: "" as string,
};

const emptyCourseForm = {
  title: "",
  description: "",
  duration: "",
  targetAudience: "",
  price: "",
  status: "Ouvert" as CourseStatus,
  imageUrl: "" as string,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [coursesService, setCoursesService] = useState<ServiceRecord | null>(null);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [courseSubmitError, setCourseSubmitError] = useState<string | null>(null);

  const loadServices = () => {
    setIsLoading(true);
    getServices()
      .then(setServices)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setSubmitError(null);
    setShowModal(true);
  };

  const openEdit = (service: ServiceRecord) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      category: service.category,
      iconName: service.iconName,
      imageUrl: service.imageUrl || "",
    });
    setImageFile(null);
    setSubmitError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSaving(true);
    try {
      let imageUrl = form.imageUrl || null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "services");
      }

      if (editingId) {
        await updateService(editingId, { ...form, imageUrl });
      } else {
        await addService({ ...form, imageUrl });
      }

      setShowModal(false);
      loadServices();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce service ?")) return;
    await deleteService(id);
    loadServices();
  };

  const openCoursesManager = (service: ServiceRecord) => {
    setCoursesService(service);
    setShowCourseForm(false);
    setEditingCourseId(null);
    setCourseSubmitError(null);
    setIsLoadingCourses(true);
    getCoursesByServiceId(service.id)
      .then(setCourses)
      .finally(() => setIsLoadingCourses(false));
  };

  const closeCoursesManager = () => {
    setCoursesService(null);
    setCourses([]);
    setShowCourseForm(false);
  };

  const openCourseCreate = () => {
    setEditingCourseId(null);
    setCourseForm(emptyCourseForm);
    setCourseImageFile(null);
    setCourseSubmitError(null);
    setShowCourseForm(true);
  };

  const openCourseEdit = (course: CourseRecord) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      description: course.description,
      duration: course.duration,
      targetAudience: course.targetAudience,
      price: course.price,
      status: course.status,
      imageUrl: course.imageUrl || "",
    });
    setCourseImageFile(null);
    setCourseSubmitError(null);
    setShowCourseForm(true);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coursesService) return;
    setCourseSubmitError(null);
    setIsSavingCourse(true);
    try {
      let imageUrl = courseForm.imageUrl || null;
      if (courseImageFile) {
        imageUrl = await uploadImage(courseImageFile, "courses");
      }

      if (editingCourseId) {
        await updateCourse(editingCourseId, { ...courseForm, imageUrl });
      } else {
        await addCourse({ ...courseForm, imageUrl, serviceId: coursesService.id });
      }

      setShowCourseForm(false);
      setCourses(await getCoursesByServiceId(coursesService.id));
    } catch (err) {
      setCourseSubmitError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleCourseDelete = async (id: string) => {
    if (!confirm("Supprimer cette formation ?")) return;
    await deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E]">
            Gestion des Services
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Piliers de conseil, formation et accompagnement affichés sur le site vitrine.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C49A45]" />
          Ajouter un service
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#1B4D3E] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              {service.imageUrl && (
                <img src={service.imageUrl} alt={service.title} className="w-full h-36 object-cover" />
              )}
              <div className="p-6">
                <span className="text-xs font-bold text-[#C49A45] uppercase tracking-wider">
                  {service.category}
                </span>
                <h3 className="text-xl font-bold text-[#1B4D3E] mt-1.5">{service.title}</h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                  {service.category === "Formation" && (
                    <button
                      onClick={() => openCoursesManager(service)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1B4D3E] hover:bg-stone-100 rounded-lg transition cursor-pointer mr-auto"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Formations
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(service)}
                    className="p-2 text-[#1B4D3E] hover:bg-stone-100 rounded-lg transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-stone-400 text-sm col-span-2 py-8 text-center">
              Aucun service enregistré pour le moment.
            </p>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-extrabold text-[#1B4D3E]">
                {editingId ? "Modifier le Service" : "Ajouter un Service"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Catégorie
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Icône
                  </label>
                  <select
                    value={form.iconName}
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-stone-600"
                />
                {form.imageUrl && !imageFile && (
                  <img src={form.imageUrl} alt="" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#1B4D3E] text-white rounded-xl text-xs font-bold hover:bg-[#143B2F] cursor-pointer shadow-md disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Enregistrer" : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {coursesService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#1B4D3E]">Formations</h3>
                <p className="text-xs text-stone-500 mt-0.5">{coursesService.title}</p>
              </div>
              <button onClick={closeCoursesManager} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showCourseForm ? (
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Durée
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 30 heures"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Statut
                    </label>
                    <select
                      value={courseForm.status}
                      onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value as CourseStatus })}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                    >
                      {COURSE_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Public cible
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Promoteurs, Éleveurs"
                      value={courseForm.targetAudience}
                      onChange={(e) => setCourseForm({ ...courseForm, targetAudience: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Prix (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 250 DT"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCourseImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-stone-600"
                  />
                  {courseForm.imageUrl && !courseImageFile && (
                    <img src={courseForm.imageUrl} alt="" className="mt-2 w-full h-24 object-cover rounded-lg" />
                  )}
                </div>

                {courseSubmitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{courseSubmitError}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCourse}
                    className="px-5 py-2 bg-[#1B4D3E] text-white rounded-xl text-xs font-bold hover:bg-[#143B2F] cursor-pointer shadow-md disabled:opacity-60 flex items-center gap-2"
                  >
                    {isSavingCourse && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingCourseId ? "Enregistrer" : "Publier"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <button
                  onClick={openCourseCreate}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm mb-4"
                >
                  <Plus className="w-4 h-4 text-[#C49A45]" />
                  Ajouter une formation
                </button>

                {isLoadingCourses ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 text-[#1B4D3E] animate-spin" />
                  </div>
                ) : courses.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-8">
                    Aucune formation enregistrée pour ce service.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              course.status === "Ouvert"
                                ? "bg-emerald-100 text-[#1B4D3E]"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {course.status}
                          </span>
                          <h4 className="font-bold text-stone-900 mt-1.5 truncate">{course.title}</h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {[course.duration, course.targetAudience].filter(Boolean).join(" • ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openCourseEdit(course)}
                            className="p-2 text-[#1B4D3E] hover:bg-stone-200/60 rounded-lg transition cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCourseDelete(course.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
