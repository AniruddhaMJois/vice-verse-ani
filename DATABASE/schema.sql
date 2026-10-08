-- ==============================================================================
-- VICEVERSE: DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. Profiles Table (Supports Login ID format [JDG/MNR + 5 digits] and PIN)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login_id TEXT NOT NULL UNIQUE CHECK (login_id ~ '^[A-Z]{3}[0-9]{5}$'),
    pin TEXT NOT NULL, -- PIN for quick judge/mentor authentication
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('judge', 'mentor', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Rounds Table (Hackathon evaluation rounds)
CREATE TABLE IF NOT EXISTS public.rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_number INT NOT NULL UNIQUE,
    round_name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Teams Table (Hardcoded / Seeded Hackathon Teams)
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id TEXT NOT NULL UNIQUE, -- e.g., 'VV-101'
    team_name TEXT NOT NULL,
    domain TEXT NOT NULL, -- e.g., 'Artificial Intelligence', 'FinTech'
    case_study TEXT, -- e.g., 'Automated Medical Image Triage System'
    canva_link TEXT, -- Canva presentation link
    drive_link TEXT, -- Google Drive prototype link
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Team Members Table (Members and their academic branches)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    branch TEXT NOT NULL, -- e.g., 'CSE', 'AIML', 'ISE', 'ECE'
    is_lead BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Round Teams Mapping (Allots teams to rounds and assigned judges)
CREATE TABLE IF NOT EXISTS public.round_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.rounds(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    assigned_judge_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(round_id, team_id)
);

-- 6. Evaluation Criteria Table (Admin-defined criteria per round)
CREATE TABLE IF NOT EXISTS public.evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.rounds(id) ON DELETE CASCADE,
    criteria_name TEXT NOT NULL,
    description TEXT,
    max_marks INT NOT NULL CHECK (max_marks > 0),
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Evaluations Table (Evaluation submissions by judges for teams in a round)
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.rounds(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    judge_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
    total_score NUMERIC(5,2) DEFAULT 0,
    feedback TEXT,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(round_id, team_id, judge_id)
);

-- 8. Evaluation Scores Table (Individual criterion scores)
CREATE TABLE IF NOT EXISTS public.evaluation_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
    criteria_id UUID NOT NULL REFERENCES public.evaluation_criteria(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (score >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(evaluation_id, criteria_id)
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.evaluations;

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.round_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read for rounds" ON public.rounds FOR SELECT USING (true);
CREATE POLICY "Public read for teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read for team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public read for round_teams" ON public.round_teams FOR SELECT USING (true);
CREATE POLICY "Public read for criteria" ON public.evaluation_criteria FOR SELECT USING (true);
CREATE POLICY "Read evaluations" ON public.evaluations FOR SELECT USING (true);
CREATE POLICY "Insert evaluations" ON public.evaluations FOR INSERT WITH CHECK (true);
CREATE POLICY "Update draft evaluations" ON public.evaluations FOR UPDATE USING (status = 'draft');
CREATE POLICY "Read scores" ON public.evaluation_scores FOR SELECT USING (true);
CREATE POLICY "Insert scores" ON public.evaluation_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Update scores" ON public.evaluation_scores FOR UPDATE USING (true);
