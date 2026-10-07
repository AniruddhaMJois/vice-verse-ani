import { PortalLogin } from "@/components/patterns/PortalLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Judge Portal Authentication | ViceVerse '26",
  description: "Secure jury assessment gateway for ViceVerse Final Round",
};

export default function JudgeLoginPage() {
  return <PortalLogin role="judge" />;
}
