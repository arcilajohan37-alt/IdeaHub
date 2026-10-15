"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryBadge, StatusBadge } from "@/components/ProjectBadges";
import SupportFormModal from "@/components/SupportFormModal";
import SupportList from "@/components/SupportList";
import ProjectUpdateModal from "@/components/ProjectUpdateModal";
import ProjectUpdateList from "@/components/ProjectUpdateList";
import { deleteProjectAction } from "@/lib/actions/project";
import { 
  HeartHandshake, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Edit3, 
  Trash2, 
  User, 
  Share2, 
  DollarSign, 
  PlusCircle, 
  CheckCircle2,
  Tag,
  ArrowLeft
} from "lucide-react";

interface ProjectDetailClientProps {
  project: {
    id: string;
    userId: string;
    title: string;
    summary: string;
    description: string;
    category: string;
    location: string;
    tags: string[];
    status: string;
    coverImageUrl?: string | null;
    goalAmount?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    creator: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string | null;
      bio?: string | null;
      skills?: string[] | null;
    };
  };
  supports: any[];
  updates: any[];
  isProjectOwner: boolean;
  currentUser: { id: string; name: string } | null;
  totalPledged: number;
}

export default function ProjectDetailClient({
  project,
  supports,
  updates,
  isProjectOwner,
  currentUser,
  totalPledged,
}: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState<"details" | "supports" | "updates">("details");
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const formattedDate = new Date(project.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleDeleteProject() {
    if (!confirm("¿Estás seguro de que deseas eliminar este proyecto? Esta acción es irreversible.")) {
      return;
    }
    setIsDeleting(true);
    await deleteProjectAction(project.id);
  }

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  const goalNum = project.goalAmount ? Number(project.goalAmount) : 0;
  const progressPercent = goalNum > 0 ? Math.min(100, Math.round((totalPledged / goalNum) * 100)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Explorar</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-8">
        {/* Cover Image banner */}
        {project.coverImageUrl && (
          <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-slate-950">
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-10 relative">
          {/* Top Badges & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <CategoryBadge category={project.category} />
              <StatusBadge status={project.status} />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3.5 py-2 rounded-xl border border-slate-700 font-semibold transition-colors"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? "¡Copiado!" : "Compartir"}</span>
              </button>

              {isProjectOwner && (
                <>
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs px-3.5 py-2 rounded-xl border border-slate-700 font-semibold transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>

                  <button
                    onClick={handleDeleteProject}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs px-3.5 py-2 rounded-xl border border-rose-500/30 font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {project.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 max-w-4xl">
            {project.summary}
          </p>

          {/* Meta bar: Creator, Location, Date */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2.5">
              {project.creator.avatarUrl ? (
                <img
                  src={project.creator.avatarUrl}
                  alt={project.creator.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  {project.creator.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Creador</p>
                <p className="font-semibold text-slate-200">{project.creator.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ubicación</p>
                <p className="font-medium text-slate-300">{project.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Publicado</p>
                <p className="font-medium text-slate-300">{formattedDate}</p>
              </div>
            </div>

            {/* Support CTA Button */}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setSupportModalOpen(true)}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Apoyar este Proyecto</span>
              </button>
            </div>
          </div>

          {/* Goal Progress Bar if goalAmount set */}
          {goalNum > 0 && (
            <div className="mt-8 p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Pledges Registrados: ${totalPledged.toLocaleString("es-ES")} USD
                </span>
                <span className="text-emerald-400">Meta: ${goalNum.toLocaleString("es-ES")} USD ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "details"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Información del Proyecto
        </button>

        <button
          onClick={() => setActiveTab("supports")}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "supports"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Apoyos Recibidos</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-semibold">
            {supports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("updates")}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "updates"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Novedades & Avances</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-semibold">
            {updates.length}
          </span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8">
          {activeTab === "details" && (
            <div className="space-y-8">
              {/* Description */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-slate-800">
                  Acerca de la Idea
                </h2>
                <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line space-y-4">
                  {project.description}
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Etiquetas de interés</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-medium border border-slate-700/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "supports" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Comunidad de Apoyadores</h2>
                  <p className="text-xs text-slate-400">
                    Personas y mentores que han ofrecido su colaboración o recursos.
                  </p>
                </div>

                <button
                  onClick={() => setSupportModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  + Ofrecer Apoyo
                </button>
              </div>

              <SupportList
                supports={supports}
                projectId={project.id}
                isProjectOwner={isProjectOwner}
                currentUserId={currentUser?.id}
              />
            </div>
          )}

          {activeTab === "updates" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Bitácora del Proyecto</h2>
                  <p className="text-xs text-slate-400">
                    Historial de avances e hitos alcanzados por el creador.
                  </p>
                </div>

                {isProjectOwner && (
                  <button
                    onClick={() => setUpdateModalOpen(true)}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publicar Novedad</span>
                  </button>
                )}
              </div>

              <ProjectUpdateList
                updates={updates}
                projectId={project.id}
                isProjectOwner={isProjectOwner}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Creator Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Impulsado por
            </h3>

            <div className="flex items-center gap-3 mb-4">
              {project.creator.avatarUrl ? (
                <img
                  src={project.creator.avatarUrl}
                  alt={project.creator.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-lg flex items-center justify-center">
                  {project.creator.name.charAt(0)}
                </div>
              )}

              <div>
                <h4 className="font-bold text-white text-base">{project.creator.name}</h4>
                <p className="text-xs text-slate-400">{project.location}</p>
              </div>
            </div>

            {project.creator.bio && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800 mb-4">
                "{project.creator.bio}"
              </p>
            )}

            {project.creator.skills && project.creator.skills.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-2">Habilidades:</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.creator.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-slate-800 text-emerald-400 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Support Sidebar Box */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>¿Quieres colaborar?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Puedes ofrecer asesoría, habilidades técnicas, préstamo de recursos o promesas de aporte financiero.
            </p>
            <button
              onClick={() => setSupportModalOpen(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-2xl text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              Enviar Mensaje de Apoyo
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SupportFormModal
        projectId={project.id}
        projectTitle={project.title}
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        isLoggedIn={!!currentUser}
      />

      <ProjectUpdateModal
        projectId={project.id}
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />
    </div>
  );
}
