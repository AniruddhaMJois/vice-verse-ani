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
import {
  AuthRepository,
  TeamRepository,
  CriteriaRepository,
  EvaluationRepository,
  ActivityRepository,
  RealtimeService,
  RealtimeCallback,
} from "../repositories";

// Seed Profiles
const MOCK_PROFILES: Profile[] = [
  {
    id: "judge-001",
    loginId: "JDG10001",
    name: "Dr. Alistair Vance",
    role: "judge",
    email: "alistair.vance@viceverse.local",
  },
  {
    id: "judge-002",
    loginId: "JDG10002",
    name: "Dr. Elena Rostova",
    role: "judge",
    email: "elena.rostova@viceverse.local",
  },
  {
    id: "mentor-001",
    loginId: "MNR20001",
    name: "Prof. Marcus Vance",
    role: "mentor",
    email: "marcus.vance@viceverse.local",
  },
  {
    id: "mentor-002",
    loginId: "MNR20002",
    name: "Kaelen O'Connor",
    role: "mentor",
    email: "kaelen.oc@viceverse.local",
  },
];

// Seed Teams for Final Round
const MOCK_TEAMS: Team[] = [
  {
    id: "team-1",
    teamCode: "TM-AI-01",
    name: "CyberSphere Autonomous Agents",
    domain: "AI & ML",
    caseStudy: "Decentralized Swarm Consensus and Realtime Low-Latency Telemetry under Network Adversity",
    canvaUrl: "https://canva.com/design/sample-cybersphere",
    driveUrl: "https://drive.google.com/drive/sample-cybersphere",
    githubUrl: "https://github.com/viceverse-26/cybersphere-swarm",
    members: [
      { id: "m1", teamId: "team-1", name: "Aarav Sharma", branch: "AIML", isLead: true },
      { id: "m2", teamId: "team-1", name: "Priya Nair", branch: "CSE", isLead: false },
      { id: "m3", teamId: "team-1", name: "Rohan Patel", branch: "ECE", isLead: false },
    ],
  },
  {
    id: "team-2",
    teamCode: "TM-CY-02",
    name: "Nexus Zero-Knowledge Rollup",
    domain: "Cybersecurity",
    caseStudy: "Sub-Second Recursive STARK Verification for High-Throughput Layer-2 Settlement",
    canvaUrl: "https://canva.com/design/sample-nexus",
    driveUrl: "https://drive.google.com/drive/sample-nexus",
    githubUrl: "https://github.com/viceverse-26/nexus-zk-rollup",
    members: [
      { id: "m4", teamId: "team-2", name: "Vikram Malhotra", branch: "CSE", isLead: true },
      { id: "m5", teamId: "team-2", name: "Ananya Iyer", branch: "ISE", isLead: false },
    ],
  },
  {
    id: "team-3",
    teamCode: "TM-WB-03",
    name: "Aegis Threat Sentinel",
    domain: "Web3 & Cloud",
    caseStudy: "Autonomous eBPF-Powered Kernel Anomaly Detection and Zero-Day Attack Mitigation",
    canvaUrl: "https://canva.com/design/sample-aegis",
    driveUrl: "https://drive.google.com/drive/sample-aegis",
    githubUrl: "https://github.com/viceverse-26/aegis-sentinel",
    members: [
      { id: "m6", teamId: "team-3", name: "Zoya Khan", branch: "Cybersec", isLead: true },
      { id: "m7", teamId: "team-3", name: "Devendra Das", branch: "AIML", isLead: false },
      { id: "m8", teamId: "team-3", name: "Neha Gupta", branch: "CSE", isLead: false },
    ],
  },
  {
    id: "team-4",
    teamCode: "TM-HL-04",
    name: "NeuroPulse Biosensing",
    domain: "HealthTech",
    caseStudy: "Edge-Inference EEG Neural Decoding for Non-Invasive Motor-Impaired Mobility Assistance",
    canvaUrl: "https://canva.com/design/sample-neuropulse",
    driveUrl: "https://drive.google.com/drive/sample-neuropulse",
    githubUrl: "https://github.com/viceverse-26/neuropulse-eeg",
    members: [
      { id: "m9", teamId: "team-4", name: "Kabir Sen", branch: "Biomedical", isLead: true },
      { id: "m10", teamId: "team-4", name: "Sneha Reddy", branch: "ECE", isLead: false },
    ],
  },
  {
    id: "team-5",
    teamCode: "TM-IO-05",
    name: "Vortex Spatial Audio",
    domain: "IoT & Robotics",
    caseStudy: "Realtime Ray-Traced Binaural Spatial Acoustic Rendering for AR Collaboration Environments",
    canvaUrl: "https://canva.com/design/sample-vortex",
    driveUrl: "https://drive.google.com/drive/sample-vortex",
    githubUrl: "https://github.com/viceverse-26/vortex-audio",
    members: [
      { id: "m11", teamId: "team-5", name: "Tariq Mansoor", branch: "ECE", isLead: true },
      { id: "m12", teamId: "team-5", name: "Meera Joshi", branch: "IT", isLead: false },
    ],
  },
];

