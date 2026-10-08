"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { dataRepositories } from "@/lib/data";
import { Team, EvaluationStatus } from "@/lib/data/types";
import { StatusBadge } from "@/components/patterns/StatusBadge";
import { LinkChip } from "@/components/patterns/LinkChip";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Search,
  LayoutGrid,
  List,
  Kanban,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  FolderOpen,
  X,
  FileText,
} from "lucide-react";

interface TeamsDossierPageProps {
  portal: "judge" | "mentor";
}

export function TeamsDossierPage({ portal }: TeamsDossierPageProps) {
  const router = useRouter();
  const { user, isJudge, isMentor, isLoading: authLoading } = useAuth();
  const isJudgePortal = portal === "judge";

  const [teams, setTeams] = useState<Team[]>([]);
  const [statuses, setStatuses] = useState<Record<string, EvaluationStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards" | "board">("table");
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Team>("teamCode");
  const [sortAsc, setSortAsc] = useState(true);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load view mode from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viceverse_teams_view_mode");
      if (saved === "table" || saved === "cards" || saved === "board") {
        setViewMode(saved);
      }
    } catch {}
  }, []);

  const handleViewModeChange = (mode: "table" | "cards" | "board") => {
    setViewMode(mode);
    try {
      localStorage.setItem("viceverse_teams_view_mode", mode);
    } catch {}
  };

  // Auth guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace(isJudgePortal ? "/judge/login" : "/mentor/login");
      } else if (isJudgePortal && !isJudge) {
        router.replace("/mentor/dashboard");
      } else if (!isJudgePortal && !isMentor) {
        router.replace("/judge/dashboard");
      }
    }
  }, [user, isJudge, isMentor, authLoading, router, isJudgePortal]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [teamsData, statusesData] = await Promise.all([
        isJudgePortal
          ? dataRepositories.teams.getTeams({ judgeId: user?.id })
          : dataRepositories.teams.getTeams(),
        isJudgePortal
          ? dataRepositories.evaluations.getStatusesForJudge(user?.id)
          : dataRepositories.evaluations.getAllStatuses(),
      ]);
      setTeams(teamsData);
      setStatuses(statusesData);
    } catch (err: any) {
      setError(err?.message || "Failed to load team roster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, isJudgePortal]);

  // Realtime subscription
  useEffect(() => {
    const unsub = dataRepositories.realtime.subscribe("evaluations", () => {
      loadData();
    });
    return () => unsub();
  }, [user]);

  // Key handlers: Esc collapses peek
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedTeamId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Filtered & Sorted teams
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const status = statuses[t.id] || "not_evaluated";

      // Search across Code, Name, Case Study
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesCode = t.teamCode.toLowerCase().includes(query);
        const matchesName = t.name.toLowerCase().includes(query);
        const matchesCase = t.caseStudy.toLowerCase().includes(query);
        if (!matchesCode && !matchesName && !matchesCase) return false;
      }

      // Status filter
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [teams, statuses, debouncedSearch, statusFilter, sortField, sortAsc]);

  // Status counts for segmented control
  const statusCounts = useMemo(() => {
    const counts = { all: teams.length, not_evaluated: 0, draft: 0, submitted: 0 };
    teams.forEach((t) => {
      const st = statuses[t.id] || "not_evaluated";
      if (st === "not_evaluated") counts.not_evaluated++;
      if (st === "draft") counts.draft++;
      if (st === "submitted") counts.submitted++;
    });
    return counts;
  }, [teams, statuses]);

  const handleSort = (field: keyof Team) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="relative min-h-screen bg-transparent text-text flex flex-col justify-between">
      <Navbar />

      <main className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-5">
          <div className="space-y-1">
            <Breadcrumbs
              items={[
                { label: "HOME", href: "/" },
                {
                  label: "FINAL ROUND",
                  href: isJudgePortal ? "/judge/dashboard" : "/mentor/dashboard",
                },
                { label: "TEAMS & DOSSIER" },
              ]}
            />
            <div className="flex items-center gap-2 pt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Team Identifier &amp; Dossier
              </h1>
              <span className="font-mono text-xs text-text-muted px-2.5 py-0.5 rounded bg-surface-2 border border-border">
                {filteredTeams.length} / {teams.length} TEAMS
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {isJudgePortal
                ? "Select a team dossier to initiate or edit your Final Round 100-mark evaluation matrix."
                : "Real-time read-only observational overview of all candidate finalist team dossiers."}
            </p>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center p-1 bg-surface-2 border border-border rounded-[6px]">
              <button
                onClick={() => handleViewModeChange("table")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                  viewMode === "table"
                    ? "bg-surface-3 text-white shadow-sm border border-border-strong font-semibold"
                    : "text-text-muted hover:text-white"
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>

              <button
                onClick={() => handleViewModeChange("cards")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                  viewMode === "cards"
                    ? "bg-surface-3 text-white shadow-sm border border-border-strong font-semibold"
                    : "text-text-muted hover:text-white"
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>

              <button
                onClick={() => handleViewModeChange("board")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                  viewMode === "board"
                    ? "bg-surface-3 text-white shadow-sm border border-border-strong font-semibold"
                    : "text-text-muted hover:text-white"
                }`}
                title="Board View"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Board</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar (Search + Status Segmented Control) */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by team ID, name, case study..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded text-sm text-white placeholder:text-text-faint focus:outline-none focus:border-accent focus:shadow-glow-pink font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-text-faint hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Segmented Control with counts */}
          <div className="flex items-center p-1 bg-surface-2 border border-border rounded-[6px] overflow-x-auto shrink-0">
            {[
              { key: "all", label: "All", count: statusCounts.all },
              { key: "not_evaluated", label: "Not Evaluated", count: statusCounts.not_evaluated },
              { key: "draft", label: "Draft", count: statusCounts.draft },
              { key: "submitted", label: "Submitted", count: statusCounts.submitted },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all shrink-0 ${
                  statusFilter === st.key
                    ? "bg-surface-3 text-white shadow-sm border border-border-strong font-semibold"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums font-bold ${
                    statusFilter === st.key
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-surface text-text-faint"
                  }`}
                >
                  {st.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Content Area */}
        {loading ? (
          <div className="p-8 bg-surface/80 rounded-card border border-border space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-2/40 rounded border border-border/40">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-20 h-6 rounded" />
                  <Skeleton className="w-48 h-5 rounded" />
                </div>
                <Skeleton className="w-28 h-6 rounded" />
              </div>
            ))}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="p-12 text-center bg-surface/80 rounded-card border border-border space-y-3">
            <FolderOpen className="w-10 h-10 text-text-faint mx-auto" />
            <h3 className="text-base font-semibold text-white">No teams match your criteria</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Try adjusting your search query or toggling status tabs.
            </p>
            <Button variant="secondary" size="sm" onClick={clearFilters} className="font-mono text-xs mt-2">
              Clear All Filters
            </Button>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW: Team ID, Team Name, Deliverables, Status, Action */
          <div className="bg-surface/90 backdrop-blur-md rounded-card border border-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-[11px] font-mono uppercase tracking-wider text-text-muted select-none">
                    <th
                      className="p-4 pl-5 cursor-pointer hover:text-white whitespace-nowrap min-w-[140px]"
                      onClick={() => handleSort("teamCode")}
                    >
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span>TEAM ID</span>
                        <ArrowUpDown className="w-3 h-3 text-text-faint shrink-0" />
                      </div>
                    </th>
                    <th
                      className="p-4 cursor-pointer hover:text-white whitespace-nowrap min-w-[220px]"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span>TEAM NAME</span>
                        <ArrowUpDown className="w-3 h-3 text-text-faint shrink-0" />
                        <span className="text-[10px] text-text-muted lowercase font-sans font-normal">
                          (click for details)
                        </span>
                      </div>
                    </th>
                    <th className="p-4 whitespace-nowrap min-w-[190px]">DELIVERABLES</th>
                    <th className="p-4 whitespace-nowrap min-w-[140px]">STATUS</th>
                    <th className="p-4 pr-5 text-right whitespace-nowrap min-w-[110px]">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs font-sans">
                  {filteredTeams.map((team) => {
                    const status = statuses[team.id] || "not_evaluated";
                    const isExpanded = expandedTeamId === team.id;

                    return (
                      <React.Fragment key={team.id}>
                        <tr
                          onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                          className={`hover:bg-surface-2/60 cursor-pointer transition-colors group ${
                            isExpanded ? "bg-surface-2/80 border-l-2 border-l-accent" : ""
                          }`}
                        >
                          {/* 1. TEAM ID */}
                          <td className="p-4 pl-5 font-mono font-bold whitespace-nowrap">
                            <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded bg-surface-2 border-2 border-accent text-accent-hot shadow-sm font-bold text-xs tracking-wider shrink-0">
                              {team.teamCode}
                            </span>
                          </td>

                          {/* 2. TEAM NAME */}
                          <td className="p-4 font-semibold text-white whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="group-hover:text-accent transition-colors font-medium text-sm">
                                {team.name}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-text-muted group-hover:text-accent transition-transform duration-200 shrink-0 ${
                                  isExpanded ? "rotate-180 text-accent" : ""
                                }`}
                              />
                            </div>
                          </td>

                          {/* 3. DELIVERABLES (Drive, Canva, GitHub links directly visible in roster, not as dropdown list) */}
                          <td className="p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              {team.canvaUrl ? (
                                <LinkChip href={team.canvaUrl} label="Deck" variant="canva" />
                              ) : null}
                              {team.driveUrl ? (
                                <LinkChip href={team.driveUrl} label="Drive" variant="drive" />
                              ) : null}
                              {team.githubUrl ? (
                                <LinkChip href={team.githubUrl} label="Code" variant="github" />
                              ) : null}
                              {!team.canvaUrl && !team.driveUrl && !team.githubUrl && (
                                <span className="font-mono text-[11px] text-text-muted">No links</span>
                              )}
                            </div>
                          </td>

                          {/* 4. STATUS */}
                          <td className="p-4 whitespace-nowrap">
                            <StatusBadge status={status} />
                          </td>

                          {/* 5. ACTION */}
                          <td className="p-4 pr-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={
                                isJudgePortal
                                  ? `/judge/teams/${team.id}`
                                  : `/mentor/teams/${team.id}`
                              }
                            >
                              <Button
                                variant={isJudgePortal ? "primary" : "secondary-green"}
                                size="sm"
                                className="font-mono text-[11px] tracking-wider py-1.5 px-3.5"
                                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                              >
                                {isJudgePortal ? "Evaluate" : "View"}
                              </Button>
                            </Link>
                          </td>
                        </tr>

                        {/* Inline Expandable Dossier Peek Panel: VISIBLE WHEN TEAM NAME IS SELECTED */}
                        {isExpanded && (
                          <tr className="bg-surface-3/95 transition-all">
                            <td colSpan={5} className="p-6 border-l-4 border-l-accent border-b border-border shadow-inner">
                              <div className="space-y-5">
                                {/* Header with Team Info and Quick Navigate */}
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1.5 max-w-3xl">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded bg-surface-2 border-2 border-accent text-accent-hot font-mono text-xs font-bold shrink-0 shadow-sm">
                                        {team.teamCode}
                                      </span>
                                      <h3 className="text-lg font-bold text-white">{team.name}</h3>
                                    </div>
                                    
                                    {/* Case Study Details */}
                                    <div className="pt-2">
                                      <div className="font-mono text-[11px] text-accent-hot uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-accent-hot" />
                                        <span>CASE STUDY TOPIC &amp; BRIEF</span>
                                      </div>
                                      <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line pl-5 border-l-2 border-accent/30 mt-1">
                                        {team.caseStudy}
                                      </p>
                                    </div>
                                  </div>

                                  <Link
                                    href={
                                      isJudgePortal
                                        ? `/judge/teams/${team.id}`
                                        : `/mentor/teams/${team.id}`
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button
                                      variant={isJudgePortal ? "primary" : "secondary-green"}
                                      size="sm"
                                      className="font-mono text-xs tracking-wider shrink-0"
                                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                                    >
                                      Open Full Dossier
                                    </Button>
                                  </Link>
                                </div>

                                {/* Submitted Deliverables */}
                                <div className="pt-3 border-t border-border/40">
                                  <span className="font-mono text-[11px] text-signal uppercase tracking-wider font-semibold block mb-2">
                                    SUBMITTED DELIVERABLES
                                  </span>
                                  <div className="flex items-center gap-2.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                    {team.canvaUrl ? (
                                      <LinkChip href={team.canvaUrl} label="Canva Slide Deck" variant="canva" />
                                    ) : null}
                                    {team.driveUrl ? (
                                      <LinkChip href={team.driveUrl} label="Google Drive Folder" variant="drive" />
                                    ) : null}
                                    {team.githubUrl ? (
                                      <LinkChip href={team.githubUrl} label="GitHub Code Repository" variant="github" />
                                    ) : null}
                                    {!team.canvaUrl && !team.driveUrl && !team.githubUrl && (
                                      <span className="font-mono text-[11px] text-text-faint">No external links submitted</span>
                                    )}
                                  </div>
                                </div>

                                {/* Team Members Roster */}
                                <div className="pt-3 border-t border-border/40">
                                  <span className="font-mono text-[11px] text-text-faint uppercase tracking-wider font-semibold block mb-2">
                                    TEAM MEMBERS ({team.members.length})
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {team.members.map((m, mIdx) => (
                                      <div
                                        key={mIdx}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-2 border border-border text-xs"
                                      >
                                        <span className="text-white font-medium">{m.name}</span>
                                        <span className="text-text-muted text-[10px] font-mono">
                                          ({m.branch})
                                        </span>
                                        {m.isLead && (
                                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-accent/20 text-accent border border-accent/40 font-bold uppercase">
                                            LEAD
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewMode === "cards" ? (
          /* CARDS VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              const status = statuses[team.id] || "not_evaluated";

              return (
                <div
                  key={team.id}
                  className="p-6 bg-surface/90 backdrop-blur-md rounded-card border border-border hover:border-accent/60 transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-glow-dual group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded bg-surface-2 border-2 border-accent text-accent-hot font-mono text-xs font-bold shrink-0 shadow-sm">
                        {team.teamCode}
                      </span>
                      <StatusBadge status={status} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors">
                        {team.name}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-accent-hot uppercase tracking-wider font-bold">
                        CASE STUDY:
                      </span>
                      <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                        {team.caseStudy}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {team.canvaUrl && <LinkChip href={team.canvaUrl} label="Deck" variant="canva" />}
                      {team.driveUrl && <LinkChip href={team.driveUrl} label="Drive" variant="drive" />}
                      {team.githubUrl && <LinkChip href={team.githubUrl} label="Code" variant="github" />}
                    </div>

                    <Link
                      href={
                        isJudgePortal
                          ? `/judge/teams/${team.id}`
                          : `/mentor/teams/${team.id}`
                      }
                    >
                      <Button
                        variant={isJudgePortal ? "primary" : "secondary-green"}
                        size="sm"
                        className="font-mono text-[11px]"
                      >
                        {isJudgePortal ? "Evaluate" : "View"}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { statusKey: "not_evaluated", label: "Not Evaluated", border: "border-border" },
              { statusKey: "draft", label: "Saved as Draft", border: "border-amber-500/40" },
              { statusKey: "submitted", label: "Submitted", border: "border-signal/40" },
            ].map((col) => {
              const colTeams = filteredTeams.filter(
                (t) => (statuses[t.id] || "not_evaluated") === col.statusKey
              );

              return (
                <div
                  key={col.statusKey}
                  className={`p-4 bg-surface/70 backdrop-blur-md rounded-card border ${col.border} space-y-4`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-2 font-mono text-xs font-bold text-text-muted">
                      {colTeams.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colTeams.length === 0 ? (
                      <div className="p-6 text-center text-xs font-mono text-text-faint border border-dashed border-border/50 rounded">
                        No teams in lane
                      </div>
                    ) : (
                      colTeams.map((team) => (
                        <div
                          key={team.id}
                          className="p-4 bg-surface-2/90 rounded border border-border hover:border-accent transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded bg-surface-2 border-2 border-accent text-accent-hot font-mono text-[11px] font-bold shrink-0 shadow-sm">
                              {team.teamCode}
                            </span>
                            <span className="text-[10px] font-mono text-text-faint">
                              {team.members.length} members
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white">{team.name}</h4>
                          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                            {team.caseStudy}
                          </p>

                          <div className="pt-2 flex items-center justify-end border-t border-border/40">
                            <Link
                              href={
                                isJudgePortal
                                  ? `/judge/teams/${team.id}`
                                  : `/mentor/teams/${team.id}`
                              }
                            >
                              <Button
                                variant={isJudgePortal ? "primary" : "secondary-green"}
                                size="sm"
                                className="font-mono text-[10px] py-1 px-2.5"
                              >
                                {isJudgePortal ? "Evaluate" : "View"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
