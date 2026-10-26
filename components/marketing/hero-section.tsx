import React from "react";
import Link from "next/link";
import { ArrowRight, Award, ShieldCheck, Sprout, Users, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 gradient-raweid-hero text-white">
      {/* Motifs de fond décoratifs */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C49A45_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C49A45]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#2E8B57]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Colonne texte principale */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C49A45] text-xs sm:text-sm font-semibold tracking-wide">
              <Sprout className="w-4 h-4 text-[#C49A45]" />
              <span>Slogan officiel : &ldquo;let&apos;s cultivate the future together&rdquo;</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Expertise Agronomique, <span className="text-[#C49A45]">Formations Pratiques</span> & Nutrition Animale
            </h1>

            <p className="text-stone-200 text-base sm:text-lg leading-relaxed max-w-2xl">
              Sous la direction de <strong>M. Raed Chaabeni</strong> (Ingénieur Agronome, spécialiste en élevage et nutrition animale), <strong>RAWeiD Service</strong> accompagne les éleveurs, investisseurs et industriels vers l&apos;excellence et la rentabilité durable.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#inscription"
                className="px-7 py-3.5 bg-[#C49A45] hover:bg-[#b08738] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>S&apos;inscrire à une formation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all"
              >
                Découvrir nos 4 Piliers
              </a>
            </div>

            {/* Statistiques & gages de confiance */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#C49A45]">4 Pôles</p>
                <p className="text-xs text-stone-300 mt-0.5">D&apos;activités intégrées</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">Siliana</p>
                <p className="text-xs text-stone-300 mt-0.5">Unité industrielle d&apos;aliments</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#C49A45]">Menzah 9</p>
                <p className="text-xs text-stone-300 mt-0.5">Centre de formation (Tunis)</p>
              </div>
            </div>
          </div>

          {/* Carte mise en avant Mme Lamia Ben Ammar */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C49A45] to-[#f4d284] flex items-center justify-center text-[#1B4D3E] font-black text-2xl shadow-md shrink-0">
                  RC
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">M. Raed Chaabeni</h3>
                  <p className="text-[#C49A45] text-xs sm:text-sm font-semibold">
                    Fondateur & Directeur Générale
                  </p>
                  <p className="text-stone-300 text-xs">
                    Ingénieur Agronome Spécialisé en Nutrition Animale
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-stone-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C49A45] mt-1 shrink-0" />
                  <span>Études technico-économiques & business plans agricoles bancables.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C49A45] mt-1 shrink-0" />
                  <span>Conduite d&apos;élevage rigoureuse : bovin laitier, engraissement ovin & caprin.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C49A45] mt-1 shrink-0" />
                  <span>Formulation d&apos;aliments composés à haute valeur nutritionnelle (Siliana).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C49A45] mt-1 shrink-0" />
                  <span>Innovation fourragère : hydroponie et micro-pousses à haut rendement.</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between text-xs text-stone-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C49A45]" /> Agrément & Expertise
                </span>
                <span className="font-semibold text-white">RAWeiD SERVICE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
