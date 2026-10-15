import { db } from "@/db";
import { projects, profiles, supports, projectUpdates } from "@/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import SupportList from "@/components/SupportList";
import { 
  PlusCircle, 
  LayoutDashboard, 
  Lightbulb, 
  HeartHandshake, 
  User, 
  MapPin, 
  Tag, 
  Edit3,
  ArrowRight,
  Send
} from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch my projects
  const myProjects = await db
    .select({
      id: projects.id,
      title: projects.title,
      summary: projects.summary,
      category: projects.category,
      location: projects.location,
      tags: projects.tags,
      status: projects.status,
      coverImageUrl: projects.coverImageUrl,
      goalAmount: projects.goalAmount,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.createdAt));

  // Support counts for my projects
  const myProjectIds = myProjects.map((p) => p.id);
  const supportCountsMap: Record<string, number> = {};

  if (myProjectIds.length > 0) {
    const counts = await db
      .select({
        projectId: supports.projectId,
        count: count(supports.id),
      })
      .from(supports)
      .where(sql`${supports.projectId} IN ${myProjectIds}`)
      .groupBy(supports.projectId);

    counts.forEach((c) => {
      supportCountsMap[c.projectId] = Number(c.count);
    });
  }

  // Fetch all supports received across my projects
  let receivedSupports: any[] = [];
  if (myProjectIds.length > 0) {
    receivedSupports = await db
      .select({
        id: supports.id,
        projectId: supports.projectId,
        userId: supports.userId,
        type: supports.type,
        message: supports.message,
        amount: supports.amount,
        anonymous: supports.anonymous,
        status: supports.status,
        createdAt: supports.createdAt,
        supporterName: profiles.name,
        supporterAvatar: profiles.avatarUrl,
        projectTitle: projects.title,
      })
      .from(supports)
      .leftJoin(profiles, eq(supports.userId, profiles.id))
      .leftJoin(projects, eq(supports.projectId, projects.id))
      .where(sql`${supports.projectId} IN ${myProjectIds}`)
      .orderBy(desc(supports.createdAt));
  }

  // Fetch supports sent by me to other projects
  const sentSupports = await db
    .select({
      id: supports.id,
      projectId: supports.projectId,
      type: supports.type,
      message: supports.message,
      amount: supports.amount,
      status: supports.status,
      createdAt: supports.createdAt,
      projectTitle: projects.title,
    })
    .from(supports)
    .leftJoin(projects, eq(supports.projectId, projects.id))
    .where(eq(supports.userId, user.id))
    .orderBy(desc(supports.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Profile summary card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/50"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-2xl flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
              <Link
                href="/profile"
                className="p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-800 rounded-lg transition-colors"
                title="Editar Perfil"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
            {user.location && (
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.location}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/projects/new"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-sm transition-all shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Nueva Idea</span>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mis Proyectos</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{myProjects.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Apoyos Recibidos</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{receivedSupports.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Apoyos Enviados</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{sentSupports.length}</p>
        </div>
      </div>

      {/* Projects Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            <span>Mis Proyectos Publicados</span>
          </h2>

          <Link
            href="/projects/new"
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            + Crear Proyecto
          </Link>
        </div>

        {myProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={{
                  id: p.id,
                  title: p.title,
                  summary: p.summary,
                  category: p.category,
                  location: p.location,
                  tags: p.tags,
                  status: p.status,
                  coverImageUrl: p.coverImageUrl,
                  goalAmount: p.goalAmount,
                  createdAt: p.createdAt,
                  creator: { name: user.name, avatarUrl: user.avatarUrl },
                  supportsCount: supportCountsMap[p.id] || 0,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
            <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Aún no has publicado ideas</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              ¿Tienes una iniciativa de negocios, tecnología, arte o impacto social? Publica tu MVP en minutos.
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar mi Primera Idea</span>
            </Link>
          </div>
        )}
      </section>

      {/* Received Supports Section */}
      <section className="mb-12">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mb-6">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <span>Apoyos Recibidos en mis Proyectos ({receivedSupports.length})</span>
        </h2>

        <SupportList
          supports={receivedSupports.map((s) => ({
            ...s,
            supporter: s.supporterName ? { name: s.supporterName, avatarUrl: s.supporterAvatar } : null,
          }))}
          projectId=""
          isProjectOwner={true}
          currentUserId={user.id}
        />
      </section>

      {/* Sent Supports Section */}
      <section>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mb-6">
          <Send className="w-5 h-5 text-purple-400" />
          <span>Apoyos que He Enviado a Otros Proyectos ({sentSupports.length})</span>
        </h2>

        {sentSupports.length > 0 ? (
          <div className="space-y-3">
            {sentSupports.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <Link
                    href={`/projects/${item.projectId}`}
                    className="font-bold text-white text-sm hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>{item.projectTitle || "Proyecto"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </Link>
                  <p className="text-xs text-slate-300 mt-1">"{item.message}"</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase">
                    {item.type}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 capitalize">Estado: {item.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
            No has enviado apoyos a otros proyectos aún. Explorar el feed para colaborar.
          </div>
        )}
      </section>
    </div>
  );
}
