-- ============================================
-- Vaidya — Supabase Table Setup
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- Health records table
CREATE TABLE health_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('posture', 'skin', 'eye', 'mental')),
  analysis JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_category ON health_records(category);
CREATE INDEX idx_health_records_timestamp ON health_records(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON health_records;
DROP POLICY IF EXISTS "Users can view own health records" ON health_records;
DROP POLICY IF EXISTS "Users can insert own health records" ON health_records;
DROP POLICY IF EXISTS "Users can update own health records" ON health_records;
DROP POLICY IF EXISTS "Users can delete own health records" ON health_records;

CREATE POLICY "Users can view own health records" ON health_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own health records" ON health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own health records" ON health_records
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own health records" ON health_records
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);

-- ============================================
-- Exercise progress tracking
-- ============================================

CREATE TABLE exercise_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercise_progress_user_id ON exercise_progress(user_id);

ALTER TABLE exercise_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON exercise_progress;
DROP POLICY IF EXISTS "Users can view own exercise progress" ON exercise_progress;
DROP POLICY IF EXISTS "Users can insert own exercise progress" ON exercise_progress;
DROP POLICY IF EXISTS "Users can update own exercise progress" ON exercise_progress;
DROP POLICY IF EXISTS "Users can delete own exercise progress" ON exercise_progress;

CREATE POLICY "Users can view own exercise progress" ON exercise_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own exercise progress" ON exercise_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own exercise progress" ON exercise_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own exercise progress" ON exercise_progress
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);
