import { pgTable, uuid, text, varchar, boolean, numeric, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  bio: text("bio"),
  location: text("location"),
  avatarUrl: text("avatar_url"),
  skills: jsonb("skills").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'tech' | 'business' | 'art' | 'social'
  location: text("location").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: text("status").notNull().default("idea"), // 'idea' | 'building' | 'running' | 'done'
  coverImageUrl: text("cover_image_url"),
  goalAmount: numeric("goal_amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("projects_category_idx").on(table.category),
  index("projects_status_idx").on(table.status),
  index("projects_user_id_idx").on(table.userId),
]);

export const supports = pgTable("supports", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'COLLABORATE' | 'MENTOR' | 'RESOURCE' | 'DONATE'
  message: text("message").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  anonymous: boolean("anonymous").default(false).notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("supports_project_id_idx").on(table.projectId),
  index("supports_user_id_idx").on(table.userId),
  index("supports_status_idx").on(table.status),
]);

export const projectUpdates = pgTable("project_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  links: jsonb("links").$type<{ label?: string; url: string }[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("project_updates_project_id_idx").on(table.projectId),
]);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Support = typeof supports.$inferSelect;
export type NewSupport = typeof supports.$inferInsert;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type NewProjectUpdate = typeof projectUpdates.$inferInsert;
