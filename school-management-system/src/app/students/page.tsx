"use client";

import { useState } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import type { Student } from "@/types";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const emptyStudent: Omit<Student, "id"> = {
  name: "",
  email: "",
  rollNo: "",
  class: "",
  section: "",
  dateOfBirth: "",
  guardianName: "",
  guardianPhone: "",
  joinedAt: new Date().toISOString().slice(0, 10),
};

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent } = useData();
  const { hasPermission } = useAuth();
  const canDelete = hasPermission("students:delete");
  const canCreate = hasPermission("students:create");
  const canEdit = hasPermission("students:edit");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Student, "id">>(emptyStudent);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search) ||
      s.class.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyStudent);
    setForm((f) => ({ ...f, joinedAt: new Date().toISOString().slice(0, 10) }));
    setModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      email: s.email,
      rollNo: s.rollNo,
      class: s.class,
      section: s.section,
      dateOfBirth: s.dateOfBirth,
      guardianName: s.guardianName,
      guardianPhone: s.guardianPhone,
      joinedAt: s.joinedAt,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateStudent(editingId, form);
    } else {
      addStudent(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-7xl px-8 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Students
            </h1>
            <p className="mt-2 text-zinc-600">Manage student records</p>
          </div>
          {canCreate && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-5 w-5" /> Add Student
            </button>
          )}
        </div>

        <GlowCard className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, roll no, class, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-12 pr-4 text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </GlowCard>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Section</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">Guardian</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-cyan-600">{s.rollNo}</td>
                    <td className="px-6 py-4 font-medium text-zinc-900">{s.name}</td>
                    <td className="px-6 py-4 text-zinc-600">{s.class}</td>
                    <td className="px-6 py-4 text-zinc-600">{s.section}</td>
                    <td className="px-6 py-4 text-zinc-600">{s.guardianName}</td>
                    <td className="px-6 py-4 text-right">
                      {canEdit && (
                        <button
                          onClick={() => openEdit(s)}
                          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-cyan-600"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => deleteStudent(s.id)}
                          className="rounded-lg p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-zinc-500">No students found.</div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <GlowCard className="relative mx-4 w-full max-w-lg">
            <h2 className="text-xl font-semibold text-zinc-900">
              {editingId ? "Edit Student" : "Add Student"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600">Roll No</label>
                  <input
                    required
                    value={form.rollNo}
                    onChange={(e) => setForm((f) => ({ ...f, rollNo: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600">Class</label>
                  <input
                    required
                    value={form.class}
                    onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600">Section</label>
                  <input
                    required
                    value={form.section}
                    onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={form.dateOfBirth}
                  onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600">Guardian Name</label>
                <input
                  required
                  value={form.guardianName}
                  onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600">Guardian Phone</label>
                <input
                  required
                  value={form.guardianPhone}
                  onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              {!editingId && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600">Joined At</label>
                  <input
                    type="date"
                    value={form.joinedAt}
                    onChange={(e) => setForm((f) => ({ ...f, joinedAt: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-2.5 font-medium text-white"
                >
                  {editingId ? "Update" : "Add"} Student
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
