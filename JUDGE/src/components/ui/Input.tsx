"use client";

import React, { forwardRef, useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { shakeVariants } from "@/lib/motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "prompt";
  onPromptSubmit?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      errorMessage,
      isSuccess,
      leftIcon,
      rightIcon,
      variant = "default",
      onPromptSubmit,
      disabled,
      ...props
    },
    ref
  ) => {
    const isError = Boolean(errorMessage);

    if (variant === "prompt") {
      return (
        <div className="relative w-full max-w-[640px] group">
          <div className="absolute -inset-0.5 rounded-control bg-gradient-to-r from-neon-blue/20 via-neon-pink/20 to-neon-purple/20 opacity-0 blur group-focus-within:opacity-100 transition duration-300" />
          <div className="relative flex items-center w-full h-14 bg-[#050505] border border-border rounded-control overflow-hidden px-4 gap-3 focus-within:border-neon-pink focus-within:ring-1 focus-within:ring-neon-pink transition-all">
            {leftIcon && <span className="text-text-muted shrink-0">{leftIcon}</span>}
            <input
              ref={ref}
              type={type}
              disabled={disabled}
              className={cn(
                "flex-1 bg-transparent text-text text-sm font-sans placeholder:text-text-faint placeholder:font-mono focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
                className
              )}
              {...props}
            />
            <button
              type="button"
              onClick={onPromptSubmit}
              disabled={disabled}
              className="w-10 h-10 rounded-[2px] bg-white text-text-inverse hover:bg-neon-pink hover:text-white transition-all flex items-center justify-center shrink-0 disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block font-mono text-xs uppercase tracking-wider text-text-muted font-medium">
            {label}
          </label>
        )}

        <motion.div
          animate={isError ? "shake" : undefined}
          variants={shakeVariants}
          className="relative flex items-center"
        >
          {leftIcon && (
            <span className="absolute left-3.5 text-text-muted pointer-events-none shrink-0">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3.5 bg-surface-2 border text-sm font-sans text-text rounded-control transition-all duration-150",
              "placeholder:text-text-faint placeholder:font-mono",
              "hover:border-border-strong",
              "focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink focus:shadow-glow-pink",
              leftIcon && "pl-10",
              (rightIcon || isSuccess || isError) && "pr-10",
              isError
                ? "border-danger focus:border-danger focus:ring-danger"
                : isSuccess
                ? "border-success focus:border-success focus:ring-success"
                : "border-border",
              disabled && "opacity-40 cursor-not-allowed bg-surface-3",
              className
            )}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
            {isSuccess && !isError && <Check className="w-4 h-4 text-success" />}
            {isError && <AlertCircle className="w-4 h-4 text-danger" />}
            {rightIcon && !isError && !isSuccess && (
              <span className="text-text-muted pointer-events-auto">{rightIcon}</span>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isError ? (
            <motion.p
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              className="font-sans text-xs text-danger flex items-center gap-1 mt-1"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errorMessage}</span>
            </motion.p>
          ) : helperText ? (
            <p className="font-sans text-xs text-text-muted mt-1">{helperText}</p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
