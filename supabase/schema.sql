-- ==========================================
-- IDEAHUB - SUPABASE DATABASE SCHEMA & RLS
-- ==========================================

-- 1. ENUMS
CREATE TYPE project_category AS ENUM ('tech', 'business', 'art', 'social');
CREATE TYPE project_status AS ENUM ('idea', 'building', 'running', 'done');
CREATE TYPE support_type AS ENUM ('COLLABORATE', 'MENTOR', 'RESOURCE', 'DONATE');
CREATE TYPE support_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- 2. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tech', 'business', 'art', 'social')),
  location TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'building', 'running', 'done')),
  cover_image_url TEXT,
  goal_amount NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. SUPPORTS TABLE
CREATE TABLE IF NOT EXISTS public.supports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('COLLABORATE', 'MENTOR', 'RESOURCE', 'DONATE')),
  message TEXT NOT NULL,
  amount NUMERIC(12, 2),
  anonymous BOOLEAN DEFAULT FALSE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. PROJECT UPDATES TABLE
CREATE TABLE IF NOT EXISTS public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  links JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_supports_project_id ON public.supports(project_id);
CREATE INDEX IF NOT EXISTS idx_supports_user_id ON public.supports(user_id);
CREATE INDEX IF NOT EXISTS idx_supports_status ON public.supports(status);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON public.project_updates(project_id);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES

-- PROFILES:
-- Lectura pública para ver creadores
CREATE POLICY "Profiles - Lectura pública"
  ON public.profiles FOR SELECT
  USING (true);

-- Edición solo dueño de la cuenta
CREATE POLICY "Profiles - Escritura propio usuario"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Insertion al registrarse
CREATE POLICY "Profiles - Inserción usuario autenticado"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PROJECTS:
-- Lectura pública
CREATE POLICY "Projects - Lectura pública"
  ON public.projects FOR SELECT
  USING (true);

-- Crear proyecto (solo autenticado y con user_id propio)
CREATE POLICY "Projects - Crear usuario autenticado"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Editar proyecto (solo el propietario)
CREATE POLICY "Projects - Editar propietario"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Eliminar proyecto (solo el propietario)
CREATE POLICY "Projects - Eliminar propietario"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- SUPPORTS:
-- Lectura pública de apoyos
CREATE POLICY "Supports - Lectura pública"
  ON public.supports FOR SELECT
  USING (true);

-- Crear apoyo (cualquier usuario autenticado)
CREATE POLICY "Supports - Crear autenticado"
  ON public.supports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Editar estado de apoyo (solo el dueño del proyecto o el supporter)
CREATE POLICY "Supports - Actualizar estado dueño del proyecto"
  ON public.supports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = supports.project_id
      AND public.projects.user_id = auth.uid()
    ) OR auth.uid() = user_id
  );

-- PROJECT UPDATES:
-- Lectura pública de novedades
CREATE POLICY "Updates - Lectura pública"
  ON public.project_updates FOR SELECT
  USING (true);

-- Crear update (solo dueño del proyecto)
CREATE POLICY "Updates - Crear solo propietario"
  ON public.project_updates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = project_updates.project_id
      AND public.projects.user_id = auth.uid()
    )
  );

-- Eliminar update (solo dueño del proyecto)
CREATE POLICY "Updates - Eliminar solo propietario"
  ON public.project_updates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = project_updates.project_id
      AND public.projects.user_id = auth.uid()
    )
  );

-- 9. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
