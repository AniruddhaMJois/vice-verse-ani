import {
  AuthRepository,
  TeamRepository,
  CriteriaRepository,
  EvaluationRepository,
  ActivityRepository,
  RealtimeService,
  RealtimeCallback,
} from "../repositories";
import {
  Profile,
  Team,
  Criterion,
  Evaluation,
  EvaluationScore,
  EvaluationStatus,
  ActivityItem,
  UserRole,
} from "../types";

export class SupabaseAuthRepository implements AuthRepository {
  async signIn(loginId: string, pin: string, expectedRole?: UserRole): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    // TODO: Connect to Supabase Auth / Route Handler
    // Maps loginId to synthetic email (e.g. loginId.toLowerCase() + "@viceverse.local")
    return { success: false, error: "Supabase data source not configured. Fill .env.local" };
  }

  async signOut(): Promise<void> {
    // TODO: supabase.auth.signOut()
  }

  async getCurrentSession(): Promise<Profile | null> {
    // TODO: supabase.auth.getSession() + fetch profiles table
    return null;
  }
}

export class SupabaseTeamRepository implements TeamRepository {
  async getTeams(filter?: { domain?: string; judgeId?: string }): Promise<Team[]> {
    // TODO: supabase.from('teams').select('*, members:team_members(*)')
    return [];
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    // TODO: supabase.from('teams').select('*, members:team_members(*)').eq('id', teamId).single()
    return null;
  }

  async getDomains(): Promise<string[]> {
    return [];
  }
}

export class SupabaseCriteriaRepository implements CriteriaRepository {
  async getCriteria(): Promise<Criterion[]> {
    // TODO: supabase.from('criteria').select('*').order('sort_order', { ascending: true })
    return [];
  }
}

export class SupabaseEvaluationRepository implements EvaluationRepository {
  async getEvaluation(teamId: string, judgeId?: string): Promise<{ evaluation: Evaluation | null; scores: EvaluationScore[] }> {
    // TODO: supabase.from('evaluations').select('*, scores:evaluation_scores(*)').eq('team_id', teamId)
    return { evaluation: null, scores: [] };
  }

  async getStatusesForJudge(judgeId?: string): Promise<Record<string, EvaluationStatus>> {
    return {};
  }

  async getAllStatuses(): Promise<Record<string, EvaluationStatus>> {
    return {};
  }

  async saveEvaluation(params: {
    teamId: string;
    judgeId: string;
    status: EvaluationStatus;
    scores: EvaluationScore[];
    feedback?: string;
  }): Promise<{ success: boolean; evaluation?: Evaluation; error?: string }> {
    // TODO: supabase.from('evaluations').upsert(...)
    return { success: false, error: "Supabase not connected" };
  }
}

export class SupabaseActivityRepository implements ActivityRepository {
  async getRecentActivity(limit?: number): Promise<ActivityItem[]> {
    return [];
  }
}

export class SupabaseRealtimeService implements RealtimeService {
  subscribe(channel: string, callback: RealtimeCallback): () => void {
    // TODO: supabase.channel(channel).on('postgres_changes', ...).subscribe()
    return () => {};
  }

  emitUpdate(teamId: string, status: EvaluationStatus, judgeId?: string, totalMarks?: number): void {}
}
