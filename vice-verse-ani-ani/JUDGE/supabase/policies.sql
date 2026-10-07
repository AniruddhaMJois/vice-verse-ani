-- ==================================================================
-- VICEVERSE - SUPABASE ROW LEVEL SECURITY (RLS) POLICIES & TRIGGERS
-- ==================================================================

-- Enable RLS on all core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's profile role and profile id
CREATE OR REPLACE FUNCTION public.get_auth_profile()
RETURNS TABLE (profile_id UUID, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT id, profiles.role
  FROM public.profiles
  WHERE id = auth.uid() OR email = auth.email()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ------------------------------------------------------------------
-- Users can view all profiles (needed to see judge/mentor names)
CREATE POLICY "Allow public read on profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- ------------------------------------------------------------------
-- 2. CRITERIA POLICIES
-- ------------------------------------------------------------------
-- Criteria is readable by any authenticated judge or mentor
CREATE POLICY "Allow read on criteria for all authenticated"
  ON public.criteria FOR SELECT
  USING (true);

-- ------------------------------------------------------------------
-- 3. TEAMS & TEAM MEMBERS POLICIES
-- ------------------------------------------------------------------
-- Mentors can view all teams; Judges can view their assigned teams (or all teams for roster preview)
CREATE POLICY "Allow read on teams"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Allow read on team_members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Allow read on judge_team_assignments"
  ON public.judge_team_assignments FOR SELECT
  USING (true);

-- ------------------------------------------------------------------
-- 4. EVALUATIONS POLICIES
-- ------------------------------------------------------------------
-- Mentors: Read-only access to all evaluations
CREATE POLICY "Mentors can read all evaluations"
  ON public.evaluations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE (p.id = auth.uid() OR p.email = auth.email()) AND p.role = 'mentor'
    )
  );

-- Judges: Read their own evaluations only
CREATE POLICY "Judges can read own evaluations"
  ON public.evaluations FOR SELECT
  USING (
    judge_id IN (
      SELECT id FROM public.profiles
      WHERE (id = auth.uid() OR email = auth.email()) AND role = 'judge'
    )
  );

-- Judges: Insert own evaluations
CREATE POLICY "Judges can insert own evaluations"
  ON public.evaluations FOR INSERT
  WITH CHECK (
    judge_id IN (
      SELECT id FROM public.profiles
      WHERE (id = auth.uid() OR email = auth.email()) AND role = 'judge'
    )
  );

-- Judges: Update own evaluations ONLY IF not submitted
CREATE POLICY "Judges can update own draft evaluations"
  ON public.evaluations FOR UPDATE
  USING (
    judge_id IN (
      SELECT id FROM public.profiles
      WHERE (id = auth.uid() OR email = auth.email()) AND role = 'judge'
    )
    AND status <> 'submitted'
  )
  WITH CHECK (
    judge_id IN (
      SELECT id FROM public.profiles
      WHERE (id = auth.uid() OR email = auth.email()) AND role = 'judge'
    )
  );

-- ------------------------------------------------------------------
-- 5. EVALUATION SCORES POLICIES
-- ------------------------------------------------------------------
-- Mentors can read all scores
CREATE POLICY "Mentors can read all evaluation scores"
  ON public.evaluation_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE (p.id = auth.uid() OR p.email = auth.email()) AND p.role = 'mentor'
    )
  );

-- Judges can read own evaluation scores
CREATE POLICY "Judges can read own evaluation scores"
  ON public.evaluation_scores FOR SELECT
  USING (
    evaluation_id IN (
      SELECT e.id FROM public.evaluations e
      JOIN public.profiles p ON p.id = e.judge_id
      WHERE (p.id = auth.uid() OR p.email = auth.email()) AND p.role = 'judge'
    )
  );

-- Judges can insert/update scores for unsubmitted evaluations
CREATE POLICY "Judges can insert own scores"
  ON public.evaluation_scores FOR INSERT
  WITH CHECK (
    evaluation_id IN (
      SELECT e.id FROM public.evaluations e
      JOIN public.profiles p ON p.id = e.judge_id
      WHERE (p.id = auth.uid() OR p.email = auth.email()) AND p.role = 'judge' AND e.status <> 'submitted'
    )
  );

CREATE POLICY "Judges can update own scores"
  ON public.evaluation_scores FOR UPDATE
  USING (
    evaluation_id IN (
      SELECT e.id FROM public.evaluations e
      JOIN public.profiles p ON p.id = e.judge_id
      WHERE (p.id = auth.uid() OR p.email = auth.email()) AND p.role = 'judge' AND e.status <> 'submitted'
    )
  );

-- ------------------------------------------------------------------
-- 6. TRIGGERS: SCORE VALIDATION & TOTAL RECALCULATION
-- ------------------------------------------------------------------
-- Validate mark does not exceed criteria max_marks
CREATE OR REPLACE FUNCTION public.check_score_validity()
RETURNS TRIGGER AS $$
DECLARE
  v_max_marks INTEGER;
BEGIN
  SELECT max_marks INTO v_max_marks
  FROM public.criteria
  WHERE id = NEW.criterion_id;

  IF NEW.marks > v_max_marks THEN
    RAISE EXCEPTION 'Mark % exceeds maximum allowed % for criterion %', NEW.marks, v_max_marks, NEW.criterion_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_score
  BEFORE INSERT OR UPDATE ON public.evaluation_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.check_score_validity();

-- Automatically recalculate evaluation total_marks
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

CREATE TRIGGER trg_recalc_total_after_score_change
  AFTER INSERT OR UPDATE OR DELETE ON public.evaluation_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_evaluation_total();
