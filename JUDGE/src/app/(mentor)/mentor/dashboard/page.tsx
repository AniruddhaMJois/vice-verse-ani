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
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Layers, Eye, Zap, ShieldCheck } from "lucide-react";

export default function MentorDashboard() {
  const router = useRouter();
  const { user, isMentor, isLoading: authLoading } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [statuses, setStatuses] = useState<Record<string, EvaluationStatus>>({});
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Strict role guard: if not mentor, redirect
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/mentor/login");
      } else if (!isMentor) {
        router.replace("/judge/dashboard");
      }
    }
  }, [user, isMentor, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [teamsData, statusesData, activityData] = await Promise.all([
        dataRepositories.teams.getTeams(),
        dataRepositories.evaluations.getAllStatuses(),
        dataRepositories.activity.getRecentActivity(),
      ]);
      setTeams(teamsData);
      setStatuses(statusesData);
      setActivities(activityData);
    } catch (err: any) {
      setError(err?.message || "Failed to load mentor telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isMentor) {
      loadData();
    }
  }, [user, isMentor]);

  // Realtime subscription
  useEffect(() => {
    const unsub = dataRepositories.realtime.subscribe("evaluations", () => {
      loadData();
    });
    return () => unsub();
  }, [user]);

  if (authLoading || (!user && !error)) {
    return (
      <div className="min-h-screen bg-[#03050A] flex items-center justify-center font-mono text-xs text-text-muted">
        <span className="w-2 h-2 rounded-full bg-signal animate-ping mr-2" />
        INITIALIZING MENTOR TELEMETRY NODE...
      </div>
    );
  }

  const totalTeams = teams.length;
  let finalizedCount = 0;
  teams.forEach((t) => {
    if (statuses[t.id] === "submitted") finalizedCount++;
  });

  const completionPercent = totalTeams > 0 ? Math.round((finalizedCount / totalTeams) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-transparent text-text flex flex-col justify-between">
      <Navbar />

      <main className="relative z-10 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* Breadcrumb & Welcome Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
          <div className="space-y-1">
            <Breadcrumbs
              items={[
                { label: "HOME", href: "/" },
                { label: "FINAL ROUND", href: "/mentor/dashboard" },
                { label: "DASHBOARD" },
              ]}
            />
            <div className="flex items-center gap-2 pt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Mentor Observational Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-signal/15 border border-signal/30 text-signal font-mono text-[10px] font-bold uppercase">
                {user?.loginId || "MENTOR OBSERVER"}
              </span>
            </div>
          </div>

          {/* Realtime Live Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded bg-surface-2 border border-border text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse shadow-[0_0_6px_var(--signal)]" />
            <span className="text-text-muted">OBSERVATION FEED:</span>
            <span className="text-signal font-semibold">READ-ONLY LIVE</span>
          </div>
        </div>

        {/* 4-Up Stat Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Teams Overseen"
            value={totalTeams}
            caption="Final Round candidate roster"
            accentVariant="green"
            statusChip="ALL TRACKS"
            icon={<Layers className="w-5 h-5 text-signal" />}
            onClick={() => router.push("/mentor/teams")}
          />

          <StatCard
            label="Evaluations Finalized"
            value={finalizedCount}
            suffix={`/ ${totalTeams}`}
            caption={`${completionPercent}% submitted across panels`}
            accentVariant="green"
            statusChip="LOCKED READ-ONLY"
            icon={<ShieldCheck className="w-5 h-5 text-signal" />}
            onClick={() => router.push("/mentor/teams?status=submitted")}
          />

          <StatCard
            label="Consensus Node"
            value="Active"
            caption="Zero-latency telemetry sync"
            accentVariant="green"
            isLivePulsing={true}
            statusChip="SYNCED"
            icon={<Zap className="w-5 h-5 text-signal" />}
          />

          <StatCard
            label="Active Jury Clusters"
            value={4}
            caption="Synchronized evaluation panels"
            accentVariant="green"
            statusChip="4 ONLINE"
            icon={<Eye className="w-5 h-5 text-signal" />}
          />
        </section>

        {/* Final Round Banner */}
        <section>
          <FinalRoundBanner
            completedCount={finalizedCount}
            totalCount={totalTeams}
            teamsRoute="/mentor/teams"
            isJudge={false}
          />
        </section>

        {/* Recent Activity List */}
        <section>
          <RecentActivityList
            items={activities}
            isLoading={loading}
            error={error}
            portal="mentor"
            onRetry={loadData}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
