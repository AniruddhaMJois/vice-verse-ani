"use client";

import React, { forwardRef } from "react";
import { User, Check, ShieldCheck, Eye } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IdInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export const ID_REGEX = /^[A-Z]{3}[0-9]{5}$/;

export const IdInput = forwardRef<HTMLInputElement, IdInputProps>(
  ({ value, onChange, label = "Official Login ID", errorMessage, disabled, className, ...props }, ref) => {
    const cleanVal = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    const isValid = ID_REGEX.test(cleanVal);
    const isJudge = cleanVal.startsWith("JDG");
    const isMentor = cleanVal.startsWith("MNR");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const upper = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      onChange(upper);
    };

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wider text-text-muted font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-accent" />
            <span>{label}</span>
          </label>

          {isJudge && (
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-[3px] bg-accent/15 text-accent border border-accent/30 flex items-center gap-1 animate-fadeIn">
              <ShieldCheck className="w-3 h-3" />
              <span>JUDGE ROLE DETECTED</span>
            </span>
          )}
          {isMentor && (
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-[3px] bg-signal/15 text-signal border border-signal/30 flex items-center gap-1 animate-fadeIn">
              <Eye className="w-3 h-3" />
              <span>MENTOR ROLE DETECTED</span>
            </span>
          )}
        </div>

        <div className="relative flex items-center">
          <input
            ref={ref}
            type="text"
            value={cleanVal}
            onChange={handleChange}
            maxLength={8}
            placeholder="JDG10001"
            disabled={disabled}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className={cn(
              "w-full h-11 px-3.5 bg-surface-2 border text-sm font-mono tracking-wider text-text rounded-control transition-all duration-150 uppercase",
              "placeholder:text-text-faint",
              "hover:border-border-strong",
              "focus:outline-none focus:ring-1",
              isValid
                ? "border-signal focus:border-signal focus:ring-signal text-white"
                : errorMessage
                ? "border-danger focus:border-danger focus:ring-danger"
                : "border-border focus:border-accent focus:ring-accent focus:shadow-glow-pink",
              disabled && "opacity-40 cursor-not-allowed bg-surface-3",
              className
            )}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
            {isValid && <Check className="w-4 h-4 text-signal" />}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5 font-mono text-[11px]">
          {errorMessage ? (
            <span className="text-danger font-sans">{errorMessage}</span>
          ) : (
            <span className="text-text-faint">
              Format:{" "}
              <span className={isJudge || isMentor ? "text-signal font-semibold" : "text-text-muted"}>
                {isJudge ? "JDG" : isMentor ? "MNR" : "ABC"}
              </span>
              <span className={cleanVal.length === 8 ? "text-signal font-semibold" : "text-text-faint"}>
                {cleanVal.slice(3) || "12345"}
              </span>
            </span>
          )}
          <span className="text-text-faint">{cleanVal.length}/8</span>
        </div>
      </div>
    );
  }
);

IdInput.displayName = "IdInput";
