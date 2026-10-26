"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, Filter, Download, Eye, CheckCircle2, Clock, 
  XCircle, Phone, MapPin, Mail, Plus, UserCheck, UserPlus,
  Loader2, AlertCircle, Sparkles, X
} from "lucide-react";
import {
  type CandidateRecord,
  updateCandidateStatus,
  addCandidateNote,
  createCandidateAdmin,
} from "@/lib/firebase-service";
import { TUNISIAN_GOVERNORATES } from "@/lib/validators/candidate.schema";

interface Props {
  initialCandidates: CandidateRecord[];
}

export function CandidatesTable({ initialCandidates }: Props) {
  const [candidates, setCandidates] = useState<CandidateRecord[]>(initialCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [govFilter, setGovFilter] = useState<string>("ALL");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal d'ajout de candidat
  const initialFormState = {
    fullName: "",
    phone: "",
    email: "",
    governorate: "Siliana" as (typeof TUNISIAN_GOVERNORATES)[number],
    serviceRequested: "TRAINING" as const,
    status: "NEW" as CandidateRecord["status"],
    projectDetails: "",
    initialNote: "",
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Filtrage combiné réactif
  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      const matchSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchGov = govFilter === "ALL" || item.governorate === govFilter;

      return matchSearch && matchStatus && matchGov;
    });
  }, [candidates, searchTerm, statusFilter, govFilter]);

  // Changement de statut optimiste + Server Action
  const handleUpdateStatus = async (id: string, newStatus: CandidateRecord["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await updateCandidateStatus(id, newStatus);
  };

  // Ajout de note interne
  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedCandidate) return;
    setIsUpdating(true);

    try {
      const addedNote = await addCandidateNote(selectedCandidate.id, newNote);
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === selectedCandidate.id
            ? { ...c, notes: [addedNote, ...c.notes] }
            : c
        )
      );

      setSelectedCandidate((prev) =>
        prev ? { ...prev, notes: [addedNote, ...prev.notes] } : null
      );
      setNewNote("");
    } catch {
      // ignore - UI stays in its previous state
    }
    setIsUpdating(false);
  };

  // Soumission du formulaire d'ajout d'un candidat
  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const candidate = await createCandidateAdmin({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || undefined,
        governorate: formData.governorate,
        selectedService: formData.serviceRequested,
        status: formData.status,
        projectDetails: formData.projectDetails || undefined,
        initialNote: formData.initialNote || undefined,
      });

      setCandidates((prev) => [candidate, ...prev]);
      setSubmitSuccess("Candidat enregistré avec succès dans la base de données !");
      setTimeout(() => {
        setShowAddModal(false);
        setSubmitSuccess(null);
        setFormData(initialFormState);
      }, 800);
    } catch {
      setSubmitError("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Nom,Telephone,Email,Gouvernorat,Service,Statut,Date\n";
    const rows = filteredCandidates
      .map(
        (c) =>
          `"${c.fullName}","${c.phone}","${c.email || ""}","${c.governorate}","${c.selectedService}","${c.status}","${c.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `candidats_raweid_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Barre d'outils (Filtres, Recherche, Actions) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 mb-6 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Filter className="w-4 h-4 text-stone-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="NEW">Nouveau</option>
              <option value="CONTACTED">Contacté</option>
              <option value="CONFIRMED">Confirmé</option>
              <option value="COMPLETED">Terminé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <MapPin className="w-4 h-4 text-stone-500" />
            <select
              value={govFilter}
              onChange={(e) => setGovFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer max-w-[140px]"
            >
              <option value="ALL">Tous gouvernorats</option>
              {TUNISIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            title="Exporter en fichier CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#C49A45]" />
            <span>Ajouter un candidat</span>
          </button>
        </div>
      </div>

      {/* Tableau interactif */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-stone-100 text-stone-700 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Candidat</th>
                <th className="px-6 py-4">Coordonnées</th>
                <th className="px-6 py-4">Gouvernorat</th>
                <th className="px-6 py-4">Service Demandé</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400 text-sm">
                    Aucun candidat trouvé pour ces critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-stone-900">{c.fullName}</div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      <div className="font-mono text-xs">{c.phone}</div>
                      {c.email && <div className="text-xs text-stone-400">{c.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        <MapPin className="w-3 h-3 text-[#1B4D3E]" /> {c.governorate}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-800 text-xs">
                      {c.selectedService === "TRAINING" && "Formation Pratique"}
                      {c.selectedService === "INVESTOR_SUPPORT" && "Montage de Projet"}
                      {c.selectedService === "FEED_MANUFACTURING" && "Aliments Bétail (Siliana)"}
                      {c.selectedService === "AGRI_CONSULTING" && "Conseil Élevage"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleUpdateStatus(c.id, e.target.value as CandidateRecord["status"])
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          c.status === "NEW"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : c.status === "CONTACTED"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : c.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-stone-100 text-stone-600 border-stone-300"
                        }`}
                      >
                        <option value="NEW">Nouveau</option>
                        <option value="CONTACTED">Contacté</option>
                        <option value="CONFIRMED">Confirmé</option>
                        <option value="COMPLETED">Terminé</option>
                        <option value="CANCELLED">Annulé</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="p-2 hover:bg-stone-100 text-[#1B4D3E] rounded-lg transition cursor-pointer"
                        title="Ouvrir la fiche"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'Ajout d'un Candidat */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex justify-between items-start pb-4 border-b border-stone-200">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1B4D3E] text-[11px] font-bold uppercase tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#C49A45]" />
                  Base de données Firebase
                </div>
                <h3 className="text-xl font-extrabold text-[#1B4D3E] mt-2">
                  Ajouter un Nouveau Candidat
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enregistrement direct d&apos;un prospect ou candidat dans votre base de données.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notifications retour */}
            {submitSuccess && (
              <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleCreateCandidate} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tarek Belhadj"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 98 456 789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email (Optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="contact@exemple.tn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Gouvernorat *
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        governorate: e.target.value as (typeof TUNISIAN_GOVERNORATES)[number],
                      })
                    }
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                  >
                    {TUNISIAN_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Service Demandé *
                  </label>
                  <select
                    value={formData.serviceRequested}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceRequested: e.target.value as typeof formData.serviceRequested,
                      })
                    }
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] font-medium"
                  >
                    <option value="TRAINING">Formation Pratique</option>
                    <option value="AGRI_CONSULTING">Conseil & Élevage</option>
                    <option value="INVESTOR_SUPPORT">Montage de Projet</option>
                    <option value="FEED_MANUFACTURING">Aliments Bétail (Siliana)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Statut Initial
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as CandidateRecord["status"],
                      })
                    }
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] font-medium"
                  >
                    <option value="NEW">Nouveau</option>
                    <option value="CONTACTED">Contacté</option>
                    <option value="CONFIRMED">Confirmé</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description du projet / Besoin
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Projet bovin laitier à Makthar, besoin d'accompagnement sur le rationnement..."
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Première observation interne (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Contacté par WhatsApp, rendez-vous le 15 du mois."
                  value={formData.initialNote}
                  onChange={(e) => setFormData({ ...formData, initialNote: e.target.value })}
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C49A45]" />
                      <span>Enregistrement en DB...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-[#C49A45]" />
                      <span>Enregistrer dans la base de données</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détails & Notes Internes */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C49A45] bg-[#C49A45]/10 px-2.5 py-1 rounded-full">
                  Fiche Prospect
                </span>
                <h3 className="text-xl font-bold text-[#1B4D3E] mt-2">
                  {selectedCandidate.fullName}
                </h3>
                <p className="text-xs text-stone-400">
                  Enregistré le {new Date(selectedCandidate.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block font-semibold mb-1">Téléphone :</span>
                  <strong className="text-stone-900 font-mono text-sm">{selectedCandidate.phone}</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block font-semibold mb-1">Gouvernorat :</span>
                  <strong className="text-stone-900 font-semibold">{selectedCandidate.governorate}</strong>
                </div>
              </div>

              {selectedCandidate.email && (
                <div className="text-xs text-stone-600 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span>{selectedCandidate.email}</span>
                </div>
              )}

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Description du projet / Besoin :
                </span>
                <p className="text-stone-800 text-xs italic leading-relaxed">
                  {selectedCandidate.projectDetails || "Aucune note complémentaire précisée lors de la soumission."}
                </p>
              </div>

              {/* Notes Internes RAWeiD */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E] mb-2 flex items-center gap-2">
                  <span>Notes Internes Équipe RAWeiD</span>
                  <span className="text-[10px] bg-emerald-100 text-[#1B4D3E] px-2 py-0.5 rounded-full font-bold">
                    {selectedCandidate.notes.length}
                  </span>
                </h4>

                <div className="space-y-2 max-h-36 overflow-y-auto mb-3 pr-1">
                  {selectedCandidate.notes.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">Aucune note interne enregistrée.</p>
                  ) : (
                    selectedCandidate.notes.map((n) => (
                      <div key={n.id} className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 text-xs">
                        <p className="text-stone-800 leading-snug">{n.content}</p>
                        <span className="text-[10px] text-stone-500 mt-1 block">
                          Par <strong>{n.author}</strong> • {n.createdAt}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter une observation ou compte-rendu d'appel..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl hover:bg-[#143B2F] cursor-pointer disabled:opacity-60"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
