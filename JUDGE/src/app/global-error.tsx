"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#02040a] text-[#f5f7fa] flex flex-col items-center justify-center min-h-screen p-4 font-sans">
        <div className="bg-[#0d1018] border border-white/10 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
          <h2 className="text-xl font-medium mb-3">System Error</h2>
          <p className="text-sm text-[#8b93a7] mb-6">
            {error?.message || "A critical application error occurred."}
          </p>
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded bg-[#ff2e9a] text-white font-medium hover:bg-[#ff5cb8] transition-colors"
            onClick={() => reset()}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
