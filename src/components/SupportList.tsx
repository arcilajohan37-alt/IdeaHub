"use client";

import { useState } from "react";
import { updateSupportStatusAction } from "@/lib/actions/project";
import { SupportTypeBadge, SupportStatusBadge } from "@/components/ProjectBadges";
import { CheckCircle2, XCircle, Clock, ShieldAlert, User, DollarSign, HeartHandshake } from "lucide-react";

interface SupportItem {
  id: string;
  projectId: string;
  userId: string;
  type: string;
  message: string;
  amount?: string | null;
  anonymous: boolean;
  status: string;
  createdAt: Date | string;
  supporter?: {
    name: string;
    avatarUrl?: string | null;
  } | null;
}

interface SupportListProps {
  supports: SupportItem[];
  projectId: string;
  isProjectOwner: boolean;
  currentUserId?: string | null;
}

export default function SupportList({
  supports,
  projectId,
  isProjectOwner,
  currentUserId,
}: SupportListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(supportId: string, newStatus: "accepted" | "rejected" | "completed") {
    setLoadingId(supportId);
    await updateSupportStatusAction(supportId, projectId, newStatus);
    setLoadingId(null);
  }

  if (supports.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center">
        <HeartHandshake className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">Sin apoyos registrados aún</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Sé el primero en impulsar este proyecto ofreciendo tu colaboración, mentoría, recurso o aportación.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {supports.map((item) => {
        const isMySupport = currentUserId && currentUserId === item.userId;
        // Privacy rule: show real supporter name ONLY IF NOT anonymous OR if viewer is owner/supporter
        const isAnonymous = item.anonymous && !isProjectOwner && !isMySupport;
        const displayName = isAnonymous ? "Apoyador Anónimo" : item.supporter?.name || "Usuario de IdeaHub";
        const formattedDate = new Date(item.createdAt).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                {isAnonymous ? (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                ) : item.supporter?.avatarUrl ? (
                  <img
                    src={item.supporter.avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                    {displayName.charAt(0)}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{displayName}</p>
                    {item.anonymous && isProjectOwner && (
                      <span className="text-[10px] bg-slate-800 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                        (Marcado anónimo al público)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <SupportTypeBadge type={item.type} />
                <SupportStatusBadge status={item.status} />
              </div>
            </div>

            {/* Content Message */}
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/50 mb-3">
              "{item.message}"
            </p>

            {/* Donation Pledge Amount */}
            {item.type === "DONATE" && item.amount && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold mb-3">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Pledge Ofrecido: ${Number(item.amount).toLocaleString("es-ES")} USD</span>
              </div>
            )}

            {/* Owner Actions */}
            {isProjectOwner && (
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 font-medium">Gestión del Propietario:</span>
                <div className="flex items-center gap-2">
                  {item.status !== "accepted" && item.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange(item.id, "accepted")}
                      disabled={loadingId === item.id}
                      className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/40 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aceptar</span>
                    </button>
                  )}

                  {item.status === "accepted" && (
                    <button
                      onClick={() => handleStatusChange(item.id, "completed")}
                      disabled={loadingId === item.id}
                      className="flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white font-semibold px-3 py-1.5 rounded-lg border border-blue-500/40 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Marcar Completado</span>
                    </button>
                  )}

                  {item.status !== "rejected" && (
                    <button
                      onClick={() => handleStatusChange(item.id, "rejected")}
                      disabled={loadingId === item.id}
                      className="flex items-center gap-1 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-semibold px-3 py-1.5 rounded-lg border border-rose-500/40 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rechazar</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
