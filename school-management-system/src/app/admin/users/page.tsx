"use client";

import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { DEMO_USERS, ROLES } from "@/config/auth";
import { Shield, Mail, User } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-4xl px-8 py-12">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">
          Users & Access
        </h1>
        <p className="mb-8 text-zinc-600">Manage system users and roles (demo: static list)</p>

        <GlowCard>
          <p className="mb-4 text-sm text-zinc-600">
            In production, connect to your auth provider (NextAuth, Clerk, etc.) and a users table.
          </p>
          <div className="space-y-3">
            {DEMO_USERS.map((u) => (
              <div
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
                    <User className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{u.name}</p>
                    <p className="flex items-center gap-1 text-sm text-zinc-500">
                      <Mail className="h-4 w-4" />
                      {u.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-400">{ROLES[u.role]}</span>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
