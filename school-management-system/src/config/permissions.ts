import type { Role } from "./auth";

export type Permission =
  | "dashboard:view"
  | "students:view"
  | "students:create"
  | "students:edit"
  | "students:delete"
  | "attendance:view"
  | "attendance:edit"
  | "grades:view"
  | "grades:edit"
  | "reports:view"
  | "reports:export"
  | "admin:view"
  | "admin:users"
  | "admin:settings"
  | "admin:audit"
  | "admin:staff"
  | "exams:view"
  | "exams:edit"
  | "notifications:view";

const ADMIN_PERMISSIONS: Permission[] = [
  "dashboard:view",
  "students:view",
  "students:create",
  "students:edit",
  "students:delete",
  "attendance:view",
  "attendance:edit",
  "grades:view",
  "grades:edit",
  "reports:view",
  "reports:export",
  "admin:view",
  "admin:users",
  "admin:settings",
  "admin:audit",
  "admin:staff",
  "exams:view",
  "exams:edit",
  "notifications:view",
];

const TEACHER_PERMISSIONS: Permission[] = [
  "dashboard:view",
  "students:view",
  "students:create",
  "students:edit",
  "attendance:view",
  "attendance:edit",
  "grades:view",
  "grades:edit",
  "reports:view",
  "reports:export",
  "exams:view",
  "exams:edit",
  "notifications:view",
];

const STUDENT_PERMISSIONS: Permission[] = [
  "dashboard:view",
];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ADMIN_PERMISSIONS,
  teacher: TEACHER_PERMISSIONS,
  student: STUDENT_PERMISSIONS,
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessAdmin(role: Role): boolean {
  return hasPermission(role, "admin:view");
}
