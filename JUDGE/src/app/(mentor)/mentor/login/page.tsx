import { PortalLogin } from "@/components/patterns/PortalLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentor Portal Authentication | ViceVerse '26",
  description: "Read-only mentor observation telemetry for ViceVerse Final Round",
};

export default function MentorLoginPage() {
  return <PortalLogin role="mentor" />;
}
