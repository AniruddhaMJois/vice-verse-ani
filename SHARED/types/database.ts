export type UserRole = "judge" | "mentor";

export interface Profile {
  id: string;
  login_id: string;
  pin: string;
  name: string;
  role: UserRole;
  email?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  branch: string;
  is_lead: boolean;
  created_at?: string;
}

export interface Team {
  id: string;
  team_code: string;
  name: string;
  domain: string;
  case_study: string;
  canva_url?: string | null;
  drive_url?: string | null;
  github_url?: string | null;
  round_id?: string | null;
  members?: TeamMember[];
  created_at?: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  max_marks: number;
  sort_order: number;
  created_at?: string;
}

export type EvaluationStatus = "not_evaluated" | "draft" | "submitted";

export interface Evaluation {
  id: string;
  team_id: string;
  judge_id: string;
  status: EvaluationStatus;
  total_marks: number;
  feedback?: string | null;
  submitted_at?: string | null;
  updated_at?: string;
}

export interface EvaluationScore {
  id: string;
  evaluation_id: string;
  criterion_id: string;
  marks: number;
}

export interface JudgeTeamAssignment {
  judge_id: string;
  team_id: string;
  created_at?: string;
}

export interface TeamWithEvaluationStatus extends Team {
  evaluation_status: EvaluationStatus;
  current_evaluation?: Evaluation | null;
}
