"use client";

import { useState } from "react";
import { createSupportAction } from "@/lib/actions/project";
import { SupportTypeBadge } from "@/components/ProjectBadges";
import { 
  HeartHandshake, 
  X, 
  DollarSign, 
  Users, 
  Brain, 
  Package, 
  EyeOff, 
  Send,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface SupportFormModalProps {
  projectId: string;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

export default function SupportFormModal({
  projectId,
  projectTitle,
  isOpen,
  onClose,
  isLoggedIn,
}: SupportFormModalProps) {
  const [selectedType, setSelectedType] = useState<"COLLABORATE" | "MENTOR" | "RESOURCE" | "DONATE">("COLLABORATE");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      setError("Debes iniciar sesión para apoyar este proyecto.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("type", selectedType);
    formData.append("message", message);
    if (selectedType === "DONATE" && amount) {
      formData.append("amount", amount);
    }
    formData.append("anonymous", anonymous ? "true" : "false");

    const res = await createSupportAction(projectId, null, formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(res.success);
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setMessage("");
        setAmount("");
      }, 2000);
    }
  }

  const supportTypes = [
    {
      id: "COLLABORATE",
      title: "Colaborar",
      icon: Users,
      desc: "Sumar tus habilidades técnicas o creativas.",
      color: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    },
    {
      id: "MENTOR",
      title: "Mentoría",
      icon: Brain,
      desc: "Ofrecer asesoría de estrategia o industria.",
      color: "border-purple-500/40 bg-purple-500/10 text-purple-400",
    },
    {
      id: "RESOURCE",
      title: "Recurso",
      icon: Package,
      desc: "Espacio, servidores, equipos o licencias.",
      color: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    },
    {
      id: "DONATE",
      title: "Donar (Pledge)",
      icon: DollarSign,
      desc: "Promesa de aportación económica (MVP sin cobro real).",
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Enviar Apoyo Accionable</h2>
            <p className="text-xs text-slate-400 truncate max-w-md">Para: {projectTitle}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Type Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              1. Selecciona el Tipo de Apoyo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {supportTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`p-1.5 rounded-xl border ${type.color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-white mb-0.5">{type.title}</p>
                    <p className="text-[11px] text-slate-400 leading-snug">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount field if DONATE */}
          {selectedType === "DONATE" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-150">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Monto de Promesa (Pledge en USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ej. 50.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                * MVP Nota: Registro simbólico de pledge. Sin cargos a tarjeta de crédito.
              </p>
            </div>
          )}

          {/* Message textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              2. Mensaje para el Creador
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe cómo te gustaría aportar, tu disponibilidad o detalles de tu apoyo..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Anonymous checkbox */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-white">Publicar como Anónimo</p>
                <p className="text-xs text-slate-400">Oculta tu nombre en la lista pública de apoyos.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Enviando..." : "Confirmar Apoyo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
