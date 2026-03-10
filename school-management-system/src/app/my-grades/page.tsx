"use client";

import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { Award } from "lucide-react";

export default function MyGradesPage() {
  const { user } = useAuth();
  const { grades, subjects } = useData();
  const studentId = user?.role === "student" ? user?.id : null;
  const myGrades = studentId ? grades.filter((g) => g.studentId === studentId) : [];

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-4xl px-8 py-12">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">My Grades</h1>
            <p className="text-zinc-600">Your marks and grades</p>
          </div>
        </div>

        <GlowCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Term</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Year</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Marks</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Grade</th>
                </tr>
              </thead>
              <tbody>
                {myGrades.map((g) => (
                  <tr key={g.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{getSubjectName(g.subjectId)}</td>
                    <td className="px-6 py-4 text-zinc-600">{g.term}</td>
                    <td className="px-6 py-4 text-zinc-600">{g.year}</td>
                    <td className="px-6 py-4 text-cyan-600 font-semibold">{g.marks} / {g.maxMarks}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-lg border px-2 py-1 text-sm font-semibold ${
                        g.grade.startsWith("A") ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                        g.grade.startsWith("B") ? "border-cyan-300 bg-cyan-50 text-cyan-700" :
                        g.grade === "F" ? "border-red-300 bg-red-50 text-red-700" :
                        "border-amber-300 bg-amber-50 text-amber-700"
                      }`}>
                        {g.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {myGrades.length === 0 && (
            <div className="py-12 text-center text-zinc-500">No grades recorded yet.</div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
