import Link from "next/link";
import { CategoryBadge, StatusBadge } from "@/components/ProjectBadges";
import { MapPin, Users, HeartHandshake, ArrowRight, User } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    summary: string;
    category: string;
    location: string;
    tags?: string[] | null;
    status: string;
    coverImageUrl?: string | null;
    goalAmount?: string | null;
    createdAt: Date | string;
    creator?: {
      name: string;
      avatarUrl?: string | null;
    } | null;
    supportsCount?: number;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Cover Image or Gradient */}
      <Link href={`/projects/${project.id}`} className="relative h-48 w-full bg-slate-800 overflow-hidden block">
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-emerald-950 to-slate-900 flex items-center justify-center p-6 text-center">
            <span className="text-4xl opacity-30">🚀</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <CategoryBadge category={project.category} />
          <StatusBadge status={project.status} />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator & Date */}
          <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
            {project.creator ? (
              <div className="flex items-center gap-2">
                {project.creator.avatarUrl ? (
                  <img
                    src={project.creator.avatarUrl}
                    alt={project.creator.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                    {project.creator.name.charAt(0)}
                  </div>
                )}
                <span className="text-slate-300 font-medium truncate max-w-[140px]">
                  {project.creator.name}
                </span>
              </div>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <User className="w-3.5 h-3.5" />
                <span>Creador</span>
              </span>
            )}
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          {/* Title & Summary */}
          <Link href={`/projects/${project.id}`} className="block group-hover:text-emerald-400 transition-colors">
            <h3 className="font-bold text-lg text-white line-clamp-1 mb-2">
              {project.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
            {project.summary}
          </p>
        </div>

        <div>
          {/* Location & Tags */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[130px]">{project.location}</span>
            </div>

            {project.supportsCount !== undefined && (
              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{project.supportsCount} apoyos</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-slate-500 text-[11px] font-medium pt-0.5">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Link */}
          <Link
            href={`/projects/${project.id}`}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-semibold text-sm py-2 rounded-xl transition-all duration-200"
          >
            <span>Ver Proyecto</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
