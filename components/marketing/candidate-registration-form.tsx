"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateSchema,
  type CandidateInput,
  TUNISIAN_GOVERNORATES,
} from "@/lib/validators/candidate.schema";
import { addCandidate } from "@/lib/firebase-service";
import { useTrainingSelection } from "@/components/marketing/training-selection-context";
import { CheckCircle2, AlertCircle, Loader2, Send, Sparkles, GraduationCap, X } from "lucide-react";

export function CandidateRegistrationForm() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { selectedTraining, clearTraining } = useTrainingSelection();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CandidateInput>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      governorate: "Siliana",
      serviceRequested: "TRAINING",
      courseId: "",
      projectDetails: "",
    },
  });

  useEffect(() => {
    if (!selectedTraining) return;
    setValue("serviceRequested", "TRAINING");
    setValue("courseId", selectedTraining.courseId);
    if (!getValues("projectDetails")?.trim()) {
      setValue("projectDetails", `Formation souhaitée : ${selectedTraining.title}`);
    }
  }, [selectedTraining, setValue, getValues]);

  const onSubmit = (values: CandidateInput) => {
    setFeedback(null);
    startTransition(async () => {
      try {
        await addCandidate({
          fullName: values.fullName,
          phone: values.phone,
          email: values.email || null,
          governorate: values.governorate,
          selectedService: values.serviceRequested,
          courseId: values.courseId || null,
          projectDetails: values.projectDetails || null,
        });
        setFeedback({
          type: "success",
          message:
            "Votre demande a été enregistrée avec succès. Notre équipe agronomique vous contactera dans les plus brefs délais.",
        });
        reset();
        clearTraining();
      } catch {
        setFeedback({
          type: "error",
          message: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
        });
      }
    });
  };

  return (
    <div id="inscription" className="bg-white rounded-3xl shadow-xl border border-stone-200/80 p-6 sm:p-10 max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C49A45]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1B4D3E]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
          Inscription & Conseil
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] mt-3">
          Postuler ou Demander un Devis
        </h3>
        <p className="text-stone-600 text-sm mt-1.5 leading-relaxed">
          Accompagnement personnalisé par <strong>Mme Lamia Ben Ammar</strong> (Ingénieure Agronome) et l'équipe RAWeiD Service.
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-start gap-3 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-red-50 border border-red-200 text-red-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 text-red-600 shrink-0" />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {selectedTraining && (
        <div className="mb-6 p-4 rounded-xl bg-[#1B4D3E]/5 border border-[#1B4D3E]/20 flex items-start gap-3">
          <GraduationCap className="w-5 h-5 mt-0.5 text-[#1B4D3E] shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E]">Formation sélectionnée</p>
            <p className="text-sm font-semibold text-stone-800 mt-0.5">{selectedTraining.title}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearTraining();
              setValue("courseId", "");
            }}
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
            title="Retirer la formation sélectionnée"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("courseId")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Nom & Prénom *
            </label>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Ex: Mohamed Ben Salah"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-sm bg-stone-50/50"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Téléphone *
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Ex: 98 123 456"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-sm bg-stone-50/50"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email (Optionnel)
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="contact@exemple.tn"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-sm bg-stone-50/50"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Gouvernorat *
            </label>
            <select
              {...register("governorate")}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-sm bg-white"
            >
              {TUNISIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            {errors.governorate && (
              <p className="text-xs text-red-600 mt-1">{errors.governorate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Service souhaité *
          </label>
          <select
            {...register("serviceRequested")}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-sm bg-white font-medium text-stone-800"
          >
            <option value="TRAINING">Formation Pratique (Élevage, Hydroponie, Nutrition Animale)</option>
            <option value="AGRI_CONSULTING">Conseil & Conduite Technique d'Élevage (Bovin, Ovin, Caprin)</option>
            <option value="INVESTOR_SUPPORT">Accompagnement Investisseurs & Montage de Projets</option>
            <option value="FEED_MANUFACTURING">Achat d'Aliments Composés pour Bétail (Unité Siliana)</option>
          </select>
          {errors.serviceRequested && (
            <p className="text-xs text-red-600 mt-1">{errors.serviceRequested.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Description de votre projet ou besoin
          </label>
          <textarea
            {...register("projectDetails")}
            rows={3}
            placeholder="Ex : Élevage bovin laitier de 25 têtes à Makthar, besoin d'un audit de rationnement et étude technico-économique..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent text-sm resize-none bg-stone-50/50"
          />
          {errors.projectDetails && (
            <p className="text-xs text-red-600 mt-1">{errors.projectDetails.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enregistrement en cours...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#C49A45]" />
              <span>Transmettre ma candidature / Demande</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
