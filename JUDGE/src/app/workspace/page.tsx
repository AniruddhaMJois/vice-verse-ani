"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { judgeService, subscribeToEvaluationUpdates } from "@backend/services/judgeService";
import { Team, EvaluationStatus } from "@shared/types/database";
import {
  Users,
  ClipboardCheck,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  CircleDashed,
  Clock,
  CheckCircle2,
  FileText,
  FileCode,
  Award,
  Star,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  Folder,
  Eye,
} from "lucide-react";

export default function WorkspacePage() {
  const router = useRouter();
  const { user, isJudge, isMentor, isLoading } = useAuth();

  // Tab State: "teams" (Team Details) or "evaluate" (Evaluate)
  const [activeTab, setActiveTab] = useState<"teams" | "evaluate">("teams");

  // Data States
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, EvaluationStatus>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Load Teams & Statuses from Supabase
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsDataLoading(true);
      const rounds = await judgeService.getRounds();
      const roundId = rounds.length > 0 ? rounds[0].id : "round-1";

      const [teamsData, statuses] = await Promise.all([
        judgeService.getTeams(roundId),
        judgeService.getTeamEvaluationStatuses(roundId, user.id),
      ]);

      setTeams(teamsData);
      setStatusMap(statuses);
      if (teamsData.length > 0) {
        setSelectedTeam(teamsData[0]);
      }
      setIsDataLoading(false);
    };

    loadData();

    // Subscribe to realtime evaluation status updates
    const unsubscribe = subscribeToEvaluationUpdates((teamId, _roundId, status) => {
      setStatusMap((prev) => ({ ...prev, [teamId]: status }));
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#a594c7] font-mono tracking-widest uppercase">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  // Filtered teams list
  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.team_name.toLowerCase().includes(q) ||
      t.team_id.toLowerCase().includes(q) ||
      t.domain.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070512] bg-vice-grid flex flex-col">
      {/* MOBILE TOP SEGMENTED TAB BAR (<1024px) */}
      <div className="lg:hidden p-3 border-b border-[#251749] bg-[#0c0821]/95 sticky top-14 sm:top-16 z-30 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          {/* Tab 1: Team Details */}
          <button
            onClick={() => setActiveTab("teams")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "teams"
                ? "vice-tab-active"
                : "bg-[#140e2e] text-[#a594c7] border border-[#2b1853]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team Details</span>
          </button>

          {/* Tab 2: Evaluate */}
          <button
            onClick={() => {
              if (isJudge) setActiveTab("evaluate");
            }}
            disabled={isMentor}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isMentor
                ? "opacity-40 cursor-not-allowed bg-[#100b24] text-slate-500 border border-slate-800"
                : activeTab === "evaluate"
                ? "vice-tab-active"
                : "bg-[#140e2e] text-[#a594c7] border border-[#2b1853]"
            }`}
          >
            {isMentor ? <Lock className="w-3.5 h-3.5" /> : <ClipboardCheck className="w-4 h-4" />}
            <span>Evaluate</span>
            {isMentor && <span className="text-[10px] text-slate-500">(Locked)</span>}
          </button>
        </div>
      </div>

      {/* WORKSPACE BODY */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 gap-6">
        {/* ==================================================================== */}
        {/* LAPTOP LEFT SIDEBAR MENU (>=1024px) - GTA VI VICE CITY STYLE */}
        {/* ==================================================================== */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 vice-card rounded-2xl p-5 border border-[#251749] h-fit sticky top-20">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#251749]">
            <Sparkles className="w-4 h-4 text-[#ff2a85]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#a594c7]">
              WORKSPACE MENU
            </span>
          </div>

          <nav className="space-y-2">
            {/* Tab 1: Team Details (Judge & Mentor) */}
            <button
              onClick={() => setActiveTab("teams")}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                activeTab === "teams"
                  ? "vice-tab-active"
                  : "bg-[#120d2e]/60 text-[#a594c7] hover:text-white hover:bg-[#1a123f] border border-[#251749]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Team Details</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Tab 2: Evaluate (Judge Only; Greyed & Disabled for Mentor) */}
            <button
              onClick={() => {
                if (isJudge) setActiveTab("evaluate");
              }}
              disabled={isMentor}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                isMentor
                  ? "opacity-40 cursor-not-allowed bg-slate-950/40 text-slate-500 border border-slate-800/80"
                  : activeTab === "evaluate"
                  ? "vice-tab-active"
                  : "bg-[#120d2e]/60 text-[#a594c7] hover:text-white hover:bg-[#1a123f] border border-[#251749]"
              }`}
              title={isMentor ? "Evaluation scoring restricted to official jury panels" : ""}
            >
              <div className="flex items-center gap-2.5">
                {isMentor ? <Lock className="w-4 h-4 text-slate-500" /> : <ClipboardCheck className="w-4 h-4" />}
                <span>Evaluate</span>
              </div>
              {isMentor ? (
                <span className="text-[10px] font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">
                  Locked
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              )}
            </button>
          </nav>

          {/* Mentor notice banner inside sidebar */}
          {isMentor && (
            <div className="mt-6 p-3 rounded-xl bg-[#0e0a24] border border-[#251749] text-[11px] text-[#8e7da8] space-y-1">
              <div className="font-bold text-[#00f0ff] flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Observer Mode</span>
              </div>
              <p className="leading-relaxed">
                Mentors have read-only access to team details. Scoring is restricted to judges.
              </p>
            </div>
          )}
        </aside>

        {/* ==================================================================== */}
        {/* MAIN CONTENT AREA */}
        {/* ==================================================================== */}
        <main className="flex-1 w-full min-w-0">
          {/* TAB 1: TEAM DETAILS (COMMON FOR JUDGE & MENTOR) */}
          {activeTab === "teams" && (
            <div className="space-y-5">
              {/* Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#251749]">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#ff2a85]" />
                    <span>Assigned Teams &bull; Dossier</span>
                  </h2>
                  <p className="text-xs text-[#a594c7] mt-0.5">
                    Select a team to inspect their roster, selected case study, and presentation links.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#7b6999] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search team or ID..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0e0a24] border border-[#2b1853] text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff2a85] placeholder:text-[#6a5885]"
                  />
                </div>
              </div>

              {/* Master-Detail Split on Laptop (>=1024px), Single Column on Mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Team Selector List */}
                <div className="lg:col-span-4 space-y-2.5">
                  <div className="text-[11px] font-mono font-bold text-[#7b6999] uppercase tracking-wider mb-1">
                    Select Team ({filteredTeams.length})
                  </div>
                  {filteredTeams.map((team) => {
                    const isSelected = selectedTeam?.id === team.id;
                    return (
                      <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team)}
                        className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-[#1c123d] border-[#ff2a85] shadow-[0_0_15px_rgba(255,42,133,0.2)]"
                            : "bg-[#0e0a24]/90 border-[#231545] hover:border-[#38236b] hover:bg-[#150f33]"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-[#070512] text-[#ff2a85] border border-[#ff2a85]/40">
                              {team.team_id}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-white truncate">
                            {team.team_name}
                          </div>
                          <div className="text-[10px] text-[#a594c7] truncate mt-0.5">
                            {team.domain}
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isSelected ? "text-[#ff2a85] translate-x-1" : "text-[#5a4875]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Team Inspector Card */}
                <div className="lg:col-span-8 vice-card rounded-2xl p-5 sm:p-7 border border-[#251749]">
                  {selectedTeam ? (
                    <div className="space-y-6">
                      {/* Team Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#251749]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs sm:text-sm font-black text-[#ff2a85] px-3 py-1 rounded-lg bg-[#ff2a85]/15 border border-[#ff2a85]/40">
                            {selectedTeam.team_id}
                          </span>
                          <div>
                            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                              {selectedTeam.team_name}
                            </h3>
                            <p className="text-xs text-[#00f0ff] font-medium">{selectedTeam.domain}</p>
                          </div>
                        </div>
                      </div>

                      {/* Selected Case Study Hero Card */}
                      <div className="p-4 sm:p-5 rounded-xl bg-[#09061c] border border-[#301c5c] relative overflow-hidden">
                        <div className="text-[11px] font-bold text-[#ff2a85] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>Selected Case Study</span>
                        </div>
                        <div className="text-sm font-semibold text-white leading-relaxed">
                          &quot;{selectedTeam.case_study || "Case study not yet assigned"}&quot;
                        </div>
                      </div>

                      {/* Team Members & Academic Branches */}
                      <div>
                        <h4 className="text-xs font-bold text-[#a594c7] uppercase tracking-wider mb-3">
                          Team Members &amp; Branches
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {selectedTeam.members && selectedTeam.members.length > 0 ? (
                            selectedTeam.members.map((m) => (
                              <div
                                key={m.id}
                                className="p-3 rounded-xl bg-[#09061c] border border-[#231545] flex items-center gap-2.5"
                              >
                                <div className="w-7 h-7 rounded-lg bg-[#191138] border border-[#3b236e] flex items-center justify-center font-bold text-xs text-[#ff2a85] shrink-0">
                                  {m.member_name.charAt(0)}
                                </div>
                                <div className="truncate">
                                  <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                                    <span className="truncate">{m.member_name}</span>
                                    {m.is_lead && (
                                      <span className="text-[8px] px-1 rounded bg-[#ff2a85]/20 text-[#ff2a85] font-extrabold shrink-0">
                                        Lead
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-[#a594c7] font-mono mt-0.5">
                                    Branch: {m.branch}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-[#7b6999]">No members listed</div>
                          )}
                        </div>
                      </div>

                      {/* Deliverables: Canva PPT & Google Drive Prototype */}
                      <div>
                        <h4 className="text-xs font-bold text-[#a594c7] uppercase tracking-wider mb-3">
                          Project Deliverables
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {/* Canva PPT Link */}
                          <div className="p-4 rounded-xl bg-[#09061c] border border-[#231545] flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-[#00f0ff] flex items-center gap-1.5 uppercase tracking-wide">
                                  <FileText className="w-4 h-4" />
                                  Canva Slide Deck
                                </span>
                              </div>
                              <p className="text-xs text-[#8e7da8] mb-3">
                                {selectedTeam.canva_link
                                  ? "Presentation deck submitted for evaluation."
                                  : "No Canva presentation submitted"}
                              </p>
                            </div>

                            {selectedTeam.canva_link ? (
                              <a
                                href={selectedTeam.canva_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/40 px-3.5 py-2.5 rounded-xl transition-all"
                              >
                                <span>Open Canva Deck</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <div className="text-xs font-mono text-[#7b6999] py-1">
                                No Canva presentation submitted
                              </div>
                            )}
                          </div>

                          {/* Google Drive Link */}
                          <div className="p-4 rounded-xl bg-[#09061c] border border-[#231545] flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-[#10b981] flex items-center gap-1.5 uppercase tracking-wide">
                                  <FileCode className="w-4 h-4" />
                                  Drive Prototype
                                </span>
                              </div>
                              <p className="text-xs text-[#8e7da8] mb-3">
                                {selectedTeam.drive_link
                                  ? "Prototype codebase and demonstration binaries."
                                  : "No prototype drive link submitted"}
                              </p>
                            </div>

                            {selectedTeam.drive_link ? (
                              <a
                                href={selectedTeam.drive_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/40 px-3.5 py-2.5 rounded-xl transition-all"
                              >
                                <span>Open Drive Folder</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <div className="text-xs font-mono text-[#7b6999] py-1">
                                No prototype drive link submitted
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 text-center text-[#7b6999]">Select a team to view dossier</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVALUATE (EXCLUSIVELY FOR JUDGE; GREYED FOR MENTOR) */}
          {activeTab === "evaluate" && isJudge && (
            <div className="space-y-5">
              {/* Header & Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#251749]">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-[#ff2a85]" />
                    <span>Evaluate Assigned Teams</span>
                  </h2>
                  <p className="text-xs text-[#a594c7] mt-0.5">
                    Click any team to launch their dedicated evaluation scoring page.
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#7b6999] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search team or ID..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0e0a24] border border-[#2b1853] text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff2a85] placeholder:text-[#6a5885]"
                  />
                </div>
              </div>

              {/* Evaluation Teams Table / List */}
              <div className="vice-card rounded-2xl overflow-hidden border border-[#251749]">
                {/* Desktop Table Headers */}
                <div className="hidden sm:grid grid-cols-12 px-6 py-3.5 border-b border-[#251749] bg-[#09061c] text-[11px] font-mono font-bold text-[#7b6999] uppercase tracking-wider">
                  <div className="col-span-2">TEAM ID</div>
                  <div className="col-span-5">TEAM NAME &amp; TRACK</div>
                  <div className="col-span-3 text-center">EVALUATION STATUS</div>
                  <div className="col-span-2 text-right">ACTION</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#201340]">
                  {filteredTeams.length === 0 ? (
                    <div className="p-10 text-center text-[#7b6999]">No teams found matching search</div>
                  ) : (
                    filteredTeams.map((team) => {
                      const status: EvaluationStatus = statusMap[team.id] || "not_evaluated";

                      return (
                        <div
                          key={team.id}
                          onClick={() => router.push(`/evaluation/${team.id}`)}
                          className="p-4 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-3 hover:bg-[#191138]/60 cursor-pointer transition-all group"
                        >
                          {/* Team ID */}
                          <div className="sm:col-span-2">
                            <span className="font-mono text-xs font-extrabold text-[#ff2a85] px-2.5 py-1 rounded-lg bg-[#ff2a85]/15 border border-[#ff2a85]/40">
                              {team.team_id}
                            </span>
                          </div>

                          {/* Team Name */}
                          <div className="sm:col-span-5">
                            <div className="text-sm font-bold text-white group-hover:text-[#ff2a85] transition-colors">
                              {team.team_name}
                            </div>
                            <div className="text-xs text-[#a594c7] mt-0.5">{team.domain}</div>
                          </div>

                          {/* Status Field with Proper Color Combinations */}
                          <div className="sm:col-span-3 flex sm:justify-center">
                            {status === "not_evaluated" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-700">
                                <CircleDashed className="w-3.5 h-3.5 text-slate-500" />
                                <span>Not Evaluated</span>
                              </span>
                            )}
                            {status === "draft" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/40">
                                <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
                                <span>Saved as Draft</span>
                              </span>
                            )}
                            {status === "submitted" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                                <span>Evaluated</span>
                              </span>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="sm:col-span-2 w-full sm:w-auto flex justify-end">
                            <button
                              type="button"
                              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#ff2a85]/20 hover:bg-[#ff2a85] border border-[#ff2a85]/50 hover:border-[#ff2a85] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <span>{status === "submitted" ? "View Score" : "Evaluate"}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
