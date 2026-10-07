-- ==================================================================
-- VICEVERSE - SUPABASE DATABASE SCHEMA (FINAL ROUND SYSTEM)
-- ==================================================================

-- 1. Profiles Table (Jury and Mentors)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('judge', 'mentor')),
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Teams Table (Dossiers)
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  case_study TEXT NOT NULL,
  canva_url TEXT,
  drive_url TEXT,
  github_url TEXT,
  round_id TEXT DEFAULT 'final-round', -- dormant column for future multi-round support
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  branch TEXT NOT NULL,
  is_lead BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Criteria Table (Final Round Scoring Matrix)
CREATE TABLE IF NOT EXISTS public.criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  max_marks INTEGER NOT NULL CHECK (max_marks > 0),
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Judge Team Assignments
CREATE TABLE IF NOT EXISTS public.judge_team_assignments (
  judge_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (judge_id, team_id)
);

-- 6. Evaluations Table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_evaluated' CHECK (status IN ('not_evaluated', 'draft', 'submitted')),
  total_marks NUMERIC(5,2) DEFAULT 0,
  feedback TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  UNIQUE (team_id, judge_id)
);

-- 7. Evaluation Scores (Criterion Marks)
CREATE TABLE IF NOT EXISTS public.evaluation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES public.criteria(id) ON DELETE CASCADE,
  marks NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (marks >= 0),
  UNIQUE (evaluation_id, criterion_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_domain ON public.teams(domain);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON public.evaluations(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_judge ON public.evaluations(judge_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_team ON public.evaluations(team_id);
