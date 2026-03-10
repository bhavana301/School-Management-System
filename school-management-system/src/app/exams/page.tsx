"use client";

import { useState } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import type { Exam } from "@/types";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";

export default function ExamsPage() {
  const { exams, subjects, addExam, updateExam, deleteExam } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);
  const [form, setForm] = useState<Partial<Exam>>({
    name: "",
    subjectId: "",
    class: "",
    section: "",
    date: "",
    startTime: "09:00",
    endTime: "11:00",
    maxMarks: 100,
    room: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      subjectId: subjects[0]?.id ?? "",
      class: "",
      section: "",
      date: "",
      startTime: "09:00",
      endTime: "11:00",
      maxMarks: 100,
      room: "",
    });
    setModalOpen(true);
  };

  const openEdit = (e: Exam) => {
    setEditing(e);
    setForm({ ...e });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateExam(editing.id, form);
    } else {
      addExam(form as Omit<Exam, "id">);
    }
    setModalOpen(false);
  };

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-5xl px-8 py-12">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="bg-gradient-to-r text-4xl font-bold text-zinc-900 text-transparent">
              Exam Schedule
            </h1>
            <p className="mt-2 text-zinc-600">Manage examination dates and rooms</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 font-medium text-white hover:opacity-90"
          >
            <Plus className="h-5 w-5" /> Add Exam
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {exams.map((ex) => (
            <GlowCard key={ex.id}>
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{ex.name}</p>
                    <p className="text-sm text-zinc-600">{getSubjectName(ex.subjectId)} • Class {ex.class}-{ex.section}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {ex.date} {ex.startTime}–{ex.endTime} {ex.room && `• ${ex.room}`}
                    </p>
                    <p className="text-xs text-cyan-400">Max marks: {ex.maxMarks}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(ex)} className="rounded p-2 text-zinc-600 hover:text-cyan-400">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteExam(ex.id)} className="rounded p-2 text-zinc-600 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>

        {exams.length === 0 && (
          <GlowCard className="py-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-zinc-600" />
            <p className="mt-4 text-zinc-500">No exams scheduled. Add one to get started.</p>
            <button onClick={openAdd} className="mt-4 text-cyan-400 hover:text-cyan-300">
              Add exam
            </button>
          </GlowCard>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <GlowCard className="relative mx-4 w-full max-w-md">
            <h2 className="text-xl font-semibold text-zinc-900">{editing ? "Edit Exam" : "Add Exam"}</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                required
                placeholder="Exam name"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
              />
              <select
                value={form.subjectId ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Class"
                  value={form.class ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
                />
                <input
                  required
                  placeholder="Section"
                  value={form.section ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
                />
              </div>
              <input
                type="date"
                required
                value={form.date ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={form.startTime ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
                />
                <input
                  type="time"
                  value={form.endTime ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
                />
              </div>
              <input
                type="number"
                placeholder="Max marks"
                value={form.maxMarks ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, maxMarks: parseInt(e.target.value, 10) || 0 }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
              />
              <input
                placeholder="Room (optional)"
                value={form.room ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900"
              />
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 rounded-xl bg-cyan-600 py-2.5 font-medium text-white">
                  {editing ? "Update" : "Add"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-zinc-300 px-5 py-2.5 text-zinc-600">
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
