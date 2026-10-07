import {
  AuthRepository,
  TeamRepository,
  CriteriaRepository,
  EvaluationRepository,
  ActivityRepository,
  RealtimeService,
} from "./repositories";
import {
  MockAuthRepository,
  MockTeamRepository,
  MockCriteriaRepository,
  MockEvaluationRepository,
  MockActivityRepository,
  MockRealtimeService,
} from "./mock";
import {
  SupabaseAuthRepository,
  SupabaseTeamRepository,
  SupabaseCriteriaRepository,
  SupabaseEvaluationRepository,
  SupabaseActivityRepository,
  SupabaseRealtimeService,
} from "./supabase";

const isSupabase = process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";

export const authRepo: AuthRepository = isSupabase
  ? new SupabaseAuthRepository()
  : new MockAuthRepository();

export const teamRepo: TeamRepository = isSupabase
  ? new SupabaseTeamRepository()
  : new MockTeamRepository();

export const criteriaRepo: CriteriaRepository = isSupabase
  ? new SupabaseCriteriaRepository()
  : new MockCriteriaRepository();

export const evaluationRepo: EvaluationRepository = isSupabase
  ? new SupabaseEvaluationRepository()
  : new MockEvaluationRepository();

export const activityRepo: ActivityRepository = isSupabase
  ? new SupabaseActivityRepository()
  : new MockActivityRepository();

export const realtimeService: RealtimeService = isSupabase
  ? new SupabaseRealtimeService()
  : new MockRealtimeService();

export const dataRepositories = {
  auth: authRepo,
  teams: teamRepo,
  criteria: criteriaRepo,
  evaluations: evaluationRepo,
  activity: activityRepo,
  realtime: realtimeService,
};

export * from "./types";
export * from "./repositories";
