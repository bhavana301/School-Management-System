"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Student, AttendanceRecord, Grade, AuditLogEntry, Staff, Exam, Notification } from "@/types";
import {
  initialStudents,
  initialAttendance,
  initialGrades,
  initialStaff,
  initialExams,
  initialNotifications,
  subjects,
} from "@/data/store";
import { useAuth } from "@/context/auth-context";

type DataContextType = {
  students: Student[];
  attendance: AttendanceRecord[];
  grades: Grade[];
  staff: Staff[];
  exams: Exam[];
  notifications: Notification[];
  auditLog: AuditLogEntry[];
  subjects: typeof subjects;
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  setAttendance: (date: string, records: { studentId: string; status: AttendanceRecord["status"]; remarks?: string }[]) => void;
  addOrUpdateGrade: (g: Omit<Grade, "id"> | Grade) => void;
  getAttendanceForDate: (date: string) => AttendanceRecord[];
  addStaff: (s: Omit<Staff, "id">) => void;
  updateStaff: (id: string, s: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  addExam: (e: Omit<Exam, "id">) => void;
  updateExam: (id: string, e: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
};

const DataContext = createContext<DataContextType | null>(null);

function createAuditId() {
  return "audit-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [attendance, setAttendanceState] = useState<AttendanceRecord[]>(initialAttendance);
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  const log = useCallback(
    (action: string, resource: string, resourceId?: string, details?: string) => {
      if (!user) return;
      setAuditLog((prev) => [
        {
          id: createAuditId(),
          userId: user.id,
          userEmail: user.email,
          action,
          resource,
          resourceId,
          details,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 499),
      ]);
    },
    [user]
  );

  const addStudent = useCallback(
    (s: Omit<Student, "id">) => {
      const id = "s" + (Date.now().toString(36) + Math.random().toString(36).slice(2)).slice(-4);
      setStudents((prev) => [...prev, { ...s, id }]);
      log("CREATE", "student", id, s.name);
    },
    [log]
  );

  const updateStudent = useCallback(
    (id: string, s: Partial<Student>) => {
      setStudents((prev) => prev.map((x) => (x.id === id ? { ...x, ...s } : x)));
      log("UPDATE", "student", id);
    },
    [log]
  );

  const deleteStudent = useCallback(
    (id: string) => {
      setStudents((prev) => prev.filter((x) => x.id !== id));
      setAttendanceState((prev) => prev.filter((x) => x.studentId !== id));
      setGrades((prev) => prev.filter((x) => x.studentId !== id));
      log("DELETE", "student", id);
    },
    [log]
  );

  const getAttendanceForDate = useCallback(
    (date: string) => attendance.filter((a) => a.date === date),
    [attendance]
  );

  const setAttendance = useCallback(
    (date: string, records: { studentId: string; status: AttendanceRecord["status"]; remarks?: string }[]) => {
      setAttendanceState((prev) => {
        const withoutDate = prev.filter((a) => a.date !== date);
        const newRecords: AttendanceRecord[] = records.map((r) => ({
          id: `a-${date}-${r.studentId}`,
          studentId: r.studentId,
          date,
          status: r.status,
          remarks: r.remarks,
        }));
        return [...withoutDate, ...newRecords];
      });
      log("UPDATE", "attendance", undefined, `Date: ${date}`);
    },
    [log]
  );

  const addOrUpdateGrade = useCallback(
    (g: Omit<Grade, "id"> | Grade) => {
      if ("id" in g && g.id) {
        setGrades((prev) => prev.map((x) => (x.id === g.id ? (g as Grade) : x)));
        log("UPDATE", "grade", g.id);
      } else {
        const id = "g" + Date.now();
        setGrades((prev) => [...prev, { ...g, id } as Grade]);
        log("CREATE", "grade", id);
      }
    },
    [log]
  );

  const addStaff = useCallback(
    (s: Omit<Staff, "id">) => {
      const id = "st" + Date.now();
      setStaff((prev) => [...prev, { ...s, id }]);
      log("CREATE", "staff", id, s.name);
    },
    [log]
  );

  const updateStaff = useCallback(
    (id: string, s: Partial<Staff>) => {
      setStaff((prev) => prev.map((x) => (x.id === id ? { ...x, ...s } : x)));
      log("UPDATE", "staff", id);
    },
    [log]
  );

  const deleteStaff = useCallback(
    (id: string) => {
      setStaff((prev) => prev.filter((x) => x.id !== id));
      log("DELETE", "staff", id);
    },
    [log]
  );

  const addExam = useCallback(
    (e: Omit<Exam, "id">) => {
      const id = "ex" + Date.now();
      setExams((prev) => [...prev, { ...e, id }]);
      log("CREATE", "exam", id, e.name);
    },
    [log]
  );

  const updateExam = useCallback(
    (id: string, e: Partial<Exam>) => {
      setExams((prev) => prev.map((x) => (x.id === id ? { ...x, ...e } : x)));
      log("UPDATE", "exam", id);
    },
    [log]
  );

  const deleteExam = useCallback(
    (id: string) => {
      setExams((prev) => prev.filter((x) => x.id !== id));
      log("DELETE", "exam", id);
    },
    [log]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "createdAt">) => {
    const id = "n" + Date.now();
    setNotifications((prev) => [
      { ...n, id, read: false, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  return (
    <DataContext.Provider
      value={{
        students,
        attendance,
        grades,
        staff,
        exams,
        notifications,
        auditLog,
        subjects,
        addStudent,
        updateStudent,
        deleteStudent,
        setAttendance,
        addOrUpdateGrade,
        getAttendanceForDate,
        addStaff,
        updateStaff,
        deleteStaff,
        addExam,
        updateExam,
        deleteExam,
        markNotificationRead,
        addNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
