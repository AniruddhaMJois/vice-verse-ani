"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { dialogEntranceVariants } from "@/lib/motion";
import { Button } from "./Button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  showCloseButton = true,
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#02040A]/80 backdrop-blur-[6px]"
          />

          {/* Dialog Container */}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={dialogEntranceVariants}
            className={cn(
              "relative w-full bg-surface border border-border rounded-dialog p-6 shadow-pop overflow-hidden z-10",
              maxWidthClass
            )}
          >
            {/* Top 1px Dual Gradient Hairline */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
              }}
            />

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {title && <h3 className="text-lg font-medium text-white tracking-tight">{title}</h3>}
                  {description && <p className="text-xs text-text-muted mt-1 leading-relaxed">{description}</p>}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-[4px] text-text-muted hover:text-white hover:bg-surface-2 transition-colors -mr-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  consequence: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "commit" | "primary" | "destructive";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  consequence,
  confirmLabel = "Submit and Lock",
  cancelLabel = "Cancel",
  variant = "commit",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-warning-bg border border-warning/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
            <p className="font-mono text-xs text-text-muted">Irreversible Jury Action</p>
          </div>
        </div>

        <div className="p-3.5 rounded-[6px] bg-surface-2 border border-border text-xs text-text-muted leading-relaxed">
          <p className="text-text font-medium mb-1">Notice &amp; Consequence:</p>
          <p>{consequence}</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
