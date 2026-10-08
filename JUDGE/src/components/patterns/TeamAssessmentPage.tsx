"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { dataRepositories } from "@/lib/data";
import { Team, Criterion, EvaluationScore, EvaluationStatus, Evaluation } from "@/lib/data/types";
import { ScoreTable } from "@/components/patterns/ScoreTable";
import { StatusBadge } from "@/components/patterns/StatusBadge";
import { LinkChip } from "@/components/patterns/LinkChip";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  FileText,
  CheckCircle2,
  Lock,
  Save,
  Send,
  AlertTriangle,
  ExternalLink,
  Users,
  Code,
  Folder,
  Presentation,
  Shield,
  Clock,
  ArrowLeft,
} from "lucide-react";

interface TeamAssessmentPageProps {
  teamId: string;
  portal: "judge" | "mentor";
}

export function TeamAssessmentPage({ teamId, portal }: TeamAssessmentPageProps) {
  const router = useRouter();
  const { user, isJudge, isMentor, isLoading: authLoading } = useAuth();
  const isJudgePortal = portal === "judge";

  const [team, setTeam] = useState<Team | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [activeTab, setActiveTab] = useState<"dossier" | "evaluation">("evaluation");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

      const [teamData, criteriaData, evalData] = await Promise.all([
        dataRepositories.teams.getTeamById(teamId),
        dataRepositories.criteria.getCriteria(),
        dataRepositories.evaluations.getEvaluation(teamId, isJudgePortal ? user?.id : undefined),
      ]);

      if (!teamData) {
        setError("Team not found in Final Round roster.");
        return;
      }

      setTeam(teamData);
      setCriteria(criteriaData);
      setEvaluation(evalData.evaluation);

      const markMap: Record<string, number> = {};
      evalData.scores.forEach((s) => {
        markMap[s.criterionId] = s.marks;
      });
      setMarks(markMap);
      if (evalData.evaluation?.feedback) {
        setFeedback(evalData.evaluation.feedback);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load team evaluation data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, teamId, isJudgePortal]);

  const handleScoreChange = (criterionId: string, value: number) => {
    if (!isJudgePortal || evaluation?.status === "submitted") return;
    setMarks((prev) => ({
      ...prev,
      [criterionId]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleFeedbackChange = (val: string) => {
    if (!isJudgePortal || evaluation?.status === "submitted") return;
    setFeedback(val);
    setHasUnsavedChanges(true);
  };

  const handleSave = async (status: EvaluationStatus) => {
    if (!user || !isJudgePortal || evaluation?.status === "submitted") return;

    setSaving(true);
    setToastMessage(null);

    const scoresList: EvaluationScore[] = criteria.map((c) => ({
      criterionId: c.id,
      marks: marks[c.id] || 0,
    }));

    const res = await dataRepositories.evaluations.saveEvaluation({
      teamId,
      judgeId: user.id,
      status,
      scores: scoresList,
      feedback,
    });

    setSaving(false);

    if (res.success && res.evaluation) {
      setEvaluation(res.evaluation);
      setHasUnsavedChanges(false);
      setToastMessage({
        type: "success",
        text: status === "submitted" ? "Evaluation finalized & submitted!" : "Draft score saved successfully.",
      });
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setToastMessage({
        type: "error",
        text: res.error || "Failed to save evaluation.",
      });
    }
  };

  const isLocked = !isJudgePortal || evaluation?.status === "submitted";

  if (loading) {
    return (
      <div className="relative min-h-screen bg-transparent text-text flex flex-col justify-between">
        <Navbar />
        <div className="max-w-[1240px] w-full mx-auto px-4 py-12 space-y-6 flex-1">
          <Skeleton className="w-48 h-6 rounded" />
          <Skeleton className="w-full h-32 rounded-card" />
          <Skeleton className="w-full h-96 rounded-card" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="relative min-h-screen bg-transparent text-text flex flex-col justify-between">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4 flex-1">
          <AlertTriangle className="w-12 h-12 text-danger mx-auto" />
          <h2 className="text-xl font-bold text-white">{error || "Team Dossier Not Found"}</h2>
          <Link href={isJudgePortal ? "/judge/teams" : "/mentor/teams"}>
            <Button variant="secondary" className="font-mono text-xs">
              &larr; Return to Roster
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-text flex flex-col justify-between">
      <Navbar />

      <main className="relative z-10 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`p-4 rounded-card border font-mono text-xs flex items-center justify-between shadow-glow-dual ${
              toastMessage.type === "success"
                ? "bg-signal-bg border-signal text-signal"
                : "bg-danger-bg border-danger text-danger"
            }`}
          >
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="text-text-faint hover:text-white">
              [DISMISS]
            </button>
          </div>
        )}

        {/* Header & Breadcrumb */}
        <div className="space-y-3 border-b border-border/50 pb-5">
          <Breadcrumbs
            items={[
              { label: "HOME", href: "/" },
              {
                label: "FINAL ROUND",
                href: isJudgePortal ? "/judge/dashboard" : "/mentor/dashboard",
              },
              {
                label: "TEAMS",
                href: isJudgePortal ? "/judge/teams" : "/mentor/teams",
              },
              { label: team.teamCode },
            ]}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Link
                  href={isJudgePortal ? "/judge/teams" : "/mentor/teams"}
                  className="p-1.5 rounded hover:bg-surface-2 text-text-muted hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="px-2.5 py-0.5 rounded bg-accent/15 border border-accent/40 text-accent font-mono text-sm font-bold">
                  {team.teamCode}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {team.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={evaluation?.status || "not_evaluated"} />
              {isLocked && (
                <div className="flex items-center gap-1 text-xs font-mono text-text-muted px-2.5 py-1 rounded bg-surface-2 border border-border">
                  <Lock className="w-3.5 h-3.5 text-text-faint" />
                  <span>{isJudgePortal ? "SUBMITTED (LOCKED)" : "VIEW-ONLY"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Locked View-only Banner for Mentors */}
        {!isJudgePortal && (
          <div className="p-4 rounded-card border border-signal/30 bg-signal-bg flex items-center gap-3 text-xs font-mono text-signal">
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              OBSERVATION MODE: View-only access active. Evaluation scoring is strictly restricted to assigned jury panels.
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60">
          <button
            onClick={() => setActiveTab("evaluation")}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs tracking-wider transition-colors ${
              activeTab === "evaluation"
                ? "border-accent text-accent font-bold bg-accent/5"
                : "border-transparent text-text-muted hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SCORING MATRIX</span>
          </button>

          <button
            onClick={() => setActiveTab("dossier")}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs tracking-wider transition-colors ${
              activeTab === "dossier"
                ? "border-signal text-signal font-bold bg-signal/5"
                : "border-transparent text-text-muted hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PROJECT DOSSIER</span>
          </button>
        </div>

        {/* Tab 1: Scoring Matrix */}
        {activeTab === "evaluation" && (
          <div className="space-y-6">
            {/* Score Table with Typing-Only Input + Chevrons */}
            <ScoreTable
              criteria={criteria}
              marks={marks}
              onChange={handleScoreChange}
              isLocked={evaluation?.status === "submitted"}
              isReadOnly={!isJudgePortal}
            />

            {/* Qualitative Feedback Textarea */}
            <div className="p-6 bg-surface/90 rounded-card border border-border space-y-3">
              <label className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-signal" />
                QUALITATIVE JURY FEEDBACK &amp; DEFENSE NOTES
              </label>
              <textarea
                rows={4}
                value={feedback}
                disabled={isLocked}
                onChange={(e) => handleFeedbackChange(e.target.value)}
                placeholder={
                  isJudgePortal
                    ? "Enter structured feedback, architectural strengths, and key Q&A defense observations..."
                    : "No jury feedback entered yet."
                }
                className="w-full p-4 bg-surface-2 border border-border rounded font-sans text-sm text-white placeholder:text-text-faint focus:outline-none focus:border-accent focus:shadow-glow-pink disabled:opacity-60 transition-all"
              />
            </div>

            {/* Action Bar (Judge Only) */}
            {isJudgePortal && evaluation?.status !== "submitted" && (
              <div className="p-4 sm:p-5 bg-surface-2/90 rounded-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
                  {hasUnsavedChanges && (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Unsaved changes
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={saving}
                    onClick={() => handleSave("draft")}
                    leftIcon={<Save className="w-4 h-4 text-accent" />}
                    className="font-mono text-xs w-full sm:w-auto"
                  >
                    Save as Draft
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    disabled={saving}
                    onClick={() => handleSave("submitted")}
                    rightIcon={<Send className="w-4 h-4" />}
                    className="font-mono text-xs shadow-glow-dual w-full sm:w-auto"
                  >
                    Submit Final Assessment &rarr;
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Project Dossier */}
        {activeTab === "dossier" && (
          <div className="space-y-6">
            {/* Case Study Card */}
            <div className="p-6 bg-surface/90 rounded-card border border-border space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                CASE STUDY PROBLEM STATEMENT &amp; ARCHITECTURE
              </h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {team.caseStudy}
              </p>
            </div>

            {/* Deliverables Grid */}
            <div className="p-6 bg-surface/90 rounded-card border border-border space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-signal font-semibold flex items-center gap-2">
                <Folder className="w-4 h-4" />
                SUBMITTED FINAL ROUND DELIVERABLES
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {team.canvaUrl ? (
                  <a
                    href={team.canvaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-surface-2 rounded border border-border hover:border-accent transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Presentation className="w-5 h-5 text-accent" />
                      <div>
                        <div className="text-xs font-bold text-white">Canva Slide Deck</div>
                        <div className="text-[10px] font-mono text-text-faint">Pitch Presentation</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-faint group-hover:text-accent" />
                  </a>
                ) : null}

                {team.driveUrl ? (
                  <a
                    href={team.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-surface-2 rounded border border-border hover:border-signal transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-signal" />
                      <div>
                        <div className="text-xs font-bold text-white">Google Drive Assets</div>
                        <div className="text-[10px] font-mono text-text-faint">Binaries &amp; Schematics</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-faint group-hover:text-signal" />
                  </a>
                ) : null}

                {team.githubUrl ? (
                  <a
                    href={team.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-surface-2 rounded border border-border hover:border-cyan-400 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Code className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Source Repository</div>
                        <div className="text-[10px] font-mono text-text-faint">GitHub Deployment</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-faint group-hover:text-cyan-400" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Team Members */}
            <div className="p-6 bg-surface/90 rounded-card border border-border space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                VERIFIED TEAM MEMBERS ({team.members.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {team.members.map((mem, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-2 rounded border border-border flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{mem.name}</div>
                      <div className="text-[10px] font-mono text-text-muted">{mem.branch}</div>
                    </div>
                    {mem.isLead && (
                      <span className="px-2 py-0.5 rounded bg-accent/20 border border-accent/40 text-accent font-mono text-[9px] font-bold uppercase">
                        TEAM LEAD
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
