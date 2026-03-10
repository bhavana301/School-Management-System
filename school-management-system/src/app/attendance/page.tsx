"use client";

import { useState, useMemo, useEffect } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import type { AttendanceStatus } from "@/types";
import { Calendar, Check, X, Clock, FileQuestion } from "lucide-react";

const statusOptions: { value: AttendanceStatus; label: string; icon: typeof Check }[] = [
  { value: "present", label: "Present", icon: Check },
  { value: "absent", label: "Absent", icon: X },
  { value: "late", label: "Late", icon: Clock },
  { value: "leave", label: "Leave", icon: FileQuestion },
];

export default function AttendancePage() {
  const { students, attendance, getAttendanceForDate, setAttendance } = useData();
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const existingRecords = useMemo(
    () => getAttendanceForDate(selectedDate),
    [getAttendanceForDate, selectedDate]
  );

  const [records, setRecords] = useState<Record<string, AttendanceStatus>>(() => ({}));
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const effectiveRecords = useMemo(() => {
    const r: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      const ex = existingRecords.find((a) => a.studentId === s.id);
      r[s.id] = records[s.id] ?? ex?.status ?? "present";
    });
    return r;
  }, [students, existingRecords, records]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setRemarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = () => {
    setAttendance(
      selectedDate,
      students.map((s) => ({
        studentId: s.id,
        status: effectiveRecords[s.id] ?? "present",
        remarks: remarks[s.id] || undefined,
      }))
    );
  };

  useEffect(() => {
    const map: Record<string, AttendanceStatus> = {};
    const rem: Record<string, string> = {};
    existingRecords.forEach((a) => {
      map[a.studentId] = a.status;
      if (a.remarks) rem[a.studentId] = a.remarks;
    });
    students.forEach((s) => {
      if (!(s.id in map)) map[s.id] = "present";
    });
    setRecords(map);
    setRemarks(rem);
  // Re-run when date or attendance data changes; existingRecords omitted to avoid infinite loop (new ref each render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, students, attendance]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-5xl px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Attendance
          </h1>
          <p className="mt-2 text-zinc-600">Mark and view daily attendance</p>
        </div>

        <GlowCard className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              <label className="text-sm font-medium text-zinc-600">Date</label>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setRecords({});
                setRemarks({});
              }}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
            <button
              onClick={handleSave}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 font-medium text-zinc-900 hover:opacity-90"
            >
              Save Attendance
            </button>
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">Students</h2>
          <div className="space-y-3">
            {students.map((s) => {
              const status = effectiveRecords[s.id] ?? "present";
              return (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-900">{s.name}</p>
                    <p className="text-sm text-zinc-500">
                      Roll {s.rollNo} • Class {s.class}-{s.section}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleStatusChange(s.id, opt.value)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                              : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    placeholder="Remarks (optional)"
                    value={remarks[s.id] ?? ""}
                    onChange={(e) => handleRemarksChange(s.id, e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 sm:w-48"
                  />
                </div>
              );
            })}
          </div>
          {students.length === 0 && (
            <p className="py-8 text-center text-zinc-500">No students. Add students first.</p>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