// Seed Criteria for Final Round (100 Marks scale)
const MOCK_CRITERIA: Criterion[] = [
  {
    id: "crit-1",
    name: "Technical Architecture & Execution",
    description: "Code modularity, performance benchmarks, deployment reliability, and structural elegance.",
    maxMarks: 30,
    sortOrder: 1,
  },
  {
    id: "crit-2",
    name: "Algorithmic Rigor & Innovation",
    description: "Novelty of approach, depth of problem-solving complexity, and technical originality.",
    maxMarks: 25,
    sortOrder: 2,
  },
  {
    id: "crit-3",
    name: "Product Viability & Market Impact",
    description: "Real-world applicability, target user fit, scalability economics, and competitive edge.",
    maxMarks: 25,
    sortOrder: 3,
  },
  {
    id: "crit-4",
    name: "Defense & Presentation Efficacy",
    description: "Clarity of communication, live demonstration defense, and responses during Q&A.",
    maxMarks: 20,
    sortOrder: 4,
  },
];

// In-memory state
let inMemoryEvaluations: Record<string, Evaluation> = {
  "team-1_judge-001": {
    id: "eval-1",
    teamId: "team-1",
    judgeId: "judge-001",
    status: "submitted",
    totalMarks: 88,
    feedback: "Exceptional architecture and robust distributed consensus benchmark results.",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  "team-2_judge-001": {
    id: "eval-2",
    teamId: "team-2",
    judgeId: "judge-001",
    status: "draft",
    totalMarks: 74,
    feedback: "High-grade ZK proof pipeline; need to verify gas efficiency metrics in final pitch.",
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
};

let inMemoryScores: Record<string, EvaluationScore[]> = {
  "eval-1": [
    { criterionId: "crit-1", marks: 27 },
    { criterionId: "crit-2", marks: 23 },
    { criterionId: "crit-3", marks: 21 },
    { criterionId: "crit-4", marks: 17 },
  ],
  "eval-2": [
    { criterionId: "crit-1", marks: 24 },
    { criterionId: "crit-2", marks: 20 },
    { criterionId: "crit-3", marks: 18 },
    { criterionId: "crit-4", marks: 12 },
  ],
};

let inMemoryActivities: ActivityItem[] = [
  {
    id: "act-1",
    teamId: "team-1",
    teamCode: "TM-AI-01",
    teamName: "CyberSphere Autonomous Agents",
    action: "Evaluation Submitted",
    status: "submitted",
    timestamp: "10m ago",
  },
  {
    id: "act-2",
    teamId: "team-2",
    teamCode: "TM-CY-02",
    teamName: "Nexus Zero-Knowledge Rollup",
    action: "Draft Score Saved",
    status: "draft",
    timestamp: "24m ago",
  },
  {
    id: "act-3",
    teamId: "team-3",
    teamCode: "TM-WB-03",
    teamName: "Aegis Threat Sentinel",
    action: "Assigned to Jury Panel",
    status: "not_evaluated",
    timestamp: "45m ago",
  },
  {
    id: "act-4",
    teamId: "team-4",
    teamCode: "TM-HL-04",
    teamName: "NeuroPulse Biosensing",
    action: "Dossier Validated",
    status: "not_evaluated",
    timestamp: "1h ago",
  },
  {
    id: "act-5",
    teamId: "team-5",
    teamCode: "TM-IO-05",
    teamName: "Vortex Spatial Audio",
    action: "Deliverables Synced",
    status: "not_evaluated",
    timestamp: "2h ago",
  },
];

// Mock Implementations
export class MockAuthRepository implements AuthRepository {
  async signIn(
    loginId: string,
    pin: string,
    expectedRole?: UserRole
  ): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    await new Promise((r) => setTimeout(r, 200));

    const profile = MOCK_PROFILES.find(
      (p) => p.loginId.toUpperCase() === loginId.toUpperCase()
    );

    if (!profile) {
      return { success: false, error: "Invalid ID or PIN" };
    }

    if (expectedRole && profile.role !== expectedRole) {
      return { success: false, error: "Invalid ID or PIN" };
    }

    return { success: true, profile };
  }

  async signOut(): Promise<void> {
    // In-memory logout
  }

  async getCurrentSession(): Promise<Profile | null> {
    return MOCK_PROFILES[0];
  }
}

export class MockTeamRepository implements TeamRepository {
  async getTeams(filter?: { domain?: string; judgeId?: string }): Promise<Team[]> {
    await new Promise((r) => setTimeout(r, 150));
    let result = [...MOCK_TEAMS];
    if (filter?.domain) {
      result = result.filter((t) => t.domain === filter.domain);
    }
    return result;
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    await new Promise((r) => setTimeout(r, 100));
    return MOCK_TEAMS.find((t) => t.id === teamId) || null;
  }

  async getDomains(): Promise<string[]> {
    return Array.from(new Set(MOCK_TEAMS.map((t) => t.domain)));
  }
}

export class MockCriteriaRepository implements CriteriaRepository {
  async getCriteria(): Promise<Criterion[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...MOCK_CRITERIA].sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export class MockEvaluationRepository implements EvaluationRepository {
  async getEvaluation(
    teamId: string,
    judgeId = "judge-001"
  ): Promise<{ evaluation: Evaluation | null; scores: EvaluationScore[] }> {
    await new Promise((r) => setTimeout(r, 120));
    const key = `${teamId}_${judgeId}`;
    const evaluation = inMemoryEvaluations[key] || null;
    const scores = evaluation ? inMemoryScores[evaluation.id] || [] : [];
    return { evaluation, scores };
  }

  async getStatusesForJudge(judgeId = "judge-001"): Promise<Record<string, EvaluationStatus>> {
    const statuses: Record<string, EvaluationStatus> = {};
    MOCK_TEAMS.forEach((t) => {
      const key = `${t.id}_${judgeId}`;
      statuses[t.id] = inMemoryEvaluations[key]?.status || "not_evaluated";
    });
    return statuses;
  }

  async getAllStatuses(): Promise<Record<string, EvaluationStatus>> {
    const statuses: Record<string, EvaluationStatus> = {};
    MOCK_TEAMS.forEach((t) => {
      // Find highest status across judges
      const evals = Object.values(inMemoryEvaluations).filter((e) => e.teamId === t.id);
      if (evals.some((e) => e.status === "submitted")) {
        statuses[t.id] = "submitted";
      } else if (evals.some((e) => e.status === "draft")) {
        statuses[t.id] = "draft";
      } else {
        statuses[t.id] = "not_evaluated";
      }
    });
    return statuses;
  }

  async saveEvaluation(params: {
    teamId: string;
    judgeId: string;
    status: EvaluationStatus;
    scores: EvaluationScore[];
    feedback?: string;
  }): Promise<{ success: boolean; evaluation?: Evaluation; error?: string }> {
    await new Promise((r) => setTimeout(r, 200));

    const total = params.scores.reduce((sum, s) => sum + s.marks, 0);
    const key = `${params.teamId}_${params.judgeId}`;
    const evalId = inMemoryEvaluations[key]?.id || `eval-${Date.now()}`;

    const updatedEval: Evaluation = {
      id: evalId,
      teamId: params.teamId,
      judgeId: params.judgeId,
      status: params.status,
      totalMarks: total,
      feedback: params.feedback,
      updatedAt: new Date().toISOString(),
      submittedAt: params.status === "submitted" ? new Date().toISOString() : inMemoryEvaluations[key]?.submittedAt,
    };

    inMemoryEvaluations[key] = updatedEval;
    inMemoryScores[evalId] = params.scores;

    // Push activity
    const team = MOCK_TEAMS.find((t) => t.id === params.teamId);
    if (team) {
      inMemoryActivities.unshift({
        id: `act-${Date.now()}`,
        teamId: team.id,
        teamCode: team.teamCode,
        teamName: team.name,
        action: params.status === "submitted" ? "Evaluation Finalized" : "Draft Score Updated",
        status: params.status,
        timestamp: "Just now",
      });
    }

    mockRealtimeService.emitUpdate(params.teamId, params.status, params.judgeId, total);
    return { success: true, evaluation: updatedEval };
  }
}

export class MockActivityRepository implements ActivityRepository {
  async getRecentActivity(limit?: number): Promise<ActivityItem[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (typeof limit === "number" && limit > 0) {
      return inMemoryActivities.slice(0, limit);
    }
    return [...inMemoryActivities];
  }
}

export class MockRealtimeService implements RealtimeService {
  private listeners: Set<RealtimeCallback> = new Set();

  subscribe(channel: string, callback: RealtimeCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  emitUpdate(teamId: string, status: EvaluationStatus, judgeId?: string, totalMarks?: number): void {
    this.listeners.forEach((cb) => {
      try {
        cb({ teamId, status, judgeId, totalMarks });
      } catch {}
    });
  }
}

const mockRealtimeService = new MockRealtimeService();
