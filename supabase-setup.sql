-- ============================================
-- Vaidya — Supabase Table Setup
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- Health records table
CREATE TABLE health_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
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

-- Allow all operations for now (no auth yet)
-- You can tighten this later if you add user authentication
CREATE POLICY "Allow all operations" ON health_records
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Exercise progress tracking
-- ============================================

CREATE TABLE exercise_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  exercise_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercise_progress_user_id ON exercise_progress(user_id);

ALTER TABLE exercise_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON exercise_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);
