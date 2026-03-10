"use client";

import { useState, useMemo } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import type { Grade } from "@/types";
import { Award, Plus, Filter } from "lucide-react";

function getGradeFromMarks(marks: number, maxMarks: number): string {
  const p = (marks / maxMarks) * 100;
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B+";
  if (p >= 60) return "B";
  if (p >= 50) return "C";
  if (p >= 40) return "D";
  return "F";
}

export default function GradesPage() {
  const { students, grades, subjects, addOrUpdateGrade } = useData();
  const [filterStudent, setFilterStudent] = useState<string>("");
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterTerm, setFilterTerm] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Grade> & { studentId: string; subjectId: string; term: string; marks: number; maxMarks: number }>({
    studentId: "",
    subjectId: "",
    term: "Term 1",
    marks: 0,
    maxMarks: 100,
    year: new Date().getFullYear(),
  });

  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      if (filterStudent && g.studentId !== filterStudent) return false;
      if (filterSubject && g.subjectId !== filterSubject) return false;
      if (filterTerm && g.term !== filterTerm) return false;
      return true;
    });
  }, [grades, filterStudent, filterSubject, filterTerm]);

  const terms = useMemo(() => [...new Set(grades.map((g) => g.term))], [grades]);
  if (terms.length === 0 && grades.length === 0) terms.push("Term 1");

  const openAdd = () => {
    setForm({
      studentId: students[0]?.id ?? "",
      subjectId: subjects[0]?.id ?? "",
      term: "Term 1",
      marks: 0,
      maxMarks: 100,
      year: new Date().getFullYear(),
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grade = getGradeFromMarks(form.marks ?? 0, form.maxMarks ?? 100);
    addOrUpdateGrade({
      studentId: form.studentId!,
      subjectId: form.subjectId!,
      term: form.term!,
      marks: form.marks!,
      maxMarks: form.maxMarks!,
      grade,
      year: form.year ?? new Date().getFullYear(),
    });
    setModalOpen(false);
  };

  const getStudentName = (id: string) => students.find((s) => s.id === id)?.name ?? id;
  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-7xl px-8 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Marks & Grades
            </h1>
            <p className="mt-2 text-zinc-600">View and manage student grades</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-5 w-5" /> Add Grade
          </button>
        </div>

        <GlowCard className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="h-5 w-5 text-zinc-600" />
            <select
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">All Students</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">All Terms</option>
              {terms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </GlowCard>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGrades.map((g) => (
            <GlowCard key={g.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-zinc-900">{getStudentName(g.studentId)}</p>
                  <p className="text-sm text-zinc-600">{getSubjectName(g.subjectId)}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {g.term} • {g.year}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-cyan-400">
                    {g.marks}/{g.maxMarks}
                  </span>
                  <span
                    className={`mt-1 rounded-lg border px-2 py-0.5 text-sm font-semibold ${
                      g.grade.startsWith("A")
                        ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                        : g.grade.startsWith("B")
                          ? "border-cyan-500/30 bg-cyan-500/20 text-cyan-400"
                          : g.grade === "F"
                            ? "border-red-500/30 bg-red-500/20 text-red-400"
                            : "border-amber-500/30 bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {g.grade}
                  </span>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>

        {filteredGrades.length === 0 && (
          <GlowCard className="py-16 text-center">
            <Award className="mx-auto h-12 w-12 text-zinc-600" />
            <p className="mt-4 text-zinc-500">No grades match the filters.</p>
            <button
              onClick={openAdd}
              className="mt-4 text-cyan-400 hover:text-cyan-300"
            >
              Add a grade
            </button>
          </GlowCard>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <GlowCard className="relative mx-4 w-full max-w-md">
            <h2 className="text-xl font-semibold text-zinc-900">Add Grade</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Student</label>
                <select
                  required
                  value={form.studentId}
                  onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Roll {s.rollNo})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Subject</label>
                <select
                  required
                  value={form.subjectId}
                  onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Term</label>
                  <input
                    value={form.term}
                    onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Year</label>
                  <input
                    type="number"
                    value={form.year ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value, 10) || undefined }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Marks</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.marks ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, marks: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Max Marks</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.maxMarks ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, maxMarks: parseInt(e.target.value, 10) || 100 }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-2.5 font-medium text-zinc-900"
                >
                  Add Grade
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-5 py-2.5 font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlowCard>
        </div>
      )}
    </div>
  );
}
