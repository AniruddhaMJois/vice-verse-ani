"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Layers, LogOut, ArrowRight, Users, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Dialog } from "@/components/ui/Dialog";

export function CommandPalette() {
  const router = useRouter();
  const { user, isJudge, isMentor, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    {
      group: "Navigation",
      items: user
        ? isJudge
          ? [
              {
                id: "judge-dashboard",
                label: "Judge Dashboard / Command Center",
                icon: <Layers className="w-4 h-4 text-accent" />,
                action: () => router.push("/judge/dashboard"),
              },
              {
                id: "judge-teams",
                label: "Team Identifier & Dossier Roster",
                icon: <Users className="w-4 h-4 text-signal" />,
                action: () => router.push("/judge/teams"),
              },
            ]
          : [
              {
                id: "mentor-dashboard",
                label: "Mentor Observational Console",
                icon: <Layers className="w-4 h-4 text-signal" />,
                action: () => router.push("/mentor/dashboard"),
              },
              {
                id: "mentor-teams",
                label: "Team Dossier & Observational Overview",
                icon: <Users className="w-4 h-4 text-accent" />,
                action: () => router.push("/mentor/teams"),
              },
            ]
        : [
            {
              id: "home",
              label: "ViceVerse Home",
              icon: <Home className="w-4 h-4 text-accent" />,
              action: () => router.push("/"),
            },
            {
              id: "judge-login",
              label: "Judge Portal Login",
              icon: <Layers className="w-4 h-4 text-accent" />,
              action: () => router.push("/judge/login"),
            },
            {
              id: "mentor-login",
              label: "Mentor Portal Login",
              icon: <Layers className="w-4 h-4 text-signal" />,
              action: () => router.push("/mentor/login"),
            },
          ],
    },
    ...(user
      ? [
          {
            group: "Session",
            items: [
              {
                id: "logout",
                label: "Sign Out of Portal",
                icon: <LogOut className="w-4 h-4 text-danger" />,
                action: () => {
                  const role = user.role;
                  logout();
                  router.push(role === "judge" ? "/judge/login" : "/mentor/login");
                },
              },
            ],
          },
        ]
      : []),
  ];

  const filteredCommands = commands
    .map((grp) => ({
      ...grp,
      items: grp.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((grp) => grp.items.length > 0);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      maxWidth="md"
      showCloseButton={false}
    >
      <div className="space-y-3">
        {/* Search Bar inside Palette */}
        <div className="flex items-center gap-3 px-3 py-2 bg-surface-2 border border-border rounded-control focus-within:border-accent">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to page..."
            autoFocus
            className="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none font-mono"
          />
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-border text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Command Groups */}
        <div className="max-h-[300px] overflow-y-auto space-y-3 py-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-text-muted">
              No commands matching &quot;{query}&quot;
            </div>
          ) : (
            filteredCommands.map((grp) => (
              <div key={grp.group} className="space-y-1">
                <div className="font-mono text-[10px] uppercase font-bold text-text-faint px-2 tracking-wider">
                  {grp.group}
                </div>
                {grp.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded text-xs font-mono text-text hover:bg-surface-2 hover:text-white transition-colors group text-left relative"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-faint">
          <span>Navigate with arrows</span>
          <span>ENTER to select</span>
        </div>
      </div>
    </Dialog>
  );
}
