"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signupSchema, loginSchema, profileSchema } from "@/lib/validations/auth";
import { setSessionCookie, clearSessionCookie, getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const skillsRaw = formData.get("skills") as string;

  const result = signupSchema.safeParse({ email, password, name, bio, location, skills: skillsRaw });

  if (!result.success) {
    const errorMsg = result.error.issues.map(e => e.message).join(", ");
    return { error: errorMsg };
  }

  const { email: validatedEmail, password: validatedPassword, name: validatedName } = result.data;

  // Check if user exists
  const [existingUser] = await db.select().from(profiles).where(eq(profiles.email, validatedEmail.toLowerCase())).limit(1);

  if (existingUser) {
    return { error: "Ya existe un usuario registrado con este correo." };
  }

  const hashedPassword = await bcrypt.hash(validatedPassword, 10);
  const skillsArray = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

  const [newUser] = await db.insert(profiles).values({
    email: validatedEmail.toLowerCase(),
    passwordHash: hashedPassword,
    name: validatedName,
    bio: bio || null,
    location: location || null,
    skills: skillsArray,
  }).returning();

  await setSessionCookie(newUser.id);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    return { error: "Formato de datos inválido" };
  }

  const [user] = await db.select().from(profiles).where(eq(profiles.email, email.toLowerCase())).limit(1);

  if (!user || !user.passwordHash) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordsMatch) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await setSessionCookie(user.id);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfileAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Debes iniciar sesión para actualizar tu perfil." };
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const skillsRaw = formData.get("skills") as string;

  const result = profileSchema.safeParse({ name, bio, location, avatarUrl, skills: skillsRaw });

  if (!result.success) {
    return { error: result.error.issues.map(e => e.message).join(", ") };
  }

  const skillsArray = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

  await db.update(profiles).set({
    name,
    bio: bio || null,
    location: location || null,
    avatarUrl: avatarUrl || null,
    skills: skillsArray,
    updatedAt: new Date(),
  }).where(eq(profiles.id, user.id));

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: "Perfil actualizado correctamente" };
}
