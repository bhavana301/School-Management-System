"use client";

import { DotGrid } from "@/components/ui/dot-grid";
import { GlowCard } from "@/components/ui/glow-card";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { Users, ClipboardCheck, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { students, attendance, grades, subjects } = useData();
  const today = new Date().toISOString().slice(0, 10);
  const isStudent = user?.role === "student";
  const studentId = isStudent ? user?.id : null;

  const myGrades = studentId ? grades.filter((g) => g.studentId === studentId) : [];
  const myAttendance = studentId ? attendance.filter((a) => a.studentId === studentId) : [];
  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentToday = todayAttendance.filter((a) => a.status === "present" || a.status === "late").length;

  const avgGrade =
    grades.length > 0
      ? (grades.reduce((s, g) => s + (g.marks / g.maxMarks) * 100, 0) / grades.length).toFixed(1)
      : "—";
  const myAvgGrade =
    myGrades.length > 0
      ? (myGrades.reduce((s, g) => s + (g.marks / g.maxMarks) * 100, 0) / myGrades.length).toFixed(1)
      : "—";

  if (isStudent) {
    const myPresent = myAttendance.filter((a) => a.status === "present" || a.status === "late").length;
    return (
      <div className="relative min-h-screen overflow-hidden">
        <DotGrid />
        <div className="relative mx-auto max-w-4xl px-8 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              My Dashboard
            </h1>
            <p className="mt-2 text-zinc-600">Welcome back, {user?.name}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/my-grades">
              <GlowCard className="h-full transition-transform hover:scale-[1.02]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">My average</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-900">{myAvgGrade}%</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </GlowCard>
            </Link>
            <Link href="/my-attendance">
              <GlowCard className="h-full transition-transform hover:scale-[1.02]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Attendance records</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-900">{myAttendance.length}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <ClipboardCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
              </GlowCard>
            </Link>
            <GlowCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Grade entries</p>
                  <p className="mt-2 text-3xl font-bold text-zinc-900">{myGrades.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </GlowCard>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <GlowCard>
              <h2 className="text-lg font-semibold text-zinc-900">My recent grades</h2>
              <p className="mt-1 text-sm text-zinc-500">Latest entries</p>
              <ul className="mt-4 space-y-3">
                {myGrades.slice(0, 5).map((g) => {
                  const sub = subjects.find((s) => s.id === g.subjectId);
                  return (
                    <li
                      key={g.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                      <span className="font-medium text-zinc-900">{sub?.name ?? g.subjectId} · {g.term}</span>
                      <span className="font-semibold text-cyan-600">{g.marks}/{g.maxMarks} ({g.grade})</span>
                    </li>
                  );
                })}
                {myGrades.length === 0 && <p className="py-4 text-zinc-500">No grades yet.</p>}
              </ul>
              <Link href="/my-grades" className="mt-4 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-700">
                View all my grades →
              </Link>
            </GlowCard>
            <GlowCard>
              <h2 className="text-lg font-semibold text-zinc-900">My recent attendance</h2>
              <p className="mt-1 text-sm text-zinc-500">Last 5 records</p>
              <ul className="mt-4 space-y-3">
                {myAttendance.slice(0, 5).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                  >
                    <span className="text-zinc-700">{a.date}</span>
                    <span className={`rounded px-2 py-0.5 text-sm font-medium ${
                      a.status === "present" ? "bg-emerald-100 text-emerald-700" :
                      a.status === "late" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>{a.status}</span>
                  </li>
                ))}
                {myAttendance.length === 0 && <p className="py-4 text-zinc-500">No attendance records yet.</p>}
              </ul>
              <Link href="/my-attendance" className="mt-4 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-700">
                View all my attendance →
              </Link>
            </GlowCard>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, href: "/students", color: "from-cyan-500 to-cyan-600" },
    { label: "Present Today", value: `${presentToday} / ${students.length}`, icon: ClipboardCheck, href: "/attendance", color: "from-emerald-500 to-emerald-600" },
    { label: "Avg Score", value: `${avgGrade}%`, icon: TrendingUp, href: "/grades", color: "from-violet-500 to-violet-600" },
    { label: "Grade Records", value: grades.length, icon: Award, href: "/grades", color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DotGrid />
      <div className="relative mx-auto max-w-7xl px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="mt-2 text-zinc-600">Overview of your school management</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <GlowCard className="h-full transition-transform hover:scale-[1.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </GlowCard>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <GlowCard>
            <h2 className="text-lg font-semibold text-zinc-900">Recent Students</h2>
            <p className="mt-1 text-sm text-zinc-500">Latest registered students</p>
            <ul className="mt-4 space-y-3">
              {students.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-zinc-900">{s.name}</p>
                    <p className="text-sm text-zinc-500">Class {s.class}-{s.section} • Roll {s.rollNo}</p>
                  </div>
                  <Link href={`/students?id=${s.id}`} className="text-sm font-medium text-cyan-600 hover:text-cyan-700">View</Link>
                </li>
              ))}
            </ul>
            <Link href="/students" className="mt-4 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-700">View all students →</Link>
          </GlowCard>

          <GlowCard>
            <h2 className="text-lg font-semibold text-zinc-900">Today&apos;s Attendance</h2>
            <p className="mt-1 text-sm text-zinc-600">{today}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {todayAttendance.length === 0 ? (
                <p className="text-zinc-500">No attendance marked for today.</p>
              ) : (
                todayAttendance.map((a) => {
                  const student = students.find((s) => s.id === a.studentId);
                  const color =
                    a.status === "present" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                    a.status === "late" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    "bg-red-100 text-red-700 border-red-200";
                  return (
                    <span key={a.id} className={`rounded-lg border px-3 py-1.5 text-sm ${color}`}>
                      {student?.name ?? a.studentId} – {a.status}
                    </span>
                  );
                })
              )}
            </div>
            <Link href="/attendance" className="mt-4 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-700">Manage attendance →</Link>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
