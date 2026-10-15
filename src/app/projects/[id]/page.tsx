import { db } from "@/db";
import { projects, profiles, supports, projectUpdates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CategoryBadge, StatusBadge } from "@/components/ProjectBadges";
import ProjectDetailClient from "./ProjectDetailClient";

export const revalidate = 0; // Dynamic rendering

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  // Fetch project
  const [project] = await db
    .select({
      id: projects.id,
      userId: projects.userId,
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
      updatedAt: projects.updatedAt,
      creatorName: profiles.name,
      creatorEmail: profiles.email,
      creatorAvatar: profiles.avatarUrl,
      creatorBio: profiles.bio,
      creatorSkills: profiles.skills,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.userId, profiles.id))
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) {
    notFound();
  }

  // Fetch supports for this project
  const supportList = await db
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
    })
    .from(supports)
    .leftJoin(profiles, eq(supports.userId, profiles.id))
    .where(eq(supports.projectId, id))
    .orderBy(desc(supports.createdAt));

  // Fetch updates for this project
  const updateList = await db
    .select()
    .from(projectUpdates)
    .where(eq(projectUpdates.projectId, id))
    .orderBy(desc(projectUpdates.createdAt));

  const isProjectOwner = !!(user && user.id === project.userId);

  // Calculate pledged donation total
  const totalPledged = supportList
    .filter((s) => s.type === "DONATE" && s.amount && s.status !== "rejected")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <ProjectDetailClient
      project={{
        ...project,
        tags: project.tags || [],
        creator: {
          id: project.userId,
          name: project.creatorName || "Creador",
          email: project.creatorEmail || "",
          avatarUrl: project.creatorAvatar,
          bio: project.creatorBio,
          skills: project.creatorSkills || [],
        },
      }}
      supports={supportList.map((s) => ({
        ...s,
        supporter: s.supporterName ? { name: s.supporterName, avatarUrl: s.supporterAvatar } : null,
      }))}
      updates={updateList}
      isProjectOwner={isProjectOwner}
      currentUser={user ? { id: user.id, name: user.name } : null}
      totalPledged={totalPledged}
    />
  );
}
