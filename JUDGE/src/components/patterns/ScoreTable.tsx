"use client";

import React, { useRef } from "react";
import { Criterion } from "@/lib/data/types";
import { Check, Lock, AlertCircle, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ScoreTableProps {
  criteria: Criterion[];
  marks: Record<string, number>;
  onChange: (criterionId: string, value: number) => void;
  isLocked?: boolean;
  isReadOnly?: boolean;
  className?: string;
}

export function ScoreTable({
  criteria,
  marks,
  onChange,
  isLocked = false,
  isReadOnly = false,
  className,
}: ScoreTableProps) {
  const isDisabled = isLocked || isReadOnly;
  const repeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalPossible = criteria.reduce((sum, c) => sum + c.maxMarks, 0);
  const totalObtained = criteria.reduce((sum, c) => sum + (marks[c.id] || 0), 0);
  const scoredCount = criteria.filter((c) => marks[c.id] !== undefined && marks[c.id] > 0).length;
  const isFullyComplete = criteria.length > 0 && scoredCount === criteria.length;
  const percentage = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

  const handleInputChange = (critId: string, max: number, rawVal: string) => {
    if (isDisabled) return;
    const clean = rawVal.replace(/[^0-9]/g, "");
    if (clean === "") {
      onChange(critId, 0);
      return;
    }
    const parsed = parseInt(clean, 10);
    if (!isNaN(parsed)) {
      onChange(critId, parsed);
    }
  };

  const handleBlur = (critId: string, max: number) => {
    const current = marks[critId] ?? 0;
    if (current > max) {
      onChange(critId, max);
    } else if (current < 0 || isNaN(current)) {
      onChange(critId, 0);
    }
  };

  const handleStep = (critId: string, max: number, delta: number) => {
    if (isDisabled) return;
    const current = marks[critId] ?? 0;
    const next = Math.max(0, Math.min(current + delta, max));
    onChange(critId, next);
  };

  const startHoldStep = (critId: string, max: number, delta: number) => {
    if (isDisabled) return;
    handleStep(critId, max, delta);
    repeatTimerRef.current = setTimeout(() => {
      repeatTimerRef.current = setInterval(() => {
        handleStep(critId, max, delta);
      }, 100);
    }, 400);
  };

  const stopHoldStep = () => {
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  };

  return (
    <div className={cn("w-full bg-surface border-2 border-white rounded-card overflow-hidden select-none shadow-xl", className)}>
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-11 bg-surface-2/80 border-b border-white/20 text-[11px] font-mono font-medium text-text-muted uppercase tracking-wider">
              <th className="px-5 w-14 text-center">
                <span className="text-signal font-bold mr-1">//</span>#
              </th>
              <th className="px-5">Criteria &amp; Rubric Description</th>
              <th className="px-5 w-32 text-center">Max Marks</th>
              <th className="px-5 w-56 text-right">Marks Allotted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {criteria.map((crit, idx) => {
              const currentScore = marks[crit.id] ?? 0;
              const hasScore = marks[crit.id] !== undefined;
              const isOver = currentScore > crit.maxMarks;
              const isMax = currentScore >= crit.maxMarks;
              const isMin = currentScore <= 0;

              return (
                <tr
                  key={crit.id}
                  className="h-20 hover:bg-surface-2/60 transition-colors group"
                >
                  {/* Index with green within-range check */}
                  <td className="px-5 text-center font-mono text-xs text-text-faint">
                    {hasScore && currentScore > 0 && !isOver ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-signal-bg text-signal border border-signal/30 shadow-[0_0_6px_rgba(0,255,65,0.3)]">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span>{String(idx + 1).padStart(2, "0")}</span>
                    )}
                  </td>

                  {/* Criteria info */}
                  <td className="px-5 py-3">
                    <div className="font-medium text-sm text-white group-hover:text-accent transition-colors">
                      {crit.name}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5 leading-relaxed max-w-xl">
                      {crit.description}
                    </div>
                  </td>

                  {/* Max Marks */}
                  <td className="px-5 text-center font-mono text-sm text-white font-semibold tabular-nums">
                    {crit.maxMarks}
                  </td>

                  {/* Marks Input (Typing Only + External Chevrons) */}
                  <td className="px-5 text-right">
                    {isDisabled ? (
                      <div className="inline-flex items-center justify-end gap-2 font-mono text-base font-bold text-white tabular-nums px-3.5 py-1.5 bg-surface-2 border-2 border-white rounded shadow-sm">
                        <span className="text-signal">{currentScore}</span>
                        <span className="text-text-muted text-xs">/ {crit.maxMarks}</span>
                        {isLocked && <Lock className="w-3.5 h-3.5 text-text-muted ml-1" />}
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* External Step Down Chevron Button */}
                        <button
                          type="button"
                          aria-label={`Decrease marks for ${crit.name}`}
                          disabled={isMin}
                          onMouseDown={() => startHoldStep(crit.id, crit.maxMarks, -1)}
                          onMouseUp={stopHoldStep}
                          onMouseLeave={stopHoldStep}
                          onTouchStart={() => startHoldStep(crit.id, crit.maxMarks, -1)}
                          onTouchEnd={stopHoldStep}
                          className="w-9 h-9 rounded-[4px] bg-surface-2 hover:bg-surface-3 border-2 border-white/70 hover:border-white text-white hover:text-accent disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shrink-0"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        {/* Typing Only Input Box: bold white border */}
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={currentScore === 0 && !hasScore ? "" : currentScore}
                            onChange={(e) => handleInputChange(crit.id, crit.maxMarks, e.target.value)}
                            onBlur={() => handleBlur(crit.id, crit.maxMarks)}
                            onWheel={(e) => e.currentTarget.blur()}
                            onKeyDown={(e) => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                e.preventDefault();
                              }
                            }}
                            className={cn(
                              "w-24 h-9 px-3 text-right font-mono text-sm font-bold bg-surface-2 border-2 rounded transition-all tabular-nums text-white shadow-sm",
                              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                              "focus:outline-none focus:border-accent focus:shadow-glow-pink",
                              isOver ? "border-danger text-danger bg-danger/10" : "border-white",
                              hasScore && currentScore > 0 && !isOver && "border-white text-signal font-extrabold"
                            )}
                          />
                          {isOver && (
                            <span className="absolute -top-6 right-0 text-[10px] font-mono text-danger flex items-center gap-1 bg-void px-1.5 py-0.5 rounded border border-danger/40">
                              <AlertCircle className="w-3 h-3" /> Max {crit.maxMarks}
                            </span>
                          )}
                        </div>

                        {/* External Step Up Chevron Button */}
                        <button
                          type="button"
                          aria-label={`Increase marks for ${crit.name}`}
                          disabled={isMax}
                          onMouseDown={() => startHoldStep(crit.id, crit.maxMarks, 1)}
                          onMouseUp={stopHoldStep}
                          onMouseLeave={stopHoldStep}
                          onTouchStart={() => startHoldStep(crit.id, crit.maxMarks, 1)}
                          onTouchEnd={stopHoldStep}
                          className="w-9 h-9 rounded-[4px] bg-surface-2 hover:bg-surface-3 border-2 border-white/70 hover:border-white text-white hover:text-accent disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (<768px) */}
      <div className="md:hidden divide-y divide-border">
        {criteria.map((crit, idx) => {
          const currentScore = marks[crit.id] ?? 0;
          const hasScore = marks[crit.id] !== undefined;
          const isOver = currentScore > crit.maxMarks;
          const isMax = currentScore >= crit.maxMarks;
          const isMin = currentScore <= 0;

          return (
            <div key={crit.id} className="p-4 space-y-3 bg-surface">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-surface-2 text-accent border border-border">
                    #{idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{crit.name}</h4>
                </div>
                <span className="font-mono text-xs text-text-muted">
                  Max: <strong className="text-white">{crit.maxMarks}</strong>
                </span>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">{crit.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-border-faint">
                <span className="font-mono text-xs text-text-muted">Allotted Marks</span>

                {isDisabled ? (
                  <span className="font-mono text-base font-bold text-signal tabular-nums">
                    {currentScore} / {crit.maxMarks}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease marks for ${crit.name}`}
                      disabled={isMin}
                      onClick={() => handleStep(crit.id, crit.maxMarks, -1)}
                      className="w-11 h-11 rounded bg-surface-2 border-2 border-white text-white flex items-center justify-center font-mono text-lg hover:text-accent disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={currentScore === 0 && !hasScore ? "" : currentScore}
                      onChange={(e) => handleInputChange(crit.id, crit.maxMarks, e.target.value)}
                      onBlur={() => handleBlur(crit.id, crit.maxMarks)}
                      className={cn(
                        "w-20 h-11 text-center font-mono text-base font-bold bg-surface-2 border-2 rounded text-white focus:border-accent",
                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        isOver ? "border-danger text-danger" : "border-white"
                      )}
                    />

                    <button
                      type="button"
                      aria-label={`Increase marks for ${crit.name}`}
                      disabled={isMax}
                      onClick={() => handleStep(crit.id, crit.maxMarks, 1)}
                      className="w-11 h-11 rounded bg-surface-2 border-2 border-white text-white flex items-center justify-center font-mono text-lg hover:text-accent disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Row: Grand Total + Animated Progress HUD */}
      <div className="p-5 sm:px-6 bg-surface-2/90 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-text-muted font-medium">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-signal inline-block shadow-[0_0_4px_var(--signal)]" />
              <span>Grand Total Awarded</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={cn(
                  "text-3xl sm:text-4xl font-mono font-bold tabular-nums transition-all duration-300",
                  isFullyComplete
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-signal-lime via-signal to-signal-dim shadow-sm"
                    : "bg-clip-text text-transparent bg-gradient-to-r from-accent-3 via-accent to-accent-hot"
                )}
              >
                {totalObtained}
              </span>
              <span className="font-mono text-lg text-text-faint">/ {totalPossible}</span>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-text-muted">Rubric Completion</span>
              <span className={percentage === 100 ? "font-semibold text-signal" : "font-semibold text-white"}>
                {percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden border border-border-faint">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
