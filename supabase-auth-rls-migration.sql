-- ============================================
-- Vaidya — Auth/RLS Hardening Migration (Existing DBs)
-- Run this in Supabase SQL Editor on an existing project.
-- This script is idempotent and does not drop application data.
-- ============================================

BEGIN;

-- 1) Ensure required tables exist before applying changes
DO $$
BEGIN
  IF to_regclass('public.health_records') IS NULL THEN
    RAISE EXCEPTION 'Table public.health_records does not exist. Run base setup first.';
  END IF;

  IF to_regclass('public.exercise_progress') IS NULL THEN
    RAISE EXCEPTION 'Table public.exercise_progress does not exist. Run base setup first.';
  END IF;
END $$;

-- 2) Remove insecure default user fallback at DB level
ALTER TABLE public.health_records
  ALTER COLUMN user_id DROP DEFAULT;

ALTER TABLE public.exercise_progress
  ALTER COLUMN user_id DROP DEFAULT;

-- NOTE:
-- Existing rows with user_id = 'default' remain in the tables but become inaccessible
-- under the new per-user RLS policies. This is usually desirable for safety.
-- Audit them manually if needed:
--   SELECT count(*) FROM public.health_records WHERE user_id = 'default';
--   SELECT count(*) FROM public.exercise_progress WHERE user_id = 'default';

-- 3) Helpful indexes (safe if already present)
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_category ON public.health_records(category);
CREATE INDEX IF NOT EXISTS idx_health_records_timestamp ON public.health_records(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_id ON public.exercise_progress(user_id);

-- 4) Enable RLS
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

-- 5) Drop all existing policies on these tables (avoids name mismatch issues)
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('health_records', 'exercise_progress')
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      p.policyname,
      p.schemaname,
      p.tablename
    );
  END LOOP;
END $$;

-- 6) Create strict per-user policies for authenticated users
CREATE POLICY "Users can view own health records" ON public.health_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own health records" ON public.health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own health records" ON public.health_records
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own health records" ON public.health_records
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view own exercise progress" ON public.exercise_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own exercise progress" ON public.exercise_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own exercise progress" ON public.exercise_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own exercise progress" ON public.exercise_progress
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);

COMMIT;

-- Optional post-checks:
-- SELECT tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname='public'
--   AND tablename IN ('health_records', 'exercise_progress')
-- ORDER BY tablename, policyname;
