"use server";

import { db } from "@/db";
import { projects, supports, projectUpdates, profiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { projectSchema, supportSchema, projectUpdateSchema } from "@/lib/validations/project";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProjectAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Debes iniciar sesión para crear un proyecto." };
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as any;
  const location = formData.get("location") as string;
  const tagsRaw = formData.get("tags") as string;
  const status = (formData.get("status") as any) || "idea";
  const coverImageUrl = formData.get("coverImageUrl") as string;
  const goalAmount = formData.get("goalAmount") as string;

  const result = projectSchema.safeParse({
    title,
    summary,
    description,
    category,
    location,
    tags: tagsRaw,
    status,
    coverImageUrl,
    goalAmount,
  });

  if (!result.success) {
    return { error: result.error.issues.map(e => e.message).join(", ") };
  }

  const tagsArray = tagsRaw ? tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

  const [newProject] = await db.insert(projects).values({
    userId: user.id,
    title,
    summary,
    description,
    category,
    location,
    tags: tagsArray,
    status,
    coverImageUrl: coverImageUrl || null,
    goalAmount: goalAmount && !isNaN(Number(goalAmount)) ? goalAmount : null,
  }).returning();

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect(`/projects/${newProject.id}`);
}

export async function updateProjectAction(projectId: string, prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Debes iniciar sesión para modificar el proyecto." };
  }

  const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

  if (!existing || existing.userId !== user.id) {
    return { error: "No tienes permiso para editar este proyecto." };
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as any;
  const location = formData.get("location") as string;
  const tagsRaw = formData.get("tags") as string;
  const status = (formData.get("status") as any) || "idea";
  const coverImageUrl = formData.get("coverImageUrl") as string;
  const goalAmount = formData.get("goalAmount") as string;

  const result = projectSchema.safeParse({
    title,
    summary,
    description,
    category,
    location,
    tags: tagsRaw,
    status,
    coverImageUrl,
    goalAmount,
  });

  if (!result.success) {
    return { error: result.error.issues.map(e => e.message).join(", ") };
  }

  const tagsArray = tagsRaw ? tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];

  await db.update(projects).set({
    title,
    summary,
    description,
    category,
    location,
    tags: tagsArray,
    status,
    coverImageUrl: coverImageUrl || null,
    goalAmount: goalAmount && !isNaN(Number(goalAmount)) ? goalAmount : null,
    updatedAt: new Date(),
  }).where(eq(projects.id, projectId));

  revalidatePath("/");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
  return { success: "Proyecto actualizado correctamente" };
}

export async function deleteProjectAction(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado" };

  const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!existing || existing.userId !== user.id) {
    return { error: "No tienes permiso para eliminar este proyecto." };
  }

  await db.delete(projects).where(eq(projects.id, projectId));
  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createSupportAction(projectId: string, prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Debes iniciar sesión para enviar tu apoyo a un proyecto." };
  }

  const type = formData.get("type") as any;
  const message = formData.get("message") as string;
  const amount = formData.get("amount") as string;
  const anonymous = formData.get("anonymous") === "true";

  const result = supportSchema.safeParse({
    type,
    message,
    amount,
    anonymous,
  });

  if (!result.success) {
    return { error: result.error.issues.map(e => e.message).join(", ") };
  }

  await db.insert(supports).values({
    projectId,
    userId: user.id,
    type,
    message,
    amount: amount && !isNaN(Number(amount)) ? amount : null,
    anonymous,
    status: "pending",
  });

  revalidatePath(`/projects/${projectId}`);
  return { success: "¡Gracias por tu apoyo! El creador del proyecto ha sido notificado." };
}

export async function updateSupportStatusAction(supportId: string, projectId: string, newStatus: "accepted" | "rejected" | "completed") {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado" };

  // Check project ownership
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project || project.userId !== user.id) {
    return { error: "Solo el dueño del proyecto puede gestionar apoyos." };
  }

  await db.update(supports).set({
    status: newStatus,
    updatedAt: new Date(),
  }).where(eq(supports.id, supportId));

  revalidatePath(`/projects/${projectId}`);
  return { success: `Estado de apoyo actualizado a: ${newStatus}` };
}

export async function createUpdateAction(projectId: string, prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado" };

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project || project.userId !== user.id) {
    return { error: "Solo el dueño del proyecto puede añadir actualizaciones." };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const rawLinks = formData.get("links") as string;

  const result = projectUpdateSchema.safeParse({ title, content, links: rawLinks });
  if (!result.success) {
    return { error: result.error.issues.map(e => e.message).join(", ") };
  }

  const parsedLinks = rawLinks
    ? rawLinks
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(url => ({ url, label: url.replace(/^https?:\/\//, "").split("/")[0] }))
    : [];

  await db.insert(projectUpdates).values({
    projectId,
    title,
    content,
    links: parsedLinks,
  });

  revalidatePath(`/projects/${projectId}`);
  return { success: "Actualización publicada exitosamente." };
}

export async function deleteUpdateAction(updateId: string, projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado" };

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project || project.userId !== user.id) {
    return { error: "No autorizado" };
  }

  await db.delete(projectUpdates).where(eq(projectUpdates.id, updateId));
  revalidatePath(`/projects/${projectId}`);
  return { success: "Actualización eliminada" };
}
