"use client";

import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { Users, UserCog, ScrollText, Settings, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { students, staff, auditLog } = useData();
  const { user } = useAuth();

  const cards = [
    { label: "Users & Access", value: "Manage", href: "/admin/users", icon: UserCog },
    { label: "Staff", value: staff.length.toString(), href: "/admin/staff", icon: Users },
    { label: "Audit Log", value: auditLog.length.toString(), href: "/admin/audit", icon: ScrollText },
    { label: "Settings", value: "Configure", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-6xl px-8 py-12">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Admin
            </h1>
            <p className="text-zinc-600">Control panel for {user?.name}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href}>
                <GlowCard className="h-full transition-transform hover:scale-[1.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-500">{c.label}</p>
                      <p className="mt-2 text-2xl font-bold text-zinc-900">{c.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </GlowCard>
              </Link>
            );
          })}
        </div>

        <GlowCard className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Recent audit activity</h2>
          <div className="mt-4 space-y-2">
            {auditLog.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm"
              >
                <span className="font-medium text-cyan-400">{entry.action}</span>
                <span className="text-zinc-600">{entry.resource}</span>
                {entry.resourceId && <span className="text-zinc-500">#{entry.resourceId.slice(-6)}</span>}
                <span className="text-zinc-500">by {entry.userEmail}</span>
                <span className="text-zinc-600">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            ))}
            {auditLog.length === 0 && <p className="text-zinc-500">No activity yet.</p>}
          </div>
          <Link href="/admin/audit" className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300">
            View full audit log →
          </Link>
        </GlowCard>
      </div>
    </div>
  );
}
