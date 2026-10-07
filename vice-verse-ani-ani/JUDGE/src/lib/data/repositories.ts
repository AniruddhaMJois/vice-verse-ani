import {
  Profile,
  Team,
  Criterion,
  Evaluation,
  EvaluationScore,
  EvaluationStatus,
  ActivityItem,
  UserRole,
} from "./types";

export interface AuthRepository {
  signIn(loginId: string, pin: string, expectedRole?: UserRole): Promise<{ success: boolean; profile?: Profile; error?: string }>;
  signOut(): Promise<void>;
  getCurrentSession(): Promise<Profile | null>;
}

export interface TeamRepository {
  getTeams(filter?: { domain?: string; judgeId?: string }): Promise<Team[]>;
  getTeamById(teamId: string): Promise<Team | null>;
  getDomains(): Promise<string[]>;
}

export interface CriteriaRepository {
  getCriteria(): Promise<Criterion[]>;
}

export interface EvaluationRepository {
  getEvaluation(teamId: string, judgeId?: string): Promise<{ evaluation: Evaluation | null; scores: EvaluationScore[] }>;
  getStatusesForJudge(judgeId?: string): Promise<Record<string, EvaluationStatus>>;
  getAllStatuses(): Promise<Record<string, EvaluationStatus>>;
  saveEvaluation(params: {
    teamId: string;
    judgeId: string;
    status: EvaluationStatus;
    scores: EvaluationScore[];
    feedback?: string;
  }): Promise<{ success: boolean; evaluation?: Evaluation; error?: string }>;
}

export interface ActivityRepository {
  getRecentActivity(limit?: number): Promise<ActivityItem[]>;
}

export type RealtimeCallback = (payload: {
  teamId: string;
  status: EvaluationStatus;
  judgeId?: string;
  totalMarks?: number;
}) => void;

export interface RealtimeService {
  subscribe(channel: string, callback: RealtimeCallback): () => void;
  emitUpdate(teamId: string, status: EvaluationStatus, judgeId?: string, totalMarks?: number): void;
}
