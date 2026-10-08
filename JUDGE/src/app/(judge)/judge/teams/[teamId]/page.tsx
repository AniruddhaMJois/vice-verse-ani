import { TeamAssessmentPage } from "@/components/patterns/TeamAssessmentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Evaluation | Judge Portal",
  description: "Standardized 100-marks assessment matrix for Final Round team dossier",
};

export default function JudgeTeamDetailPage({
  params,
}: {
  params: { teamId: string };
}) {
  return <TeamAssessmentPage teamId={params.teamId} portal="judge" />;
}
