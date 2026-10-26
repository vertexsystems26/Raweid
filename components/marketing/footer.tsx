import React from "react";
import Link from "next/link";
import { Sprout, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#102B23] text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Bloc Marque */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C49A45] text-[#1B4D3E] flex items-center justify-center font-black text-xl shadow">
                RW
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                RAWeiD <span className="text-[#C49A45]">SERVICE</span>
              </span>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed">
              Cabinet d&apos;expertise agronomique, formation continue et unité de fabrication d&apos;aliments pour bétail.
            </p>
            <p className="text-[#C49A45] text-xs font-serif italic">
              &ldquo;let&apos;s cultivate the future together&rdquo;
            </p>
          </div>

          {/* Les 4 Piliers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C49A45] mb-4">
              Domaines d&apos;Expertise
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>Conseil & Audit de Conduite d&apos;Élevage</li>
              <li>Formations Pratiques (Bovin, Ovin, Hydroponie)</li>
              <li>Montage de Projets Agricoles & Financement</li>
              <li>Aliments Composés pour Ruminants (Siliana)</li>
            </ul>
          </div>

          {/* Pôles d'Implantation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C49A45] mb-4">
              Implantations
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                <span><strong>Siliana / Makthar :</strong> Siège & Unité Industrielle</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                <span><strong>Tunis :</strong> Centre de formation El Menzah 9</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                <span><strong>Nabeul, Béja, Bizerte :</strong> Formations & Suivi</span>
              </li>
            </ul>
          </div>

          {/* Direction & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C49A45] mb-4">
              Direction Générale
            </h4>
            <p className="text-xs text-stone-300 mb-2">
              <strong>M. Raed Chaabeni</strong><br />
              Ingénieur Agronome Spécialisé
            </p>
            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>Téléphone : +216 98 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>contact@raweid-service.tn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} RAWeiD SERVICE. Tous droits réservés.</p>
          <p>Développé par <a href="https://vertexsystems.tech" target="_blank" rel="noopener noreferrer" className="text-[#C49A45] hover:underline">Vertex Systems</a></p>
          <div className="flex gap-6">
            <Link href="/admin/candidats" className="hover:text-white transition">
              Espace Administrateur
            </Link>
            <Link href="/admin/cms" className="hover:text-white transition">
              CMS Vidéos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
