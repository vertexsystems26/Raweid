import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { FeedUnitSection } from "@/components/marketing/feed-unit-section";
import { VideoGallery } from "@/components/marketing/video-gallery";
import { PolesSection } from "@/components/marketing/poles-section";
import { CandidateRegistrationForm } from "@/components/marketing/candidate-registration-form";
import { Footer } from "@/components/marketing/footer";
import { TrainingSelectionProvider } from "@/components/marketing/training-selection-context";
import { Award, BookOpen, Users2, Leaf } from "lucide-react";

export default function HomePage() {
  return (
    <TrainingSelectionProvider>
    <div className="min-h-screen flex flex-col bg-[#FCFBF9]">
      {/* 1. Header & Navigation */}
      <Navbar />

      {/* 2. Hero Section Principale */}
      <HeroSection />

      {/* Bandeau de réassurance agronomique */}
      <section className="bg-[#143B2F] text-white py-6 border-y border-[#102B23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-[#C49A45] shrink-0" />
            <span className="font-semibold">Agronome Diplômée d&apos;État</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Leaf className="w-5 h-5 text-[#2E8B57] shrink-0" />
            <span className="font-semibold">Nutrition & Formulation Élevage</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C49A45] shrink-0" />
            <span className="font-semibold">Formations Certifiantes</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Users2 className="w-5 h-5 text-[#2E8B57] shrink-0" />
            <span className="font-semibold">+250 Éleveurs & Promoteurs Accompagnés</span>
          </div>
        </div>
      </section>

      {/* 3. Les 4 Domaines d'Expertise */}
      <ServicesSection />

      {/* 4. Unité Industrielle d'Aliments pour Bétail (Siliana) */}
      <FeedUnitSection />

      {/* 5. Médiathèque & Vidéos de Réalisations */}
      <VideoGallery />

      {/* 6. Zone d'Implantation Géographique */}
      <PolesSection />

      {/* 7. Formulaire de Candidature / Inscription */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CandidateRegistrationForm />
        </div>
      </section>

      {/* 8. Footer Institutionnel */}
      <Footer />
    </div>
    </TrainingSelectionProvider>
  );
}
