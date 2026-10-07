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
import { getSupabaseClient, isSupabaseConfigured } from "../../supabase/client";

// ============================================================================
// 1. SUPABASE AUTH REPOSITORY (Login ID + PIN System)
// ============================================================================
export class SupabaseAuthRepository implements AuthRepository {
  async signIn(
    loginId: string,
    pin: string,
    expectedRole?: UserRole
  ): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: "Supabase connection not initialized. Check your environment variables." };
    }

    const cleanId = loginId.trim().toUpperCase();
    const cleanPin = pin.trim();

    try {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .ilike("login_id", cleanId)
        .maybeSingle();

      if (error || !data) {
        return { success: false, error: "Invalid Login ID or PIN" };
      }

      // Check PIN if present in profiles table
      if (data.pin && data.pin !== cleanPin) {
        return { success: false, error: "Invalid Login ID or PIN" };
      }

      // Check expected role
      if (expectedRole && data.role !== expectedRole) {
        return { success: false, error: `Unauthorized: User is not a ${expectedRole}` };
      }

      const profile: Profile = {
        id: data.id,
        loginId: data.login_id,
        name: data.name || data.full_name || data.login_id,
        role: data.role as UserRole,
        email: data.email || undefined,
        avatarUrl: data.avatar_url || undefined,
        createdAt: data.created_at || undefined,
      };

      return { success: true, profile };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to authenticate with database." };
    }
  }

  async signOut(): Promise<void> {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {}
    }
  }

  async getCurrentSession(): Promise<Profile | null> {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("viceverse_auth_profile");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}

// ============================================================================
// 2. SUPABASE TEAM REPOSITORY
// ============================================================================
export class SupabaseTeamRepository implements TeamRepository {
  async getTeams(filter?: { domain?: string; judgeId?: string }): Promise<Team[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      let assignedTeamIds: string[] | null = null;

      // Check if judge has specific team assignments
      if (filter?.judgeId) {
        const { data: assignments } = await client
          .from("judge_team_assignments")
          .select("team_id")
          .eq("judge_id", filter.judgeId);

        if (assignments && assignments.length > 0) {
          assignedTeamIds = assignments.map((a: any) => a.team_id);
        }
      }

      let query = client
        .from("teams")
        .select("*, members:team_members(*)")
        .order("created_at", { ascending: true });

      if (assignedTeamIds && assignedTeamIds.length > 0) {
        query = query.in("id", assignedTeamIds);
      }

      if (filter?.domain && filter.domain !== "ALL") {
        query = query.eq("domain", filter.domain);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row: any) => this.mapTeamRow(row));
    } catch {
      return [];
    }
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      // Allow fetching by primary UUID or teamCode
      const { data, error } = await client
        .from("teams")
        .select("*, members:team_members(*)")
        .or(`id.eq.${teamId},team_code.eq.${teamId},team_id.eq.${teamId}`)
        .maybeSingle();

      if (error || !data) return null;
      return this.mapTeamRow(data);
    } catch {
      return null;
    }
  }

  async getDomains(): Promise<string[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      const { data } = await client.from("teams").select("domain");
      if (!data) return [];
      const domainSet = new Set<string>();
      data.forEach((row: { domain?: string }) => {
        if (row.domain) domainSet.add(row.domain);
      });
      return Array.from(domainSet);
    } catch {
      return [];
    }
  }

  private mapTeamRow(row: any): Team {
    return {
      id: row.id,
      teamCode: row.team_code || row.team_id || "",
      name: row.name || row.team_name || "",
      domain: row.domain || "",
      caseStudy: row.case_study || "",
      canvaUrl: row.canva_url || row.canva_link || null,
      driveUrl: row.drive_url || row.drive_link || null,
      githubUrl: row.github_url || null,
      roundId: row.round_id || null,
      createdAt: row.created_at,
      members: (row.members || []).map((m: any) => ({
        id: m.id,
        teamId: m.team_id || row.id,
        name: m.name || m.member_name || "",
        branch: m.branch || "",
        isLead: Boolean(m.is_lead),
      })),
    };
  }
}

