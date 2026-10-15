import React from "react";

export function CategoryBadge({ category }: { category: string }) {
  const categories: Record<string, { label: string; color: string }> = {
    tech: { label: "⚡ Tecnología", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
    business: { label: "💼 Negocios", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
    art: { label: "🎨 Arte", color: "bg-pink-500/10 text-pink-400 border-pink-500/30" },
    social: { label: "🌱 Social", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  };

  const current = categories[category] || { label: category, color: "bg-slate-500/10 text-slate-300 border-slate-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.color}`}>
      {current.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statuses: Record<string, { label: string; color: string }> = {
    idea: { label: "💡 En Idea", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    building: { label: "🛠️ En Construcción", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
    running: { label: "🚀 En Marcha", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    done: { label: "🎉 Completado", color: "bg-slate-500/10 text-slate-300 border-slate-600" },
  };

  const current = statuses[status] || { label: status, color: "bg-slate-500/10 text-slate-300 border-slate-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.color}`}>
      {current.label}
    </span>
  );
}

export function SupportTypeBadge({ type }: { type: string }) {
  const types: Record<string, { label: string; icon: string; color: string }> = {
    COLLABORATE: { label: "Colaboración", icon: "🤝", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
    MENTOR: { label: "Mentoría", icon: "🧠", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
    RESOURCE: { label: "Recurso", icon: "📦", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    DONATE: { label: "Donación (Pledge)", icon: "💚", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  };

  const current = types[type] || { label: type, icon: "✨", color: "bg-slate-500/10 text-slate-300 border-slate-700" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.color}`}>
      <span>{current.icon}</span>
      <span>{current.label}</span>
    </span>
  );
}

export function SupportStatusBadge({ status }: { status: string }) {
  const statuses: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
    accepted: { label: "Aceptado", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
    rejected: { label: "Rechazado", color: "bg-rose-500/15 text-rose-300 border-rose-500/40" },
    completed: { label: "Completado", color: "bg-blue-500/15 text-blue-300 border-blue-500/40" },
  };

  const current = statuses[status] || { label: status, color: "bg-slate-500/15 text-slate-300 border-slate-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${current.color}`}>
      {current.label}
    </span>
  );
}
