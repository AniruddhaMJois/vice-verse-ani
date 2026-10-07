export type UserRole = "judge" | "mentor" | "admin";

export interface Profile {
  id: string;
  login_id: string;
  pin: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface Round {
  id: string;
  round_number: number;
  round_name: string;
  description: string;
  is_active: boolean;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  member_name: string;
  branch: string;
  is_lead: boolean;
  created_at?: string;
}

export interface Team {
  id: string;
  team_id: string;
  team_name: string;
  domain: string;
  case_study: string | null;
  canva_link: string | null;
  drive_link: string | null;
  members?: TeamMember[];
  created_at?: string;
}

export interface EvaluationCriteria {
  id: string;
  round_id: string;
  criteria_name: string;
  description: string;
  max_marks: number;
  display_order: number;
  created_at?: string;
}

export type EvaluationStatus = "not_evaluated" | "draft" | "submitted";

export interface Evaluation {
  id: string;
  round_id: string;
  team_id: string;
  judge_id: string;
  status: "draft" | "submitted";
  total_score: number;
  feedback: string | null;
  submitted_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EvaluationScore {
  id: string;
  evaluation_id: string;
  criteria_id: string;
  score: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamWithEvaluationStatus extends Team {
  evaluation_status: EvaluationStatus;
  current_evaluation?: Evaluation | null;
}
