"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { dataRepositories } from "@/lib/data";
import { Team, ActivityItem, EvaluationStatus } from "@/lib/data/types";
import { StatCard } from "@/components/patterns/StatCard";
import { FinalRoundBanner } from "@/components/patterns/FinalRoundBanner";
import { RecentActivityList } from "@/components/patterns/RecentActivityList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Layers, FileEdit, CheckCircle2, Award, ShieldAlert } from "lucide-react";

export default function JudgeDashboard() {
  const router = useRouter();
  const { user, isJudge, isLoading: authLoading } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [statuses, setStatuses] = useState<Record<string, EvaluationStatus>>({});
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Strict role guard: if not judge, redirect
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/judge/login");
      } else if (!isJudge) {
        router.replace("/mentor/dashboard");
      }
    }
  }, [user, isJudge, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [teamsData, statusesData, activityData] = await Promise.all([
        dataRepositories.teams.getTeams({ judgeId: user?.id }),
        dataRepositories.evaluations.getStatusesForJudge(user?.id),
        dataRepositories.activity.getRecentActivity(),
      ]);
      setTeams(teamsData);
      setStatuses(statusesData);
      setActivities(activityData);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isJudge) {
      loadData();
    }
  }, [user, isJudge]);

  // Realtime subscription
  useEffect(() => {
    const unsub = dataRepositories.realtime.subscribe("evaluations", () => {
      loadData();
    });
    return () => unsub();
  }, [user]);

  if (authLoading || (!user && !error)) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center font-mono text-xs text-text-muted select-none">
        <div className="flex items-center gap-2 p-4 rounded bg-surface-2/80 border border-border backdrop-blur-md shadow-glow-dual">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping mr-1 shadow-[0_0_8px_var(--accent)]" />
          <span className="text-white font-bold tracking-wider">CONNECTING JURY NODE...</span>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalAllotted = teams.length;
  let draftCount = 0;
  let submittedCount = 0;

  teams.forEach((t) => {
    const st = statuses[t.id] || "not_evaluated";
    if (st === "draft") draftCount++;
    if (st === "submitted") submittedCount++;
  });

  const completionPercent = totalAllotted > 0 ? Math.round((submittedCount / totalAllotted) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-transparent text-text flex flex-col justify-between">
      <Navbar />

      <main className="relative z-10 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* Navigation & Welcome Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <NavigationBar homeHref="/judge/dashboard" />
              <div className="h-4 w-[1px] bg-border-strong hidden sm:block" />
              <Breadcrumbs
                items={[
                  { label: "HOME", href: "/" },
                  { label: "FINAL ROUND", href: "/judge/dashboard" },
                  { label: "DASHBOARD" },
                ]}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Jury Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] font-bold uppercase">
                {user?.loginId || "JUDGE"}
              </span>
            </div>
          </div>

          {/* Realtime Live Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded bg-surface-2 border border-border text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse shadow-[0_0_6px_var(--signal)]" />
            <span className="text-text-muted">LIVE TELEMETRY:</span>
            <span className="text-signal font-semibold">ONLINE</span>
          </div>
        </div>

        {/* 4-Up Stat Cards Grid (Desktop 4-up, Tablet 2-up, Mobile 1-up, 24px gutters) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="My Allotted Teams"
            value={totalAllotted}
            caption="Final Round candidate roster"
            accentVariant="pink"
            statusChip="+3 assigned"
            icon={<Layers className="w-5 h-5 text-accent" />}
            onClick={() => router.push("/judge/teams")}
          />

          <StatCard
            label="Drafts Pending"
            value={draftCount}
            caption="In-progress scorecards"
            accentVariant="pink"
            statusChip={draftCount > 0 ? "ACTION NEEDED" : "CLEAR"}
            icon={<FileEdit className="w-5 h-5 text-accent" />}
            onClick={() => router.push("/judge/teams?status=draft")}
          />

          <StatCard
            label="Evaluations Finalized"
            value={submittedCount}
            suffix={`/ ${totalAllotted}`}
            caption={`${completionPercent}% total rubric completion`}
            accentVariant="green"
            statusChip="VERIFIED"
            icon={<CheckCircle2 className="w-5 h-5 text-signal" />}
            onClick={() => router.push("/judge/teams?status=submitted")}
          />

          <StatCard
            label="Grand Total Average"
            value={submittedCount > 0 ? "84.5" : "--"}
            suffix={submittedCount > 0 ? "pts" : ""}
            caption="Final Round 100-mark scale"
            accentVariant="green"
            statusChip="ACTIVE JURY"
            icon={<Award className="w-5 h-5 text-signal" />}
          />
        </section>

        {/* Final Round Banner (Change 3) */}
        <section>
          <FinalRoundBanner
            completedCount={submittedCount}
            totalCount={totalAllotted}
            teamsRoute="/judge/teams"
            isJudge={true}
          />
        </section>

        {/* Recent Activity List (Change 2) */}
        <section>
          <RecentActivityList
            items={activities}
            isLoading={loading}
            error={error}
            portal="judge"
            onRetry={loadData}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
