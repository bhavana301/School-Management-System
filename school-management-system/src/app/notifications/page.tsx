"use client";

import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { Bell, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

const typeConfig = {
  info: { icon: Info, color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30" },
  warning: { icon: AlertTriangle, color: "text-amber-400 bg-amber-500/20 border-amber-500/30" },
  success: { icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30" },
  alert: { icon: AlertCircle, color: "text-red-400 bg-red-500/20 border-red-500/30" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useData();
  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-2xl px-8 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r text-4xl font-bold text-zinc-900 tracking-tight text-transparent">
              Notifications
            </h1>
            <p className="mt-2 text-zinc-600">{unread.length} unread</p>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((n) => {
            const config = typeConfig[n.type];
            const Icon = config.icon;
            const content = (
              <GlowCard
                className={`cursor-pointer transition-opacity ${n.read ? "opacity-75" : ""}`}
                onClick={() => !n.read && markNotificationRead(n.id)}
              >
                <div className="flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-900">{n.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{n.message}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(n.createdAt).toLocaleString()}
                      {!n.read && <span className="ml-2 rounded bg-cyan-500/20 px-1.5 py-0.5 text-cyan-400">New</span>}
                    </p>
                  </div>
                </div>
              </GlowCard>
            );
            return n.link ? (
              <Link key={n.id} href={n.link}>
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <GlowCard className="py-16 text-center">
            <Bell className="mx-auto h-12 w-12 text-zinc-600" />
            <p className="mt-4 text-zinc-500">No notifications yet.</p>
          </GlowCard>
        )}
      </div>
    </div>
  );
}
