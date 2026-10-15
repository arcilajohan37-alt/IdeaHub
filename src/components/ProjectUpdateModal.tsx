"use client";

import { useState } from "react";
import { createUpdateAction } from "@/lib/actions/project";
import { Sparkles, X, Send, AlertCircle, CheckCircle2 } from "lucide-react";

interface ProjectUpdateModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectUpdateModal({
  projectId,
  isOpen,
  onClose,
}: ProjectUpdateModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [links, setLinks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("links", links);

    const res = await createUpdateAction(projectId, null, formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(res.success);
      setTimeout(() => {
        onClose();
        setTitle("");
        setContent("");
        setLinks("");
        setSuccess(null);
      }, 1500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Publicar Novedad</h2>
            <p className="text-xs text-slate-400">Informa a tu comunidad sobre los avances del proyecto</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Título de la Novedad
            </label>
            <input
              type="text"
              required
              placeholder="ej. ¡Llegamos al primer prototipo o firma de alianza!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Detalles / Contenido
            </label>
            <textarea
              required
              rows={4}
              placeholder="Cuéntale a tus colaboradores y apoyadores qué logros has alcanzado y cuáles son los siguientes pasos..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Enlaces Relevantes (opcional, uno por línea)
            </label>
            <textarea
              rows={2}
              placeholder="https://mi-demo.com&#10;https://github.com/mi-repo"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-2xl text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Publicando..." : "Publicar Novedad"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
