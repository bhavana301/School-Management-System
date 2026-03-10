export interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  class: string;
  section: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  joinedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "leave";
  remarks?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  term: string;
  marks: number;
  maxMarks: number;
  grade: string;
  year: number;
}

export type AttendanceStatus = AttendanceRecord["status"];

export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** When role is student, id matches Student.id for filtering own data */
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  timestamp: string;
  ip?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "admin" | "accountant" | "reception";
  phone: string;
  joinDate: string;
  assignedClass?: string;
  assignedSection?: string;
  subjectIds?: string[];
  isActive: boolean;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  class: string;
  section: string;
  date: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  room?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
  createdAt: string;
  link?: string;
}
