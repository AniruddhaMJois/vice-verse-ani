"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { shakeVariants } from "@/lib/motion";

export interface PinInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  isError?: boolean;
  isSuccess?: boolean;
  disabled?: boolean;
  mask?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function PinInput({
  length = 4,
  value = "",
  onChange,
  onComplete,
  isError = false,
  isSuccess = false,
  disabled = false,
  mask = true,
  autoFocus = false,
  className,
}: PinInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));

  useEffect(() => {
    const chars = value.split("").slice(0, length);
    const newDigits = Array(length).fill("");
    for (let i = 0; i < length; i++) {
      newDigits[i] = chars[i] || "";
    }
    setDigits(newDigits);
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      onChange(nextDigits.join(""));
      return;
    }

    const single = clean.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = single;
    setDigits(nextDigits);

    const fullVal = nextDigits.join("");
    onChange(fullVal);

    if (fullVal.length === length) {
      onComplete?.(fullVal);
    }

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    const nextDigits = Array(length).fill("");
    for (let i = 0; i < length; i++) {
      nextDigits[i] = pasted[i] || "";
    }
    setDigits(nextDigits);
    const fullVal = nextDigits.join("");
    onChange(fullVal);

    if (fullVal.length === length) {
      onComplete?.(fullVal);
      inputsRef.current[length - 1]?.focus();
    } else {
      const nextEmpty = nextDigits.findIndex((d) => !d);
      if (nextEmpty !== -1) {
        inputsRef.current[nextEmpty]?.focus();
      }
    }
  };

  return (
    <motion.div
      animate={isError ? "shake" : undefined}
      variants={shakeVariants}
      className={cn("flex items-center justify-center gap-2.5 sm:gap-3.5", className)}
    >
      {Array.from({ length }).map((_, idx) => {
        const val = digits[idx] || "";
        const isFilled = Boolean(val);

        return (
          <div key={idx} className="relative">
            <input
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type={mask ? "password" : "text"}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              disabled={disabled}
              value={val}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={cn(
                "w-12 h-14 sm:w-[52px] sm:h-[60px] text-center font-mono text-2xl font-bold rounded-control transition-all duration-150 select-none",
                "bg-surface-2 border text-text",
                "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent focus:shadow-glow-pink",
                isError
                  ? "border-danger text-danger bg-danger-bg"
                  : isSuccess
                  ? "border-signal text-signal bg-signal-bg shadow-[0_0_16px_rgba(0,255,65,0.35)]"
                  : isFilled
                  ? "border-border-strong text-signal"
                  : "border-border text-text-faint",
                disabled && "opacity-40 cursor-not-allowed bg-surface-3"
              )}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
