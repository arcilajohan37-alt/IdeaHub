"use client";

import { useActionState } from "react";
import { updateProjectAction } from "@/lib/actions/project";
import Link from "next/link";
import { 
  Edit3, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2,
  Sparkles, 
  Image as ImageIcon,
  MapPin,
  Tag,
  DollarSign
} from "lucide-react";

interface EditProjectFormProps {
  project: {
    id: string;
    title: string;
    summary: string;
    description: string;
    category: string;
    location: string;
    tags?: string[] | null;
    status: string;
    coverImageUrl?: string | null;
    goalAmount?: string | null;
  };
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const updateWithId = updateProjectAction.bind(null, project.id);
  const [state, formAction, pending] = useActionState(updateWithId, null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Detalle del Proyecto</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <Edit3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Editar Proyecto</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Actualiza la información, estado o meta de tu idea para tu comunidad.
            </p>
          </div>
        </div>

        {state?.error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{state.success}</span>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Título del Proyecto *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={project.title}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Categoría Principal *
              </label>
              <select
                name="category"
                required
                defaultValue={project.category}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="tech">⚡ Tecnología & Software</option>
                <option value="business">💼 Negocios & Startups</option>
                <option value="art">🎨 Arte & Creatividad</option>
                <option value="social">🌱 Impacto Social & Sostenibilidad</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Estado Actual *
              </label>
              <select
                name="status"
                required
                defaultValue={project.status}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="idea">💡 En Idea / Concepto</option>
                <option value="building">🛠️ En Construcción / Prototipo</option>
                <option value="running">🚀 En Marcha / Operando</option>
                <option value="done">🎉 Completado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Resumen Corto *
            </label>
            <input
              type="text"
              name="summary"
              required
              maxLength={200}
              defaultValue={project.summary}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Descripción Completa *
            </label>
            <textarea
              name="description"
              required
              rows={6}
              defaultValue={project.description}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Ubicación *
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="location"
                  required
                  defaultValue={project.location}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Etiquetas / Tags (separados por coma)
              </label>
              <div className="relative">
                <Tag className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="tags"
                  defaultValue={project.tags ? project.tags.join(", ") : ""}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                URL de Imagen de Portada
              </label>
              <div className="relative">
                <ImageIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="url"
                  name="coverImageUrl"
                  defaultValue={project.coverImageUrl || ""}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Meta de Financiamiento (USD)
              </label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  name="goalAmount"
                  defaultValue={project.goalAmount || ""}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-4">
            <Link
              href={`/projects/${project.id}`}
              className="px-6 py-3.5 text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{pending ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