// ============================================================================
// 3. SUPABASE CRITERIA REPOSITORY
// ============================================================================
export class SupabaseCriteriaRepository implements CriteriaRepository {
  async getCriteria(): Promise<Criterion[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      // Try 'criteria' table first
      const { data, error } = await client
        .from("criteria")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name || row.criteria_name || "",
          description: row.description || "",
          maxMarks: Number(row.max_marks || row.maxMarks || 25),
          sortOrder: Number(row.sort_order || row.display_order || 1),
          roundId: row.round_id || undefined,
        }));
      }

      // Fallback to 'evaluation_criteria' if used in older schema
      const { data: fallbackData } = await client
        .from("evaluation_criteria")
        .select("*")
        .order("display_order", { ascending: true });

      if (fallbackData && fallbackData.length > 0) {
        return fallbackData.map((row: any) => ({
          id: row.id,
          name: row.criteria_name || row.name || "",
          description: row.description || "",
          maxMarks: Number(row.max_marks || 25),
          sortOrder: Number(row.display_order || 1),
          roundId: row.round_id || undefined,
        }));
      }

      return [];
    } catch {
      return [];
    }
  }
}

// ============================================================================
// 4. SUPABASE EVALUATION REPOSITORY
// ============================================================================
export class SupabaseEvaluationRepository implements EvaluationRepository {
  async getEvaluation(
    teamId: string,
    judgeId?: string
  ): Promise<{ evaluation: Evaluation | null; scores: EvaluationScore[] }> {
    const client = getSupabaseClient();
    if (!client) return { evaluation: null, scores: [] };

    try {
      let query = client.from("evaluations").select("*").eq("team_id", teamId);
      if (judgeId) {
        query = query.eq("judge_id", judgeId);
      }

      const { data: evalData, error: evalErr } = await query.maybeSingle();
      if (evalErr || !evalData) {
        return { evaluation: null, scores: [] };
      }

      const { data: scoresData } = await client
        .from("evaluation_scores")
        .select("*")
        .eq("evaluation_id", evalData.id);

      const evaluation: Evaluation = {
        id: evalData.id,
        teamId: evalData.team_id,
        judgeId: evalData.judge_id,
        status: evalData.status as EvaluationStatus,
        totalMarks: Number(evalData.total_marks || evalData.total_score || 0),
        feedback: evalData.feedback || "",
        updatedAt: evalData.updated_at || new Date().toISOString(),
        submittedAt: evalData.submitted_at || null,
      };

      const scores: EvaluationScore[] = (scoresData || []).map((s: any) => ({
        criterionId: s.criterion_id || s.criteria_id,
        marks: Number(s.marks || s.score || 0),
      }));

      return { evaluation, scores };
    } catch {
      return { evaluation: null, scores: [] };
    }
  }

  async getStatusesForJudge(judgeId?: string): Promise<Record<string, EvaluationStatus>> {
    const statusMap: Record<string, EvaluationStatus> = {};
    const client = getSupabaseClient();
    if (!client) return statusMap;

    try {
      let query = client.from("evaluations").select("team_id, status");
      if (judgeId) {
        query = query.eq("judge_id", judgeId);
      }

      const { data } = await query;
      if (data) {
        data.forEach((row: { team_id: string; status: string }) => {
          statusMap[row.team_id] = row.status as EvaluationStatus;
        });
      }
      return statusMap;
    } catch {
      return statusMap;
    }
  }

  async getAllStatuses(): Promise<Record<string, EvaluationStatus>> {
    const statusMap: Record<string, EvaluationStatus> = {};
    const client = getSupabaseClient();
    if (!client) return statusMap;

    try {
      const { data } = await client.from("evaluations").select("team_id, status");
      if (data) {
        data.forEach((row: { team_id: string; status: string }) => {
          const current = statusMap[row.team_id];
          if (row.status === "submitted") {
            statusMap[row.team_id] = "submitted";
          } else if (row.status === "draft" && current !== "submitted") {
            statusMap[row.team_id] = "draft";
          } else if (!current) {
            statusMap[row.team_id] = row.status as EvaluationStatus;
          }
        });
      }
      return statusMap;
    } catch {
      return statusMap;
    }
  }

