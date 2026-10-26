"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2, X, ExternalLink } from "lucide-react";
import {
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  type VideoRecord,
} from "@/lib/firebase-service";

const emptyForm = {
  title: "",
  category: "Visite d'exploitation",
  videoUrl: "",
  thumbnailUrl: "",
  description: "",
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const loadVideos = () => {
    setIsLoading(true);
    getVideos()
      .then(setVideos)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (video: VideoRecord) => {
    setEditingId(video.id);
    setForm({
      title: video.title,
      category: video.category,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      description: video.description,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...form, thumbnailUrl: form.thumbnailUrl || null };
      if (editingId) {
        await updateVideo(editingId, payload);
      } else {
        await addVideo(payload);
      }
      setShowModal(false);
      loadVideos();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette vidéo ?")) return;
    await deleteVideo(id);
    loadVideos();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E]">
            Médiathèque Vidéos
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Réalisations, visites terrain et témoignages affichés sur le site vitrine.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C49A45]" />
          Ajouter une capsule vidéo
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#1B4D3E] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-5">
                <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-[#1B4D3E]">
                  {vid.category}
                </span>
                <h3 className="font-bold text-stone-900 mt-3 text-sm leading-snug line-clamp-2">
                  {vid.title}
                </h3>
                <p className="text-stone-600 text-xs mt-2 line-clamp-3">
                  {vid.description}
                </p>
              </div>
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={vid.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#1B4D3E] font-bold hover:underline flex items-center gap-1"
                >
                  Voir la vidéo <ExternalLink className="w-3 h-3" />
                </a>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(vid)}
                    className="p-1.5 text-[#1B4D3E] hover:bg-stone-200 rounded-lg transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <p className="text-stone-400 text-sm col-span-3 py-8 text-center">
              Aucune vidéo publiée pour le moment.
            </p>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-extrabold text-[#1B4D3E]">
                {editingId ? "Modifier la Vidéo" : "Ajouter une Réalisation Vidéo"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Titre de la vidéo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Témoignage éleveur ovin à Béja"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Catégorie
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                >
                  <option value="Visite d'exploitation">Visite d&apos;exploitation</option>
                  <option value="Témoignage éleveur">Témoignage éleveur / promoteur</option>
                  <option value="Unité Siliana">Unité de Siliana (Aliments)</option>
                  <option value="Session Pratique">Session Pratique / Formation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  URL de la vidéo (YouTube, Vimeo, MP4) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  URL de la miniature (thumbnail)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Description courte
                </label>
                <textarea
                  rows={3}
                  placeholder="Contexte agronomique ou détails de l'intervention..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

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
                  {editingId ? "Enregistrer" : "Publier la vidéo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
