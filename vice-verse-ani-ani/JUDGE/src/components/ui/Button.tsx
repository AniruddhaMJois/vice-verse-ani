"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono font-medium select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-text-inverse hover:-translate-y-[1px] hover:shadow-glow-pink hover:border hover:border-accent border border-transparent font-semibold",
        commit:
          "bg-white text-text-inverse hover:-translate-y-[1px] hover:shadow-glow-green hover:border hover:border-signal border border-transparent font-semibold",
        secondary:
          "bg-transparent border border-border-strong text-text hover:bg-surface-2 hover:border-accent hover:text-accent-hot",
        "secondary-green":
          "bg-transparent border border-border-strong text-text hover:bg-surface-2 hover:border-signal hover:text-signal",
        ghost:
          "bg-transparent text-text-muted hover:text-text hover:bg-surface-2 border border-transparent",
        destructive:
          "bg-transparent border border-danger text-danger hover:bg-danger-bg hover:border-danger",
        link:
          "bg-transparent text-accent underline-offset-4 hover:underline p-0 h-auto",
        icon:
          "bg-transparent border border-border text-text-muted hover:text-text hover:border-border-strong hover:bg-surface-2 p-0 aspect-square",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-control gap-1.5",
        md: "h-10 px-4 text-sm rounded-control gap-2",
        lg: "h-12 px-6 text-sm rounded-control gap-2.5",
        icon: "h-10 w-10 rounded-control",
        "icon-sm": "h-8 w-8 rounded-control",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  lockedTooltip?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      lockedTooltip,
      ...props
    },
    ref
  ) => {
    const isActuallyDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isActuallyDisabled}
        aria-busy={isLoading}
        title={lockedTooltip || props.title}
        className={cn(buttonVariants({ variant, size, className }), "group")}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        ) : (
          leftIcon && <span className="shrink-0 group-hover:-translate-x-0.5 transition-transform">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0 group-hover:translate-x-1 transition-transform">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
