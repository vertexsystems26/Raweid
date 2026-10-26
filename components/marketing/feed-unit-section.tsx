"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Truck, ShieldCheck, Scale, Loader2 } from "lucide-react";
import {
  getProducts,
  type ProductRecord,
  type ProductTargetAnimal,
} from "@/lib/firebase-service";

const FILTERS: Array<{ id: ProductTargetAnimal | "all"; label: string }> = [
  { id: "all", label: "Tous les produits" },
  { id: "Bovins", label: "Bovins" },
  { id: "Vaches laitières", label: "Vaches laitières" },
  { id: "Ovins", label: "Ovins" },
  { id: "Caprins", label: "Caprins" },
];

export function FeedUnitSection() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ProductTargetAnimal | "all">("all");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.targetAnimal === filter)),
    [products, filter]
  );

  return (
    <section id="aliments" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1B4D3E] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C49A45]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-wider text-[#C49A45] bg-white/10 px-3.5 py-1.5 rounded-full">
              Production Industrielle à Siliana
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 leading-tight">
              Unité de Fabrication d&apos;Aliments Composés pour Bétail
            </h2>
            <p className="mt-3 text-stone-200 text-sm sm:text-base leading-relaxed">
              Formulés sous la supervision directe de <strong>Mme Lamia Ben Ammar</strong>, nos aliments composés répondent aux exigences nutritionnelles spécifiques du cheptel tunisien et réduisent la dépendance aux compléments importés coûteux.
            </p>
          </div>

          <div className="relative flex flex-wrap gap-2 mt-8">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                  filter === f.id
                    ? "bg-[#C49A45] text-white shadow-md"
                    : "bg-white/10 text-stone-200 hover:bg-white/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16 relative">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="relative text-center text-stone-300 text-sm py-16">
              Aucun produit disponible pour cette catégorie.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#C49A45] bg-black/20 px-2.5 py-1 rounded-md">
                        {product.targetAnimal}
                      </span>
                      {!product.isAvailable && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-100 bg-red-900/50 px-2.5 py-1 rounded-md">
                          Rupture de stock
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-3 leading-snug">
                      {product.name}
                    </h3>

                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-stone-200">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-300">Valeur nutritionnelle :</span>
                        <strong className="text-white text-right">{product.nutritionalInfo}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-300">Conditionnement :</span>
                        <strong className="text-white">{product.packaging}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <a
                      href="#inscription"
                      className={`block text-center w-full py-2 text-xs font-bold rounded-lg transition ${
                        product.isAvailable
                          ? "bg-[#C49A45] hover:bg-[#b08738] text-white"
                          : "bg-white/10 text-stone-400 pointer-events-none"
                      }`}
                    >
                      {product.isAvailable ? "Commander ce produit" : "Indisponible"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-200 relative">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#C49A45] shrink-0" />
              <span>Livraison directe sur exploitation dans tout le gouvernorat de Siliana, Béja et Nord-Ouest.</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C49A45] shrink-0" />
              <span>Analyses physico-chimiques et contrôle qualité rigoureux à chaque lot.</span>
            </div>
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-[#C49A45] shrink-0" />
              <span>Possibilité de formulation sur mesure selon vos fourrages disponibles.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
