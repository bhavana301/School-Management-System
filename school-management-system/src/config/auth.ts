export type Role = "admin" | "teacher" | "student";

export const ROLES: Record<Role, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
};

/** Demo users – replace with real auth (NextAuth, Clerk, etc.) in production */
export const DEMO_USERS = [
  {
    id: "admin-1",
    email: "admin@school.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as Role,
  },
  {
    id: "teacher-1",
    email: "teacher@school.com",
    password: "teacher123",
    name: "Sarah Teacher",
    role: "teacher" as Role,
  },
  {
    id: "s1",
    email: "student@school.com",
    password: "student123",
    name: "Aarav Sharma",
    role: "student" as Role,
  },
];

export const AUTH_COOKIE_NAME = "edumanage_session";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
