# EduManage – Enterprise School Management System

Enterprise-grade **School Management System** with **role-based access (Admin & Teacher)**, audit logging, reports, exam scheduling, and Aceternity-style UI.

## Features

### Authentication & roles
- **Login** – Session-based auth (cookie). Demo users below.
- **Admin** – Full access: users, staff, audit log, settings, and all academic modules.
- **Teacher** – Academic access: dashboard, students, attendance, grades, reports, exams, notifications. No user/staff management or settings.
- **Middleware** – Protects routes; `/admin/*` is admin-only; unauthenticated users redirect to `/login`.

### Academic
- **Dashboard** – Stats, recent students, today’s attendance.
- **Students** – CRUD, search; permissions: create, edit, delete (Teachers can’t delete).
- **Attendance** – Mark by date (Present / Absent / Late / Leave), remarks.
- **Marks & Grades** – Add grades by student, subject, term; auto grade (A+–F); filters.
- **Reports** – Attendance by status, average score by subject, students by class; **CSV export** (Students, Grades) for users with `reports:export`.
- **Exam schedule** – CRUD exams (name, subject, class, section, date, time, room).
- **Notifications** – List, mark as read, link to relevant pages.

### Admin panel (`/admin`)
- **Admin home** – Quick links and recent audit activity.
- **Users & access** – Demo user list; in production plug your auth provider.
- **Staff** – CRUD teachers/staff (role, class/section, subject, active).
- **Audit log** – All CREATE/UPDATE/DELETE with user, resource, timestamp; search and filter.
- **Settings** – App name, version, support email; extend for DB/security config.

### Enterprise behavior
- **Audit trail** – Every mutation (students, attendance, grades, staff, exams) logged with user and time.
- **Permissions** – `src/config/permissions.ts`: page- and operation-level (e.g. `students:delete`, `reports:export`).
- **Assets** – `public/images/` for logos/OG images; `src/app/icon.tsx` for dynamic favicon.
- **Config** – `src/config/site.ts`, `src/config/auth.ts` for app and demo users.

## Tech stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**
- **Aceternity-style UI** – Dot grid, glow cards, gradient accents
- **In-memory state** – Ready to replace with DB + API or NextAuth

## Getting started

```bash
cd school-management-system
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You’ll be redirected to **/login** if not signed in.

### Demo logins

| Role    | Email             | Password   |
|---------|-------------------|------------|
| Admin   | admin@school.com  | admin123   |
| Teacher | teacher@school.com | teacher123 |

- **Admin** – See “Admin” in sidebar; open Users, Staff, Audit log, Settings.
- **Teacher** – No Admin section; can manage students (no delete), attendance, grades, reports, exams, notifications.

## Project structure

```
src/
├── app/
│   ├── (auth)/login/     # Login page (no sidebar)
│   ├── admin/            # Admin-only: users, staff, audit, settings
│   ├── reports/          # Analytics + CSV export
│   ├── exams/             # Exam schedule CRUD
│   ├── notifications/    # Notifications list
│   ├── students/         # Students CRUD (permission-aware)
│   ├── attendance/       # Daily attendance
│   ├── grades/           # Marks & grades
│   ├── icon.tsx          # Favicon (edge)
│   ├── layout.tsx        # AuthProvider + AppShell
│   └── page.tsx         # Dashboard
├── components/
│   ├── layout/           # Sidebar, AppShell
│   └── ui/               # DotGrid, GlowCard, MovingBorder
├── config/
│   ├── auth.ts           # Roles, demo users, cookie name
│   ├── permissions.ts    # RBAC (admin vs teacher)
│   └── site.ts           # App name, version
├── context/
│   ├── auth-context.tsx  # Login, logout, user, hasPermission
│   └── data-context.tsx  # All data + audit logging
├── data/
│   └── store.ts          # Initial students, attendance, grades, staff, exams, notifications
├── lib/
│   ├── auth.ts           # Cookie helpers (client + middleware)
│   └── utils.ts          # cn()
├── types/
│   └── index.ts          # Student, Grade, User, AuditLog, Staff, Exam, Notification
middleware.ts             # Route protection; admin-only /admin
public/
├── images/               # Add logo, og-image.png here
```

## Production checklist

1. **Auth** – Replace demo login with **NextAuth**, **Clerk**, or your IdP; store users in DB.
2. **Database** – Replace in-memory state with **Prisma** / **Drizzle** and API routes or Server Actions.
3. **Audit log** – Persist `auditLog` to DB and optionally restrict by role.
4. **Permissions** – Keep `permissions.ts`; load user role from DB/session.
5. **Assets** – Add `public/images/logo.png`, `og-image.png` and reference in metadata.

## License

MIT.
