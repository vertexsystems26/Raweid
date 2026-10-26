"use client";

import React, { useEffect, useState } from "react";
import { getCandidates, type CandidateRecord } from "@/lib/firebase-service";
import { CandidatesTable } from "@/components/admin/candidates-table";
import { Loader2 } from "lucide-react";

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#1B4D3E] animate-spin" />
      </div>
    );
  }

  const total = candidates.length;
  const newCount = candidates.filter((c) => c.status === "NEW").length;
  const contactedCount = candidates.filter((c) => c.status === "CONTACTED").length;
  const confirmedCount = candidates.filter((c) => c.status === "CONFIRMED").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E]">
          Gestion des Candidats & Prospects
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1">
          Suivi des demandes d&apos;inscription aux formations, demandes de devis et commandes de provendes (Siliana).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-semibold text-stone-500">Total Demandes</span>
            <p className="text-2xl font-black text-stone-900 mt-1">{total}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/30">
            <span className="text-xs font-semibold text-amber-700">À Traiter (Nouveaux)</span>
            <p className="text-2xl font-black text-amber-900 mt-1">{newCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm bg-blue-50/30">
            <span className="text-xs font-semibold text-blue-700">Contactés</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{contactedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/30">
            <span className="text-xs font-semibold text-emerald-700">Confirmés</span>
            <p className="text-2xl font-black text-emerald-900 mt-1">{confirmedCount}</p>
          </div>
        </div>
      </div>

      <CandidatesTable initialCandidates={candidates} />
    </div>
  );
}
