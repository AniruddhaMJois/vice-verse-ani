"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Save, Send, Edit3, Lock, CheckCircle } from "lucide-react";
import { EvaluationStatus } from "@shared/types/database";
import { cn } from "@/lib/cn";

export interface ActionBarProps {
  status: EvaluationStatus;
  isEditing: boolean;
  isSaving: boolean;
  isReadOnly?: boolean;
  onEdit: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  statusText?: string;
  className?: string;
}

export function ActionBar({
  status,
  isEditing,
  isSaving,
  isReadOnly = false,
  onEdit,
  onSaveDraft,
  onSubmit,
  statusText,
  className,
}: ActionBarProps) {
  const isSubmitted = status === "submitted";
  const isDraftSaved = status === "draft" && !isEditing;

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-20 w-full bg-surface/90 backdrop-blur-md border-t border-border p-4 sm:px-6 shadow-pop",
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Autosave / Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          {isSubmitted ? (
            <span className="flex items-center gap-1.5 text-signal font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-signal shadow-sm" />
              <span>Evaluation Finalized &amp; Locked</span>
            </span>
          ) : isDraftSaved ? (
            <span className="flex items-center gap-1.5 text-warning font-medium">
              <Save className="w-3.5 h-3.5 text-warning" />
              <span>Draft Saved in Consensus Node</span>
            </span>
          ) : isReadOnly ? (
            <span className="flex items-center gap-1.5 text-text-faint">
              <Lock className="w-3.5 h-3.5" />
              <span>View-Only Observer Access</span>
            </span>
          ) : (
            <span className="text-text-faint">
              {statusText || "Unsaved changes &bull; Auto-tracking active"}
            </span>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {isReadOnly ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={true}
              lockedTooltip="Observer access: scoring is available to judges only"
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Evaluation Locked
            </Button>
          ) : isSubmitted ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={true}
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Submitted (Locked)
            </Button>
          ) : isDraftSaved ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Draft
              </Button>
              <Button
                variant="commit"
                size="sm"
                onClick={onSubmit}
                isLoading={isSaving}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Submit Final
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary-green"
                size="sm"
                onClick={onSaveDraft}
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save Draft
              </Button>
              <Button
                variant="commit"
                size="sm"
                onClick={onSubmit}
                isLoading={isSaving}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Submit Evaluation
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
