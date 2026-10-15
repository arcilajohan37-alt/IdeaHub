import { db } from "@/db";
import { projects, profiles, supports } from "@/db/schema";
import { eq, ilike, and, or, sql, desc, count } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilter from "@/components/ProjectFilter";
import Link from "next/link";
import { PlusCircle, Sparkles, Lightbulb, Compass, Rocket, ShieldCheck } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    q?: string;
    location?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Ensure seed data exists
  await seedDatabase();

  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category;
  const statusFilter = resolvedParams.status;
  const queryFilter = resolvedParams.q;
  const locationFilter = resolvedParams.location;
  const tagFilter = resolvedParams.tag;

  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = 9;
  const offset = (page - 1) * limit;

  // Build filter conditions
  const conditions = [];

  if (categoryFilter) {
    conditions.push(eq(projects.category, categoryFilter));
  }

  if (statusFilter) {
    conditions.push(eq(projects.status, statusFilter));
  }

  if (queryFilter) {
    const searchPattern = `%${queryFilter.trim()}%`;
    conditions.push(
      or(
        ilike(projects.title, searchPattern),
        ilike(projects.summary, searchPattern),
        ilike(projects.description, searchPattern)
      )
    );
  }

  if (locationFilter) {
    conditions.push(ilike(projects.location, `%${locationFilter.trim()}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Query projects with author info
  const projectList = await db
    .select({
      id: projects.id,
      title: projects.title,
      summary: projects.summary,
      description: projects.description,
      category: projects.category,
      location: projects.location,
      tags: projects.tags,
      status: projects.status,
      coverImageUrl: projects.coverImageUrl,
      goalAmount: projects.goalAmount,
      createdAt: projects.createdAt,
      creatorName: profiles.name,
      creatorAvatar: profiles.avatarUrl,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.userId, profiles.id))
    .where(whereClause)
    .orderBy(desc(projects.createdAt))
    .limit(limit)
    .offset(offset);

  // Count total for pagination
  const [{ totalCount }] = await db
    .select({ totalCount: count(projects.id) })
    .from(projects)
    .where(whereClause);

  const total = Number(totalCount);
  const totalPages = Math.ceil(total / limit) || 1;

  // Fetch support counts for these projects
  const projectIds = projectList.map((p) => p.id);
  const supportCountsMap: Record<string, number> = {};

  if (projectIds.length > 0) {
    const supportCounts = await db
      .select({
        projectId: supports.projectId,
        count: count(supports.id),
      })
      .from(supports)
      .where(sql`${supports.projectId} IN ${projectIds}`)
      .groupBy(supports.projectId);

    supportCounts.forEach((sc) => {
      supportCountsMap[sc.projectId] = Number(sc.count);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Banner */}
      <section className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-slate-800 p-8 sm:p-12 mb-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comunidad de Creadores e Innovadores</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Convierte tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">ideas en proyectos</span> con la comunidad
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            IdeaHub es el espacio para lanzar iniciativas de tecnología, negocios, arte e impacto social. Consigue colaboración técnica, mentoría, recursos y aportaciones para hacerlas realidad.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Publicar mi Idea</span>
            </Link>

            <a
              href="#explorar"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold px-6 py-3.5 rounded-2xl text-sm transition-colors"
            >
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Explorar Proyectos</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Feed Section */}
      <section id="explorar">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-emerald-400" />
              <span>Explorar Ideas y Proyectos</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Descubre proyectos activos en busca de talento, experiencia o financiamiento.
            </p>
          </div>

          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-medium hidden sm:inline-block">
            {total} {total === 1 ? "proyecto encontrado" : "proyectos encontrados"}
          </span>
        </div>

        {/* Interactive Filters */}
        <ProjectFilter />

        {/* Project Grid */}
        {projectList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {projectList.map((p) => (
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
                  creator: p.creatorName
                    ? { name: p.creatorName, avatarUrl: p.creatorAvatar }
                    : null,
                  supportsCount: supportCountsMap[p.id] || 0,
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center my-8">
            <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron proyectos</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Prueba cambiando tus términos de búsqueda o limpiando los filtros seleccionados.
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar la primera idea en esta categoría</span>
            </Link>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
              const isActive = pNum === page;
              const params = new URLSearchParams(resolvedParams as any);
              params.set("page", pNum.toString());

              return (
                <Link
                  key={pNum}
                  href={`/?${params.toString()}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {pNum}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
