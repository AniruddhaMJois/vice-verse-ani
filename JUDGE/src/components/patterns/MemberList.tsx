"use client";

import React from "react";
import { TeamMember } from "@shared/types/database";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export interface MemberListProps {
  members: TeamMember[];
  className?: string;
}

export function MemberList({ members, className }: MemberListProps) {
  if (!members || members.length === 0) {
    return (
      <div className="p-4 rounded-control bg-surface-2 border border-border text-text-muted text-xs font-mono text-center">
        No team members registered in dossier.
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-3 p-3 bg-surface border border-border rounded-control hover:border-border-strong hover:bg-surface-2 transition-all select-none"
        >
          {/* Avatar with conic dual-accent gradient ring */}
          <div
            className="relative p-[1.5px] rounded-full shrink-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center font-mono text-xs font-bold text-white">
              {member.member_name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Member Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-medium text-white truncate">{member.member_name}</span>
              {member.is_lead && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-[3px] bg-accent/15 text-accent border border-accent/30 font-mono text-[9px] font-bold uppercase tracking-wider shrink-0">
                  <Star className="w-2.5 h-2.5 fill-accent text-accent" />
                  <span>Lead</span>
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-text-muted">Branch:</span>
              <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-[3px] bg-surface-3 border border-border text-text">
                {member.branch}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
