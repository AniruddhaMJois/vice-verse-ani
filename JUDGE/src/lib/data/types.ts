export type UserRole = "judge" | "mentor";

export interface Profile {
  id: string;
  loginId: string;
  name: string;
  role: UserRole;
  email?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type EvaluationStatus = "not_evaluated" | "draft" | "submitted";

export interface TeamMember {
  id: string;
  teamId: string;
  name: string;
  branch: string;
  isLead?: boolean;
}

export interface Team {
  id: string;
  teamCode: string; // e.g. "TM-AI-01"
  name: string;
  domain: string;
  caseStudy: string;
  canvaUrl?: string | null;
  driveUrl?: string | null;
  githubUrl?: string | null;
  members: TeamMember[];
  roundId?: string | null;
  createdAt?: string;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  maxMarks: number;
  sortOrder: number;
  roundId?: string;
}

export interface EvaluationScore {
  criterionId: string;
  marks: number;
}

export interface Evaluation {
  id: string;
  teamId: string;
  judgeId: string;
  status: EvaluationStatus;
  totalMarks: number;
  feedback?: string;
  updatedAt: string;
  submittedAt?: string | null;
}

export interface ActivityItem {
  id: string;
  teamId: string;
  teamCode: string;
  teamName: string;
  action: string;
  status: EvaluationStatus;
  timestamp: string;
}
