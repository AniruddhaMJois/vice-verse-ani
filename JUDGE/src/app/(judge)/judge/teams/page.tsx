import { TeamsDossierPage } from "@/components/patterns/TeamsDossierPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Identifier & Dossier | Judge Portal",
  description: "Final Round team dossiers and rubric scoring portal for jury panels",
};

export default function JudgeTeamsPage() {
  return <TeamsDossierPage portal="judge" />;
}
