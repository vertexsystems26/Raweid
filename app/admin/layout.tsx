"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Users, Video, Briefcase, Package, Home, LogOut } from "lucide-react";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <AdminAuthGuard>{children}</AdminAuthGuard>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
        <header className="bg-[#1B4D3E] text-white border-b border-[#143B2F] sticky top-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#C49A45] text-[#1B4D3E] flex items-center justify-center font-black text-sm">
                  RW
                </div>
                <span className="font-bold tracking-tight text-white group-hover:text-[#C49A45] transition">
                  RAWeiD <span className="text-[#C49A45]">Admin</span>
                </span>
              </Link>

              <span className="hidden sm:inline-block text-xs bg-white/10 px-2.5 py-1 rounded-full text-stone-300">
                Back-Office Direction
              </span>
            </div>

            <nav className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
              <Link
                href="/admin/candidats"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <Users className="w-4 h-4 text-[#C49A45]" />
                <span className="hidden lg:inline">Candidats</span>
              </Link>
              <Link
                href="/admin/services"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <Briefcase className="w-4 h-4 text-[#C49A45]" />
                <span className="hidden lg:inline">Services</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <Package className="w-4 h-4 text-[#C49A45]" />
                <span className="hidden lg:inline">Aliments Siliana</span>
              </Link>
              <Link
                href="/admin/videos"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <Video className="w-4 h-4 text-[#C49A45]" />
                <span className="hidden lg:inline">Vidéos</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-300 hover:text-white transition"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Voir le site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
