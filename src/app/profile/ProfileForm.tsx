"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/auth";
import Link from "next/link";
import { User, Mail, MapPin, Tag, Image as ImageIcon, ArrowLeft, CheckCircle2, AlertCircle, Save } from "lucide-react";

interface ProfileFormProps {
  profile: {
    id: string;
    email: string;
    name: string;
    bio?: string | null;
    location?: string | null;
    avatarUrl?: string | null;
    skills?: string[] | null;
  };
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfileAction, null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Dashboard</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Editar Perfil de Creador</h1>
            <p className="text-xs text-slate-400">Actualiza tus datos públicos y habilidades</p>
          </div>
        </div>

        {state?.error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{state.success}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Correo Electrónico (no modificable)
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-slate-950/50 border border-slate-800/80 text-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="name"
                required
                defaultValue={profile.name}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Biografía / Resumen
            </label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={profile.bio || ""}
              placeholder="Escribe algo breve sobre tu experiencia o intereses..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Ubicación / Ciudad
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="location"
                defaultValue={profile.location || ""}
                placeholder="ej. Bogotá, Colombia"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Habilidades / Tags (separados por coma)
            </label>
            <div className="relative">
              <Tag className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="skills"
                defaultValue={profile.skills ? profile.skills.join(", ") : ""}
                placeholder="React, TypeScript, Diseño UI, Marketing"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              URL Foto de Perfil / Avatar
            </label>
            <div className="relative">
              <ImageIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                name="avatarUrl"
                defaultValue={profile.avatarUrl || ""}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm text-slate-400 hover:text-white">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{pending ? "Guardando..." : "Guardar Perfil"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
