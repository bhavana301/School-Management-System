"use client";

import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { CalendarDays } from "lucide-react";

export default function MyAttendancePage() {
  const { user } = useAuth();
  const { attendance } = useData();
  const studentId = user?.role === "student" ? user?.id : null;
  const myAttendance = studentId
    ? attendance.filter((a) => a.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date))
    : [];

  const statusClass = (status: string) => {
    switch (status) {
      case "present": return "border-emerald-300 bg-emerald-50 text-emerald-700";
      case "late": return "border-amber-300 bg-amber-50 text-amber-700";
      case "leave": return "border-blue-300 bg-blue-50 text-blue-700";
      default: return "border-red-300 bg-red-50 text-red-700";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-4xl px-8 py-12">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CalendarDays className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">My Attendance</h1>
            <p className="text-zinc-600">Your attendance records</p>
          </div>
        </div>

        <GlowCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {myAttendance.map((a) => (
                  <tr key={a.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{a.date}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-lg border px-2 py-1 text-sm font-medium capitalize ${statusClass(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{a.remarks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {myAttendance.length === 0 && (
            <div className="py-12 text-center text-zinc-500">No attendance records yet.</div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
