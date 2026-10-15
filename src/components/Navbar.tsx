"use client";

import Link from "next/link";
import { useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { 
  Lightbulb, 
  PlusCircle, 
  User, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  Search,
  Sparkles
} from "lucide-react";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white group">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl group-hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-500/20">
              <Lightbulb className="w-5 h-5 fill-slate-950 stroke-slate-950" />
            </div>
            <span className="flex items-center gap-1 font-extrabold text-white">
              Idea<span className="text-emerald-400">Hub</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/" 
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Explorar Ideas
            </Link>
            <Link 
              href="/#categorias" 
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Categorías
            </Link>
          </nav>

          {/* Actions & User menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Idea</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800 transition-colors border border-slate-700"
                >
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center ring-1 ring-emerald-500/40">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-200 pr-2 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl py-2 text-slate-200 z-50 divide-y divide-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2">
                      <p className="text-xs text-slate-400">Conectado como</p>
                      <p className="text-sm font-semibold truncate text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-700/60 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                        <span>Mis Proyectos</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-700/60 transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-400" />
                        <span>Mi Perfil</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-slate-700/60 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-3 py-2 rounded-xl transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>Registrarse</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/projects/new"
              className="bg-emerald-500 text-slate-950 p-2 rounded-xl text-sm"
              title="Publicar Idea"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Explorar Ideas
          </Link>
          <Link
            href="/projects/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-base font-medium bg-emerald-500 text-slate-950 rounded-lg"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Publicar Nueva Idea</span>
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="px-3 py-1">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                <span>Mis Proyectos</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                <User className="w-5 h-5 text-emerald-400" />
                <span>Mi Perfil</span>
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-base text-rose-400 hover:bg-slate-800 rounded-lg text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-800"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
