"use client";

import { useState } from "react";
import { deleteUpdateAction } from "@/lib/actions/project";
import { Sparkles, ExternalLink, Calendar, Trash2 } from "lucide-react";

interface LinkItem {
  label?: string;
  url: string;
}

interface UpdateItem {
  id: string;
  projectId: string;
  title: string;
  content: string;
  links?: LinkItem[] | null;
  createdAt: Date | string;
}

interface ProjectUpdateListProps {
  updates: UpdateItem[];
  projectId: string;
  isProjectOwner: boolean;
}

export default function ProjectUpdateList({
  updates,
  projectId,
  isProjectOwner,
}: ProjectUpdateListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(updateId: string) {
    if (!confirm("¿Seguro que deseas eliminar esta novedad?")) return;
    setDeletingId(updateId);
    await deleteUpdateAction(updateId, projectId);
    setDeletingId(null);
  }

  if (updates.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center">
        <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">Aún no hay publicaciones</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          {isProjectOwner
            ? "Publica la primera actualización para mantener informados a tus colaboradores."
            : "El creador publicará novedades sobre los avances del proyecto aquí."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-800 pl-6 space-y-8 my-4 ml-3">
      {updates.map((item) => {
        const formattedDate = new Date(item.createdAt).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-400 group-hover:bg-emerald-400 transition-colors" />

            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="capitalize">{formattedDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>

                {isProjectOwner && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    title="Eliminar publicación"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                {item.content}
              </p>

              {item.links && item.links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                  {item.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-medium transition-colors border border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{link.label || link.url}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
