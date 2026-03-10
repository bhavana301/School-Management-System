"use client";

import { useState } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import { Search } from "lucide-react";

export default function AdminAuditPage() {
  const { auditLog } = useData();
  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState<string>("");

  const resources = [...new Set(auditLog.map((e) => e.resource))];
  const filtered = auditLog.filter((e) => {
    const matchSearch =
      !search ||
      e.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      (e.details && e.details.toLowerCase().includes(search.toLowerCase()));
    const matchResource = !resourceFilter || e.resource === resourceFilter;
    return matchSearch && matchResource;
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-5xl px-8 py-12">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">
          Audit Log
        </h1>
        <p className="mb-8 text-zinc-600">Track all data changes and user actions</p>

        <GlowCard className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by user, action, details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-zinc-900"
              />
            </div>
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
            >
              <option value="">All resources</option>
              {resources.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </GlowCard>

        <GlowCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-zinc-600">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-zinc-900">{e.userEmail}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          e.action === "CREATE"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : e.action === "UPDATE"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {e.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-zinc-600">{e.resource}</td>
                    <td className="max-w-xs truncate px-6 py-3 text-sm text-zinc-500">{e.details ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-500">No audit entries match your filters.</div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
