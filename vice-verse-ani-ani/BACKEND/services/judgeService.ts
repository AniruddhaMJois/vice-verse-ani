import { supabase, isSupabaseConfigured } from "../supabaseClient";
import { MOCK_ROUNDS, MOCK_TEAMS, MOCK_CRITERIA, MOCK_PROFILES } from "../mockData";
import {
  Round,
  Team,
  EvaluationCriteria,
  Evaluation,
  EvaluationScore,
  EvaluationStatus,
  Profile,
} from "@shared/types/database";

const LOCAL_STORAGE_EVALS_KEY = "viceverse_evaluations_store";
const LOCAL_STORAGE_SCORES_KEY = "viceverse_scores_store";

type StatusListener = (teamId: string, roundId: string, status: EvaluationStatus) => void;
const listeners: Set<StatusListener> = new Set();

export const subscribeToEvaluationUpdates = (listener: StatusListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (teamId: string, roundId: string, status: EvaluationStatus) => {
  listeners.forEach((fn) => fn(teamId, roundId, status));
};

// Helper for local mock evaluations
const getLocalEvaluations = (): Record<string, Evaluation> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVALS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLocalEvaluation = (evaluation: Evaluation) => {
  if (typeof window === "undefined") return;
  const evals = getLocalEvaluations();
  const key = `${evaluation.round_id}_${evaluation.team_id}_${evaluation.judge_id}`;
  evals[key] = evaluation;
  localStorage.setItem(LOCAL_STORAGE_EVALS_KEY, JSON.stringify(evals));
  notifyListeners(evaluation.team_id, evaluation.round_id, evaluation.status);
};

const getLocalScores = (): Record<string, EvaluationScore[]> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SCORES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLocalScores = (evaluationId: string, scores: EvaluationScore[]) => {
  if (typeof window === "undefined") return;
  const store = getLocalScores();
  store[evaluationId] = scores;
  localStorage.setItem(LOCAL_STORAGE_SCORES_KEY, JSON.stringify(store));
};

export const judgeService = {
  // Profiles / Authentication verification
  async verifyProfile(loginId: string, pin: string): Promise<Profile | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("login_id", loginId)
        .eq("pin", pin)
        .single();

      if (!error && data) {
        return data as Profile;
      }
    }

    // Mock fallback
    const matched = MOCK_PROFILES.find(
      (p) => p.login_id.toUpperCase() === loginId.toUpperCase() && p.pin === pin
    );
    return matched || null;
  },

  // Get all rounds
  async getRounds(): Promise<Round[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order("round_number", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Round[];
      }
    }
    return MOCK_ROUNDS;
  },

  // Get teams for a specific round
  async getTeams(roundId: string): Promise<Team[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("teams")
        .select("*, members:team_members(*)")
        .order("team_id", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Team[];
      }
    }
    return MOCK_TEAMS;
  },

  // Get evaluation criteria for a round
  async getCriteria(roundId: string): Promise<EvaluationCriteria[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("evaluation_criteria")
        .select("*")
        .eq("round_id", roundId)
        .order("display_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as EvaluationCriteria[];
      }
    }
    return MOCK_CRITERIA;
  },

  // Get evaluation for a team, round, and judge
  async getEvaluation(
    roundId: string,
    teamId: string,
    judgeId: string
  ): Promise<{ evaluation: Evaluation | null; scores: EvaluationScore[] }> {
    if (isSupabaseConfigured() && supabase) {
      const { data: evalData } = await supabase
        .from("evaluations")
        .select("*")
        .eq("round_id", roundId)
        .eq("team_id", teamId)
        .eq("judge_id", judgeId)
        .single();

      if (evalData) {
        const { data: scoresData } = await supabase
          .from("evaluation_scores")
          .select("*")
          .eq("evaluation_id", evalData.id);

        return {
          evaluation: evalData as Evaluation,
          scores: (scoresData || []) as EvaluationScore[],
        };
      }
    }

    // Local fallback
    const key = `${roundId}_${teamId}_${judgeId}`;
    const localEvals = getLocalEvaluations();
    const evaluation = localEvals[key] || null;
    const scores = evaluation ? getLocalScores()[evaluation.id] || [] : [];

    return { evaluation, scores };
  },

  // Get status map for all teams in a round for a judge
  async getTeamEvaluationStatuses(
    roundId: string,
    judgeId: string
  ): Promise<Record<string, EvaluationStatus>> {
    const statusMap: Record<string, EvaluationStatus> = {};

    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase
        .from("evaluations")
        .select("team_id, status")
        .eq("round_id", roundId)
        .eq("judge_id", judgeId);

      if (data) {
        data.forEach((row: { team_id: string; status: string }) => {
          statusMap[row.team_id] = row.status as EvaluationStatus;
        });
      }
      return statusMap;
    }

    // Fallback: check local storage
    const evals = getLocalEvaluations();
    Object.values(evals).forEach((ev) => {
      if (ev.round_id === roundId && ev.judge_id === judgeId) {
        statusMap[ev.team_id] = ev.status;
      }
    });

    return statusMap;
  },

  // Save draft or submit evaluation
  async saveEvaluation({
    roundId,
    teamId,
    judgeId,
    status,
    scores,
    feedback,
  }: {
    roundId: string;
    teamId: string;
    judgeId: string;
    status: "draft" | "submitted";
    scores: { criteria_id: string; score: number }[];
    feedback?: string;
  }): Promise<{ success: boolean; evaluation: Evaluation }> {
    const totalScore = scores.reduce((sum, item) => sum + item.score, 0);

    if (isSupabaseConfigured() && supabase) {
      // Upsert evaluation
      const { data: evalData, error: evalErr } = await supabase
        .from("evaluations")
        .upsert(
          {
            round_id: roundId,
            team_id: teamId,
            judge_id: judgeId,
            status,
            total_score: totalScore,
            feedback: feedback || null,
            submitted_at: status === "submitted" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "round_id,team_id,judge_id" }
        )
        .select()
        .single();

      if (!evalErr && evalData) {
        // Upsert scores
        const scoreRecords = scores.map((s) => ({
          evaluation_id: evalData.id,
          criteria_id: s.criteria_id,
          score: s.score,
          updated_at: new Date().toISOString(),
        }));

        await supabase
          .from("evaluation_scores")
          .upsert(scoreRecords, { onConflict: "evaluation_id,criteria_id" });

        notifyListeners(teamId, roundId, status);
        return { success: true, evaluation: evalData as Evaluation };
      }
    }

    // Local fallback
    const evaluationId = `eval-${roundId}-${teamId}-${judgeId}`;
    const evaluationRecord: Evaluation = {
      id: evaluationId,
      round_id: roundId,
      team_id: teamId,
      judge_id: judgeId,
      status,
      total_score: totalScore,
      feedback: feedback || null,
      submitted_at: status === "submitted" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const scoreRecords: EvaluationScore[] = scores.map((s) => ({
      id: `score-${evaluationId}-${s.criteria_id}`,
      evaluation_id: evaluationId,
      criteria_id: s.criteria_id,
      score: s.score,
      updated_at: new Date().toISOString(),
    }));

    saveLocalEvaluation(evaluationRecord);
    saveLocalScores(evaluationId, scoreRecords);

    return { success: true, evaluation: evaluationRecord };
  },
};
