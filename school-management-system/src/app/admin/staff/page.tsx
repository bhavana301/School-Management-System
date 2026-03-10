"use client";

import { useState } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import type { Staff } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminStaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState<Partial<Staff>>({
    name: "",
    email: "",
    role: "teacher",
    phone: "",
    joinDate: new Date().toISOString().slice(0, 10),
    isActive: true,
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      email: "",
      role: "teacher",
      phone: "",
      joinDate: new Date().toISOString().slice(0, 10),
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({ ...s });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateStaff(editing.id, form);
    } else {
      addStaff(form as Omit<Staff, "id">);
    }
    setModalOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-5xl px-8 py-12">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-white to-violet-200 bg-clip-text text-3xl font-bold text-transparent">
              Staff
            </h1>
            <p className="text-zinc-600">Manage teachers and staff</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 font-medium text-zinc-900 hover:opacity-90"
          >
            <Plus className="h-5 w-5" /> Add Staff
          </button>
        </div>

        <GlowCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-900">{s.name}</td>
                    <td className="px-6 py-4 text-zinc-600">{s.email}</td>
                    <td className="px-6 py-4 capitalize text-zinc-600">{s.role}</td>
                    <td className="px-6 py-4 text-zinc-600">
                      {s.assignedClass && s.assignedSection ? `${s.assignedClass}-${s.assignedSection}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(s)} className="rounded p-2 text-zinc-600 hover:text-cyan-400">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteStaff(s.id)} className="rounded p-2 text-zinc-600 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <GlowCard className="relative mx-4 w-full max-w-md">
            <h2 className="text-xl font-semibold text-zinc-900">{editing ? "Edit Staff" : "Add Staff"}</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                required
                placeholder="Name"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={form.email ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900"
              />
              <select
                value={form.role ?? "teacher"}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Staff["role"] }))}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900"
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="accountant">Accountant</option>
                <option value="reception">Reception</option>
              </select>
              <input
                placeholder="Phone"
                value={form.phone ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900"
              />
              <input
                type="date"
                placeholder="Join date"
                value={form.joinDate ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, joinDate: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900"
              />
              <input placeholder="Class" value={form.assignedClass ?? ""} onChange={(e) => setForm((f) => ({ ...f, assignedClass: e.target.value }))} className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900" />
              <input placeholder="Section" value={form.assignedSection ?? ""} onChange={(e) => setForm((f) => ({ ...f, assignedSection: e.target.value }))} className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                <span className="text-sm text-zinc-600">Active</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 rounded-xl bg-violet-600 py-2.5 font-medium text-zinc-900">
                  {editing ? "Update" : "Add"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-zinc-300 px-5 py-2.5 text-zinc-300">
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
