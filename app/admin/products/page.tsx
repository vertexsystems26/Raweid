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
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
  type ProductRecord,
  type ProductTargetAnimal,
} from "@/lib/firebase-service";

const TARGET_ANIMALS: ProductTargetAnimal[] = ["Bovins", "Vaches laitières", "Ovins", "Caprins"];

const emptyForm = {
  name: "",
  targetAnimal: "Bovins" as ProductTargetAnimal,
  nutritionalInfo: "",
  packaging: "",
  isAvailable: true,
  imageUrl: "" as string,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadProducts = () => {
    setIsLoading(true);
    getProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setSubmitError(null);
    setShowModal(true);
  };

  const openEdit = (product: ProductRecord) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      targetAnimal: product.targetAnimal,
      nutritionalInfo: product.nutritionalInfo,
      packaging: product.packaging,
      isAvailable: product.isAvailable,
      imageUrl: product.imageUrl || "",
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
        imageUrl = await uploadImage(imageFile, "products");
      }

      if (editingId) {
        await updateProduct(editingId, { ...form, imageUrl });
      } else {
        await addProduct({ ...form, imageUrl });
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: ProductRecord) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await deleteProduct(product.id);
    await deleteImage(product.imageUrl);
    loadProducts();
  };

  const toggleAvailability = async (product: ProductRecord) => {
    await updateProduct(product.id, { isAvailable: !product.isAvailable });
    loadProducts();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E]">
            Aliments Bétail (Unité Siliana)
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Catalogue des aliments composés produits et commercialisés par l&apos;unité de Siliana.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C49A45]" />
          Ajouter un produit
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#1B4D3E] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-emerald-100 text-[#1B4D3E]">
                      {product.targetAnimal}
                    </span>
                    <button
                      onClick={() => toggleAvailability(product)}
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full cursor-pointer ${
                        product.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.isAvailable ? "Disponible" : "Rupture"}
                    </button>
                  </div>
                  <h3 className="font-bold text-stone-900 mt-3 text-sm">{product.name}</h3>
                  <p className="text-stone-600 text-xs mt-2">{product.nutritionalInfo}</p>
                  <p className="text-stone-500 text-xs mt-1">{product.packaging}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-2 text-[#1B4D3E] hover:bg-stone-100 rounded-lg transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-stone-400 text-sm col-span-3 py-8 text-center">
              Aucun produit enregistré pour le moment.
            </p>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-extrabold text-[#1B4D3E]">
                {editingId ? "Modifier le Produit" : "Ajouter un Produit"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Cible animale
                </label>
                <select
                  value={form.targetAnimal}
                  onChange={(e) => setForm({ ...form, targetAnimal: e.target.value as ProductTargetAnimal })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                >
                  {TARGET_ANIMALS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Valeur nutritionnelle
                </label>
                <input
                  type="text"
                  placeholder="Ex: 19% MAT - 0.95 UFL/kg"
                  value={form.nutritionalInfo}
                  onChange={(e) => setForm({ ...form, nutritionalInfo: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Conditionnement
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sacs de 50 kg & Vrac"
                  value={form.packaging}
                  onChange={(e) => setForm({ ...form, packaging: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="w-4 h-4"
                />
                Disponible à la commande
              </label>

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