  async saveEvaluation(params: {
    teamId: string;
    judgeId: string;
    status: EvaluationStatus;
    scores: EvaluationScore[];
    feedback?: string;
  }): Promise<{ success: boolean; evaluation?: Evaluation; error?: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: "Database client is not connected." };
    }

    const totalMarks = params.scores.reduce((sum, item) => sum + Number(item.marks || 0), 0);

    try {
      // 1. Upsert evaluation record
      const { data: evalData, error: evalErr } = await client
        .from("evaluations")
        .upsert(
          {
            team_id: params.teamId,
            judge_id: params.judgeId,
            status: params.status,
            total_marks: totalMarks,
            feedback: params.feedback || null,
            updated_at: new Date().toISOString(),
            submitted_at: params.status === "submitted" ? new Date().toISOString() : null,
          },
          { onConflict: "team_id,judge_id" }
        )
        .select()
        .single();

      if (evalErr || !evalData) {
        return { success: false, error: evalErr?.message || "Failed to save evaluation." };
      }

      // 2. Upsert scores
      if (params.scores.length > 0) {
        const scoreRecords = params.scores.map((s) => ({
          evaluation_id: evalData.id,
          criterion_id: s.criterionId,
          marks: Number(s.marks || 0),
        }));

        const { error: scoresErr } = await client
          .from("evaluation_scores")
          .upsert(scoreRecords, { onConflict: "evaluation_id,criterion_id" });

        if (scoresErr) {
          console.warn("Failed to upsert individual criterion scores:", scoresErr.message);
        }
      }

      const evaluation: Evaluation = {
        id: evalData.id,
        teamId: evalData.team_id,
        judgeId: evalData.judge_id,
        status: evalData.status as EvaluationStatus,
        totalMarks: Number(evalData.total_marks || totalMarks),
        feedback: evalData.feedback || "",
        updatedAt: evalData.updated_at,
        submittedAt: evalData.submitted_at,
      };

      return { success: true, evaluation };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to save evaluation." };
    }
  }
}

// ============================================================================
// 5. SUPABASE ACTIVITY REPOSITORY
// ============================================================================
export class SupabaseActivityRepository implements ActivityRepository {
  async getRecentActivity(limit = 10): Promise<ActivityItem[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from("evaluations")
        .select(`
          id,
          team_id,
          status,
          updated_at,
          teams:team_id (
            id,
            team_code,
            name
          )
        `)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (error || !data) return [];

      return data.map((row: any) => {
        const teamObj = Array.isArray(row.teams) ? row.teams[0] : row.teams;
        const actionLabel =
          row.status === "submitted"
            ? "Evaluation Submitted"
            : row.status === "draft"
            ? "Draft Score Saved"
            : "Assigned";

        return {
          id: `act-${row.id}`,
          teamId: row.team_id,
          teamCode: teamObj?.team_code || "TM-XX",
          teamName: teamObj?.name || "Team",
          action: actionLabel,
          status: row.status as EvaluationStatus,
          timestamp: this.formatRelativeTime(row.updated_at),
        };
      });
    } catch {
      return [];
    }
  }

  private formatRelativeTime(dateStr: string): string {
    if (!dateStr) return "Just now";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}

// ============================================================================
// 6. SUPABASE REALTIME SERVICE
// ============================================================================
export class SupabaseRealtimeService implements RealtimeService {
  private listeners: Set<RealtimeCallback> = new Set();
  private channelInstance: any = null;

  subscribe(channel: string, callback: RealtimeCallback): () => void {
    this.listeners.add(callback);

    const client = getSupabaseClient();
    if (client && !this.channelInstance) {
      this.channelInstance = client
        .channel("viceverse_realtime_evaluations")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "evaluations",
          },
          (payload: any) => {
            const row = payload.new || payload.old;
            if (row) {
              const status = row.status as EvaluationStatus;
              const teamId = row.team_id;
              const judgeId = row.judge_id;
              const totalMarks = Number(row.total_marks || row.total_score || 0);

              this.listeners.forEach((fn) => {
                try {
                  fn({ teamId, status, judgeId, totalMarks });
                } catch {}
              });
            }
          }
        )
        .subscribe();
    }

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0 && this.channelInstance && client) {
        client.removeChannel(this.channelInstance);
        this.channelInstance = null;
      }
    };
  }

  emitUpdate(teamId: string, status: EvaluationStatus, judgeId?: string, totalMarks?: number): void {
    this.listeners.forEach((fn) => {
      try {
        fn({ teamId, status, judgeId, totalMarks });
      } catch {}
    });
  }
}
