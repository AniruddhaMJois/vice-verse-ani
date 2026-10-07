"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("bg-surface-2 animate-shimmer rounded-control", className)}
      {...props}
    />
  );
}
