import { TeamsDossierPage } from "@/components/patterns/TeamsDossierPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Identifier & Dossier | Mentor Portal",
  description: "Final Round team dossiers and read-only observation roster for mentors",
};

export default function MentorTeamsPage() {
  return <TeamsDossierPage portal="mentor" />;
}
