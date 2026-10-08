"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-surface-2/90 border border-border rounded-xl p-8 max-w-md w-full shadow-pop backdrop-blur-md">
        <h2 className="text-xl font-medium text-text mb-3 font-sans">
          Something went wrong
        </h2>
        <p className="text-sm text-text-muted mb-6 font-sans">
          {error?.message || "An unexpected error occurred."}
        </p>
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
