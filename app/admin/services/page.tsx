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
} from "lucide-react";
import {
  getServices,
  addService,
  updateService,
  deleteService,
  uploadImage,
  type ServiceRecord,
  type ServiceCategory,
} from "@/lib/firebase-service";

const CATEGORIES: ServiceCategory[] = ["Conseil", "Formation", "Accompagnement", "Production"];
const ICON_OPTIONS = ["Stethoscope", "GraduationCap", "TrendingUp", "Factory"];

const emptyForm = {
  title: "",
  description: "",
  category: "Conseil" as ServiceCategory,
  iconName: "Stethoscope",
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
    </div>
  );
}
