import { cookies } from "next/headers";
import { db } from "@/db";
import { profiles, type Profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "./supabase/server";

const SESSION_COOKIE_NAME = "ideahub_session";

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionCookie) {
      const [user] = await db.select().from(profiles).where(eq(profiles.id, sessionCookie)).limit(1);
      if (user) {
        return user;
      }
    }

    // Try Supabase Auth as secondary check if env is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co") {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
        if (profile) return profile;
      }
    }

    return null;
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.name === "DynamicServerError") {
      return null;
    }
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
