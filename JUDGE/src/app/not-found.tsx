import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-surface-2/90 border border-border rounded-xl p-8 max-w-md w-full shadow-pop backdrop-blur-md">
        <span className="text-xs font-mono text-accent font-semibold uppercase tracking-wider mb-2 block">
          404 — Node Not Found
        </span>
        <h2 className="text-2xl font-medium text-text mb-3 font-sans">
          Vector Disconnected
        </h2>
        <p className="text-sm text-text-muted mb-6 font-sans">
          The requested evaluation terminal or node cannot be located in the ViceVerse network.
        </p>
        <Link href="/" className="w-full block">
          <Button variant="primary" size="md" className="w-full">
            Return to Nexus
          </Button>
        </Link>
      </div>
    </div>
  );
}
