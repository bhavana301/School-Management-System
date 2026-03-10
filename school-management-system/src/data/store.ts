import type { Student, AttendanceRecord, Subject, Grade, Staff, Exam, Notification } from "@/types";

export const subjects: Subject[] = [
  { id: "sub1", name: "Mathematics", code: "MATH101" },
  { id: "sub2", name: "Science", code: "SCI101" },
  { id: "sub3", name: "English", code: "ENG101" },
  { id: "sub4", name: "Social Studies", code: "SOC101" },
  { id: "sub5", name: "Computer Science", code: "CS101" },
];

export const initialStudents: Student[] = [
  {
    id: "s1",
    name: "Aarav Sharma",
    email: "aarav.sharma@school.com",
    rollNo: "101",
    class: "10",
    section: "A",
    dateOfBirth: "2010-05-15",
    guardianName: "Raj Sharma",
    guardianPhone: "+91 98765 43210",
    joinedAt: "2024-04-01",
  },
  {
    id: "s2",
    name: "Priya Patel",
    email: "priya.patel@school.com",
    rollNo: "102",
    class: "10",
    section: "A",
    dateOfBirth: "2010-08-22",
    guardianName: "Meera Patel",
    guardianPhone: "+91 98765 43211",
    joinedAt: "2024-04-01",
  },
  {
    id: "s3",
    name: "Vikram Singh",
    email: "vikram.singh@school.com",
    rollNo: "103",
    class: "10",
    section: "B",
    dateOfBirth: "2010-03-10",
    guardianName: "Sunita Singh",
    guardianPhone: "+91 98765 43212",
    joinedAt: "2024-04-01",
  },
  {
    id: "s4",
    name: "Ananya Reddy",
    email: "ananya.reddy@school.com",
    rollNo: "104",
    class: "9",
    section: "A",
    dateOfBirth: "2011-01-08",
    guardianName: "Krishna Reddy",
    guardianPhone: "+91 98765 43213",
    joinedAt: "2024-04-01",
  },
  {
    id: "s5",
    name: "Rohan Nair",
    email: "rohan.nair@school.com",
    rollNo: "105",
    class: "9",
    section: "A",
    dateOfBirth: "2011-11-30",
    guardianName: "Lakshmi Nair",
    guardianPhone: "+91 98765 43214",
    joinedAt: "2024-04-01",
  },
];

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export const initialAttendance: AttendanceRecord[] = [
  { id: "a1", studentId: "s1", date: today, status: "present" },
  { id: "a2", studentId: "s2", date: today, status: "present" },
  { id: "a3", studentId: "s3", date: today, status: "late", remarks: "Bus delay" },
  { id: "a4", studentId: "s4", date: today, status: "absent" },
  { id: "a5", studentId: "s5", date: today, status: "present" },
  { id: "a6", studentId: "s1", date: yesterday, status: "present" },
  { id: "a7", studentId: "s2", date: yesterday, status: "present" },
  { id: "a8", studentId: "s3", date: yesterday, status: "present" },
  { id: "a9", studentId: "s4", date: yesterday, status: "leave", remarks: "Medical" },
  { id: "a10", studentId: "s5", date: yesterday, status: "present" },
];

export const initialGrades: Grade[] = [
  { id: "g1", studentId: "s1", subjectId: "sub1", term: "Term 1", marks: 92, maxMarks: 100, grade: "A+", year: 2024 },
  { id: "g2", studentId: "s1", subjectId: "sub2", term: "Term 1", marks: 88, maxMarks: 100, grade: "A", year: 2024 },
  { id: "g3", studentId: "s1", subjectId: "sub3", term: "Term 1", marks: 85, maxMarks: 100, grade: "A", year: 2024 },
  { id: "g4", studentId: "s2", subjectId: "sub1", term: "Term 1", marks: 78, maxMarks: 100, grade: "B+", year: 2024 },
  { id: "g5", studentId: "s2", subjectId: "sub2", term: "Term 1", marks: 95, maxMarks: 100, grade: "A+", year: 2024 },
  { id: "g6", studentId: "s2", subjectId: "sub3", term: "Term 1", marks: 82, maxMarks: 100, grade: "A", year: 2024 },
  { id: "g7", studentId: "s3", subjectId: "sub1", term: "Term 1", marks: 88, maxMarks: 100, grade: "A", year: 2024 },
  { id: "g8", studentId: "s3", subjectId: "sub2", term: "Term 1", marks: 76, maxMarks: 100, grade: "B+", year: 2024 },
  { id: "g9", studentId: "s4", subjectId: "sub1", term: "Term 1", marks: 90, maxMarks: 100, grade: "A+", year: 2024 },
  { id: "g10", studentId: "s5", subjectId: "sub1", term: "Term 1", marks: 72, maxMarks: 100, grade: "B", year: 2024 },
];

export const initialStaff: Staff[] = [
  {
    id: "st1",
    name: "Sarah Teacher",
    email: "teacher@school.com",
    role: "teacher",
    phone: "+91 98765 11111",
    joinDate: "2023-06-01",
    assignedClass: "10",
    assignedSection: "A",
    subjectIds: ["sub1", "sub2"],
    isActive: true,
  },
  {
    id: "st2",
    name: "John Doe",
    email: "john@school.com",
    role: "teacher",
    phone: "+91 98765 22222",
    joinDate: "2023-07-15",
    assignedClass: "9",
    assignedSection: "A",
    subjectIds: ["sub3", "sub4"],
    isActive: true,
  },
];

export const initialExams: Exam[] = [
  {
    id: "ex1",
    name: "Mathematics Term 1",
    subjectId: "sub1",
    class: "10",
    section: "A",
    date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "11:00",
    maxMarks: 100,
    room: "Hall A",
  },
  {
    id: "ex2",
    name: "Science Term 1",
    subjectId: "sub2",
    class: "10",
    section: "A",
    date: new Date(Date.now() + 86400000 * 8).toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "11:00",
    maxMarks: 100,
    room: "Lab 1",
  },
];

export const initialNotifications: Notification[] = [
  {
    id: "n1",
    title: "Term 1 Exams",
    message: "Term 1 examination schedule has been published. Check Exam Schedule.",
    type: "info",
    read: false,
    createdAt: new Date().toISOString(),
    link: "/exams",
  },
  {
    id: "n2",
    title: "Attendance Reminder",
    message: "Please mark today's attendance before 11:00 AM.",
    type: "warning",
    read: false,
    createdAt: new Date().toISOString(),
    link: "/attendance",
  },
];
