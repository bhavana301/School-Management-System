"use client";

import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { siteConfig } from "@/config/site";

export default function AdminSettingsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-2xl px-8 py-12">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">
          Settings
        </h1>
        <p className="mb-8 text-zinc-600">System configuration</p>

        <GlowCard>
          <h2 className="text-lg font-semibold text-zinc-900">General</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm text-zinc-500">Application name</dt>
              <dd className="text-zinc-900">{siteConfig.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-500">Version</dt>
              <dd className="text-zinc-900">{siteConfig.version}</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-500">Support email</dt>
              <dd className="text-zinc-900">{siteConfig.supportEmail}</dd>
            </div>
          </dl>
        </GlowCard>

        <GlowCard className="mt-6">
          <h2 className="text-lg font-semibold text-zinc-900">Data & security</h2>
          <p className="mt-2 text-sm text-zinc-600">
            In production, configure database connection, backup schedule, and security policies (password rules, session timeout, 2FA).
          </p>
        </GlowCard>
      </div>
    </div>
  );
}
