-- ==================================================================
-- VICEVERSE - SUPABASE ROW LEVEL SECURITY (RLS) POLICIES & TRIGGERS
-- ==================================================================

-- 1. Enable RLS on all core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public read on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow read on criteria for all authenticated" ON public.criteria;
DROP POLICY IF EXISTS "Allow public read on criteria" ON public.criteria;
DROP POLICY IF EXISTS "Allow read on teams" ON public.teams;
DROP POLICY IF EXISTS "Allow read on team_members" ON public.team_members;
DROP POLICY IF EXISTS "Allow read on judge_team_assignments" ON public.judge_team_assignments;
DROP POLICY IF EXISTS "Mentors can read all evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Judges can read own evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Judges can insert own evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Judges can update own draft evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Allow read on evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Allow insert on evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Allow update on evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Allow read on evaluation_scores" ON public.evaluation_scores;
DROP POLICY IF EXISTS "Allow insert on evaluation_scores" ON public.evaluation_scores;
DROP POLICY IF EXISTS "Allow update on evaluation_scores" ON public.evaluation_scores;
DROP POLICY IF EXISTS "Allow delete on evaluation_scores" ON public.evaluation_scores;

-- ------------------------------------------------------------------
-- 3. PERMISSIVE POLICIES FOR HACKATHON EVALUATION PORTAL
-- ------------------------------------------------------------------

-- Profiles: Public select for fast PIN/Login ID verification
CREATE POLICY "Allow public read on profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Criteria: Public read for rubric
CREATE POLICY "Allow public read on criteria"
  ON public.criteria FOR SELECT
  USING (true);

-- Teams and Members: Public read
CREATE POLICY "Allow read on teams"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Allow read on team_members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Allow read on judge_team_assignments"
  ON public.judge_team_assignments FOR SELECT
  USING (true);

-- Evaluations: Read, Insert, Update
CREATE POLICY "Allow read on evaluations"
  ON public.evaluations FOR SELECT
  USING (true);

CREATE POLICY "Allow insert on evaluations"
  ON public.evaluations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on evaluations"
  ON public.evaluations FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Evaluation Scores: Full management for grading
CREATE POLICY "Allow read on evaluation_scores"
  ON public.evaluation_scores FOR SELECT
  USING (true);

CREATE POLICY "Allow insert on evaluation_scores"
  ON public.evaluation_scores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on evaluation_scores"
  ON public.evaluation_scores FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete on evaluation_scores"
  ON public.evaluation_scores FOR DELETE
  USING (true);

-- ------------------------------------------------------------------
-- 4. REALTIME PUBLICATION
-- ------------------------------------------------------------------
-- Enable realtime events on evaluations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'evaluations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.evaluations;
  END IF;
END $$;

-- ------------------------------------------------------------------
-- 5. TRIGGER: AUTOMATIC TOTAL MARKS RECALCULATION
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalculate_evaluation_total()
RETURNS TRIGGER AS $$
DECLARE
  v_total NUMERIC(5,2);
  v_eval_id UUID;
BEGIN
  v_eval_id := COALESCE(NEW.evaluation_id, OLD.evaluation_id);

  SELECT COALESCE(SUM(marks), 0) INTO v_total
  FROM public.evaluation_scores
  WHERE evaluation_id = v_eval_id;

  UPDATE public.evaluations
  SET total_marks = v_total, updated_at = now()
  WHERE id = v_eval_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recalc_total_after_score_change ON public.evaluation_scores;
CREATE TRIGGER trg_recalc_total_after_score_change
  AFTER INSERT OR UPDATE OR DELETE ON public.evaluation_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_evaluation_total();
