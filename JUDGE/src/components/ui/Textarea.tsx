"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, errorMessage, disabled, rows = 3, ...props }, ref) => {
    const isError = Boolean(errorMessage);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block font-mono text-xs uppercase tracking-wider text-text-muted font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            "w-full p-3.5 bg-surface-2 border text-sm font-sans text-text rounded-control transition-all duration-150 resize-y",
            "placeholder:text-text-faint placeholder:font-mono",
            "hover:border-border-strong",
            "focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink focus:shadow-glow-pink",
            isError ? "border-danger" : "border-border",
            disabled && "opacity-40 cursor-not-allowed bg-surface-3",
            className
          )}
          {...props}
        />
        {errorMessage ? (
          <p className="font-sans text-xs text-danger">{errorMessage}</p>
        ) : helperText ? (
          <p className="font-sans text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
