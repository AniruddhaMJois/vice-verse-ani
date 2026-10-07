import { TeamAssessmentPage } from "@/components/patterns/TeamAssessmentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Dossier & Observation | Mentor Portal",
  description: "Read-only team dossier and jury assessment telemetry",
};

export default function MentorTeamDetailPage({
  params,
}: {
  params: { teamId: string };
}) {
  return <TeamAssessmentPage teamId={params.teamId} portal="mentor" />;
}
