"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { judgeService } from "@backend/services/judgeService";
import { Team, EvaluationCriteria, Evaluation } from "@shared/types/database";
import {
  ArrowLeft,
  Award,
  Save,
  Send,
  Edit3,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function TeamEvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;

  const { user, isJudge, isMentor, isLoading } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
  const [currentEval, setCurrentEval] = useState<Evaluation | null>(null);
  const [marksState, setMarksState] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Mentor Guard: Redirect mentors back to workspace as evaluation is judge-only
  useEffect(() => {
    if (!isLoading && user && isMentor) {
      router.push("/workspace");
    }
  }, [user, isMentor, isLoading, router]);

  // Load Team, Criteria & Existing Evaluation from Supabase
  useEffect(() => {
    if (!user || !teamId) return;

    const loadEvaluationData = async () => {
      setIsDataLoading(true);
      const rounds = await judgeService.getRounds();
      const roundId = rounds.length > 0 ? rounds[0].id : "round-1";

      const [teamsList, criteriaList, evalResult] = await Promise.all([
        judgeService.getTeams(roundId),
        judgeService.getCriteria(roundId),
        judgeService.getEvaluation(roundId, teamId, user.id),
      ]);

      const foundTeam = teamsList.find((t) => t.id === teamId || t.team_id === teamId);
      setTeam(foundTeam || null);
      setCriteria(criteriaList);
      setCurrentEval(evalResult.evaluation);

      // Populate existing scores
      const initialMarks: Record<string, number> = {};
      evalResult.scores.forEach((s) => {
        initialMarks[s.criteria_id] = Number(s.score);
      });
      setMarksState(initialMarks);
      setFeedback(evalResult.evaluation?.feedback || "");
      setIsEditingDraft(evalResult.evaluation?.status === "draft");
      setIsDataLoading(false);
    };

    loadEvaluationData();
  }, [user, teamId]);

  const handleMarkChange = (critId: string, value: string, maxMarks: number) => {
    const num = Math.min(Math.max(0, Number(value) || 0), maxMarks);
    setMarksState((prev) => ({ ...prev, [critId]: num }));
  };

  const maxPossibleMarks = criteria.reduce((sum, c) => sum + c.max_marks, 0);
  const obtainedMarks = criteria.reduce((sum, c) => sum + (marksState[c.id] || 0), 0);
  const scorePercentage = maxPossibleMarks > 0 ? Math.round((obtainedMarks / maxPossibleMarks) * 100) : 0;

  // Save Draft / Final Submit Handler
  const handleSaveEvaluation = async (statusToSet: "draft" | "submitted") => {
    if (!team || !user || !isJudge) return;

    setIsSaving(true);
    setMessage(null);

    const scoresPayload = criteria.map((c) => ({
      criteria_id: c.id,
      score: marksState[c.id] || 0,
    }));

    try {
      const res = await judgeService.saveEvaluation({
        roundId: "round-1",
        teamId: team.id,
        judgeId: user.id,
        status: statusToSet,
        scores: scoresPayload,
        feedback,
      });

      if (res.success) {
        setCurrentEval(res.evaluation);
        setIsEditingDraft(false);
        setMessage({
          type: "success",
          text:
            statusToSet === "submitted"
              ? "Evaluation submitted and permanently locked in Supabase."
              : "Draft saved to Supabase! You can review or edit anytime before final submission.",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save to Supabase." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isDataLoading || !team) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#070512]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#a594c7] font-mono tracking-widest uppercase">Loading Scorecard...</p>
        </div>
      </div>
    );
  }

  const isLocked = currentEval?.status === "submitted";
  const isDraftUneditable = currentEval?.status === "draft" && !isEditingDraft;
  const isFieldDisabled = isLocked || isDraftUneditable;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070512] bg-vice-grid py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation & Team Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#251749]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/workspace")}
              className="p-2 sm:p-2.5 rounded-xl bg-[#120d2e] border border-[#2b1853] text-[#a594c7] hover:text-white hover:border-[#ff2a85] transition-all"
              title="Return to Workspace"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs sm:text-sm font-black text-[#ff2a85] px-2.5 py-1 rounded-lg bg-[#ff2a85]/15 border border-[#ff2a85]/40">
                {team.team_id}
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {team.team_name}
                </h1>
                <p className="text-xs text-[#00f0ff] font-medium">{team.domain}</p>
              </div>
            </div>
          </div>

          {/* Current Status Pill */}
          <div className="self-start sm:self-auto">
            {currentEval?.status === "submitted" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Evaluated &bull; Locked</span>
              </span>
            ) : currentEval?.status === "draft" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/40 shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>Draft Saved</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-700">
                <span>Not Evaluated</span>
              </span>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SELECTED CASE STUDY HERO CALLOUT ONLY */}
        {/* ==================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0926] border border-[#ff2a85]/30 relative overflow-hidden shadow-[0_0_25px_rgba(255,42,133,0.1)]">
          <div className="text-[11px] font-mono font-bold text-[#ff2a85] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ff2a85]" />
            <span>SELECTED CASE STUDY</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            &quot;{team.case_study || "Case study not yet assigned"}&quot;
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-lg ${
              message.type === "success"
                ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                : "bg-red-950/60 border border-red-800 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Locked Banner */}
        {isLocked && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>This evaluation is finalized and permanently locked in Supabase. Edits are disabled.</span>
          </div>
        )}

        {/* Draft Edit Toggle Banner */}
        {currentEval?.status === "draft" && !isEditingDraft && (
          <div className="p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#fbbf24] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f59e0b] shrink-0" />
              <span>Draft loaded. Click &quot;Edit&quot; to adjust scores, or submit when ready.</span>
            </div>
            <button
              onClick={() => setIsEditingDraft(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#fbbf24] font-bold border border-[#f59e0b]/40 transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Draft</span>
            </button>
          </div>
        )}

        {/* Live Score HUD */}
        <div className="p-5 rounded-2xl vice-card border border-[#251749] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-[#a594c7] uppercase tracking-wider">
              Total Score Awarded
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-0.5">
              <span className="text-[#ff2a85]">{obtainedMarks}</span>
              <span className="text-[#6d5b8c]"> / {maxPossibleMarks}</span>
            </div>
          </div>

          <div className="w-full sm:w-60">
            <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
              <span className="text-[#a594c7]">Score Ratio</span>
              <span className="text-[#00f0ff]">{scorePercentage}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#120d2e] overflow-hidden border border-[#2b1853]">
              <div
                className="h-full bg-gradient-to-r from-[#ff2a85] via-[#db2777] to-[#00f0ff] transition-all duration-300"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* EVALUATION SCORING TABLE (LAPTOP VIEW >=768px) */}
        {/* ==================================================================== */}
        <div className="hidden md:block vice-card rounded-2xl overflow-hidden border border-[#251749]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#251749] bg-[#09061c] text-[#7b6999] uppercase font-mono font-bold tracking-wider">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Criteria</th>
                <th className="p-4 w-28 text-center">Max Marks</th>
                <th className="p-4 w-36 text-center">Marks Obtained</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#201340]">
              {criteria.map((crit, idx) => (
                <tr key={crit.id} className="hover:bg-[#150f33]/60 transition-colors">
                  <td className="p-4 text-center font-mono text-[#7b6999]">{idx + 1}</td>
                  <td className="p-4">
                    <div className="font-bold text-white text-xs sm:text-sm">{crit.criteria_name}</div>
                    <div className="text-[11px] text-[#8e7da8] mt-0.5 leading-relaxed">{crit.description}</div>
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-slate-300">{crit.max_marks}</td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      min={0}
                      max={crit.max_marks}
                      value={marksState[crit.id] ?? 0}
                      onChange={(e) => handleMarkChange(crit.id, e.target.value, crit.max_marks)}
                      disabled={isFieldDisabled}
                      className="w-20 px-3 py-1.5 text-center font-mono font-black text-sm rounded-lg bg-[#070512] border border-[#2b1853] text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85]/50 disabled:opacity-50 disabled:bg-[#120d2e]"
                    />
                  </td>
                </tr>
              ))}

              {/* Grand Total Row */}
              <tr className="bg-[#09061c] font-black border-t-2 border-[#251749]">
                <td className="p-4 text-center font-mono text-[#ff2a85]">&Sigma;</td>
                <td className="p-4 text-white uppercase tracking-wider text-xs">Grand Total</td>
                <td className="p-4 text-center font-mono text-sm text-slate-300">{maxPossibleMarks}</td>
                <td className="p-4 text-center font-mono text-base text-[#ff2a85]">{obtainedMarks}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ==================================================================== */}
        {/* EVALUATION SCORING CARDS (MOBILE VIEW <768px) */}
        {/* ==================================================================== */}
        <div className="block md:hidden space-y-3">
          {criteria.map((crit, idx) => (
            <div key={crit.id} className="p-4 rounded-xl bg-[#0d0926] border border-[#251749] space-y-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-xs text-[#ff2a85] font-bold">#{idx + 1}</span>
                  <div className="font-bold text-white text-xs sm:text-sm">{crit.criteria_name}</div>
                </div>
                <p className="text-[11px] text-[#8e7da8] leading-relaxed">{crit.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#251749]">
                <span className="text-xs font-mono text-[#a594c7]">
                  Max: <strong className="text-white">{crit.max_marks}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-semibold text-[#a594c7]">Marks:</label>
                  <input
                    type="number"
                    min={0}
                    max={crit.max_marks}
                    value={marksState[crit.id] ?? 0}
                    onChange={(e) => handleMarkChange(crit.id, e.target.value, crit.max_marks)}
                    disabled={isFieldDisabled}
                    className="w-24 h-11 text-center font-mono font-black text-base rounded-lg bg-[#070512] border border-[#2b1853] text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Grand Total Card */}
          <div className="p-4 rounded-xl bg-[#120d2e] border border-[#ff2a85]/40 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Grand Total</span>
            <span className="font-mono font-black text-lg text-[#ff2a85]">
              {obtainedMarks} / {maxPossibleMarks}
            </span>
          </div>
        </div>

        {/* Feedback Textarea */}
        <div className="vice-card rounded-2xl p-5 border border-[#251749] space-y-2">
          <label className="text-xs font-bold text-[#a594c7] uppercase tracking-wider block">
            Judge Feedback &amp; Remarks (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isFieldDisabled}
            rows={3}
            placeholder="Type qualitative feedback, strengths, or suggestions for the team..."
            className="w-full p-3.5 rounded-xl bg-[#070512] border border-[#2b1853] text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#ff2a85] disabled:opacity-50 placeholder:text-[#6a5885]"
          />
        </div>

        {/* ==================================================================== */}
        {/* BOTTOM ACTION DOCK (STICKY ON MOBILE, STANDARD ON DESKTOP) */}
        {/* ==================================================================== */}
        {!isLocked && (
          <div className="sticky bottom-0 bg-[#070512]/95 backdrop-blur-md p-3 sm:p-0 sm:bg-transparent -mx-3.5 sm:mx-0 sm:pt-4 sm:border-t sm:border-[#251749] border-t border-[#251749] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 z-20">
            {/* Save Draft Button */}
            <button
              type="button"
              onClick={() => handleSaveEvaluation("draft")}
              disabled={isSaving}
              className="py-3 px-5 rounded-xl bg-[#140e2e] hover:bg-[#1f1545] border border-[#2b1853] hover:border-[#f59e0b] text-xs sm:text-sm font-bold text-[#fbbf24] flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <Save className="w-4 h-4 text-[#f59e0b]" />
              <span>Save Draft</span>
            </button>

            {/* Submit Final Evaluation Button */}
            <button
              type="button"
              onClick={() => handleSaveEvaluation("submitted")}
              disabled={isSaving}
              className="py-3 px-6 rounded-xl btn-enter-neon text-xs sm:text-sm font-black text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Submit Evaluation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
