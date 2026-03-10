"use client";

import { useMemo, useState } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { Download } from "lucide-react";

const COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f87171"];

function exportToCSV(data: Record<string, string>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(","), ...data.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { students, attendance, grades, subjects } = useData();
  const { hasPermission } = useAuth();
  const [exporting, setExporting] = useState(false);

  const canExport = hasPermission("reports:export");

  const today = new Date().toISOString().slice(0, 10);
  const attendanceByStatus = useMemo(() => {
    const todayRec = attendance.filter((a) => a.date === today);
    const counts = { present: 0, absent: 0, late: 0, leave: 0 };
    todayRec.forEach((a) => {
      counts[a.status as keyof typeof counts]++;
    });
    return [
      { name: "Present", value: counts.present, color: COLORS[0] },
      { name: "Absent", value: counts.absent, color: COLORS[3] },
      { name: "Late", value: counts.late, color: COLORS[2] },
      { name: "Leave", value: counts.leave, color: COLORS[4] },
    ].filter((d) => d.value > 0);
  }, [attendance, today]);

  const gradesBySubject = useMemo(() => {
    const bySub: Record<string, { sum: number; count: number }> = {};
    grades.forEach((g) => {
      const sub = subjects.find((s) => s.id === g.subjectId)?.name ?? g.subjectId;
      if (!bySub[sub]) bySub[sub] = { sum: 0, count: 0 };
      bySub[sub].sum += (g.marks / g.maxMarks) * 100;
      bySub[sub].count++;
    });
    return Object.entries(bySub).map(([name, v]) => ({ name, average: Number((v.sum / v.count).toFixed(1)), count: v.count }));
  }, [grades, subjects]);

  const classDistribution = useMemo(() => {
    const byClass: Record<string, number> = {};
    students.forEach((s) => {
      const key = `${s.class}-${s.section}`;
      byClass[key] = (byClass[key] ?? 0) + 1;
    });
    return Object.entries(byClass).map(([name, count]) => ({ name, count }));
  }, [students]);

  const handleExportStudents = () => {
    if (!canExport) return;
    setExporting(true);
    const data = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      rollNo: s.rollNo,
      class: s.class,
      section: s.section,
      guardianName: s.guardianName,
    }));
    exportToCSV(data, `students-${today}.csv`);
    setExporting(false);
  };

  const handleExportGrades = () => {
    if (!canExport) return;
    setExporting(true);
    const data = grades.map((g) => {
      const student = students.find((s) => s.id === g.studentId);
      const subject = subjects.find((s) => s.id === g.subjectId);
      return {
        studentName: student?.name ?? "",
        subject: subject?.name ?? "",
        term: g.term,
        marks: String(g.marks),
        maxMarks: String(g.maxMarks),
        grade: g.grade,
      };
    });
    exportToCSV(data, `grades-${today}.csv`);
    setExporting(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-7xl px-8 py-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Reports
            </h1>
            <p className="mt-2 text-zinc-600">Analytics and data export</p>
          </div>
          {canExport && (
            <div className="flex gap-2">
              <button
                onClick={handleExportStudents}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Export Students CSV
              </button>
              <button
                onClick={handleExportGrades}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Export Grades CSV
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <GlowCard>
            <h2 className="text-lg font-semibold text-zinc-900">Today&apos;s attendance</h2>
            <p className="text-sm text-zinc-600">By status</p>
            <div className="mt-4 space-y-3">
              {attendanceByStatus.length > 0 ? (
                attendanceByStatus.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-4">
                    <div className="flex h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="w-20 text-sm text-zinc-600">{d.name}</span>
                    <div className="h-6 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (d.value / (students.length || 1)) * 100)}%`, backgroundColor: d.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-zinc-900">{d.value}</span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-zinc-500">No attendance data for today</p>
              )}
            </div>
          </GlowCard>

          <GlowCard>
            <h2 className="text-lg font-semibold text-zinc-900">Average score by subject</h2>
            <p className="text-sm text-zinc-600">Term 1</p>
            <div className="mt-4 space-y-3">
              {gradesBySubject.length > 0 ? (
                gradesBySubject.map((d) => (
                  <div key={d.name} className="flex items-center gap-4">
                    <span className="w-28 truncate text-sm text-zinc-600">{d.name}</span>
                    <div className="h-6 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{ width: `${d.average}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-zinc-900">{d.average}%</span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-zinc-500">No grade data</p>
              )}
            </div>
          </GlowCard>

          <GlowCard className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-zinc-900">Students by class</h2>
            <div className="mt-4 space-y-3">
              {classDistribution.length > 0 ? (
                classDistribution.map((d) => (
                  <div key={d.name} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-zinc-600">{d.name}</span>
                    <div className="h-6 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all"
                        style={{
                          width: `${Math.min(100, (d.count / Math.max(...classDistribution.map((x) => x.count))) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-zinc-900">{d.count}</span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-zinc-500">No students</p>
              )}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
