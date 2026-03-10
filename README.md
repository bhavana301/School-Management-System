# 🏫 School Management System

A comprehensive, production-ready School Management System built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Designed for real school deployments, it provides role-based dashboards for Admins, Teachers, and Students — covering student enrollment, attendance, grades, exams, notifications, and audit logs.

## 🚀 Features

- 🔐 Role-based auth (Admin / Teacher / Student) with route protection via Next.js middleware
- 👩‍🎓 Student profiles with roll number, class, section, guardian info
- 👨‍🏫 Staff management (teachers, admins, accountants, reception)
- 📋 Attendance tracking — present, absent, late, leave
- 📊 Grades — subject-wise, multi-term, multi-year
- 📅 Exam scheduling with room, time, and subject details
- 🔔 In-app notifications with read/unread status
- 📈 Reports dashboard for admins and teachers
- 🛡️ Full audit log of all user actions (admin only)
- ⚙️ Admin settings panel

## 🛠️ Tech Stack

- **Next.js 15** (App Router)
- **TypeScript 5**
- **Tailwind CSS 3**
- **Motion v11** (animations)
- **Lucide React** (icons)
- **React 19**

## 👥 Roles & Permissions

| Feature | Admin | Teacher | Student |
|---|:---:|:---:|:---:|
| Admin Dashboard | ✅ | ❌ | ❌ |
| User & Staff Management | ✅ | ❌ | ❌ |
| Audit Log | ✅ | ❌ | ❌ |
| Student Management | ✅ | ✅ | ❌ |
| Attendance Management | ✅ | ✅ | ❌ |
| Grades Management | ✅ | ✅ | ❌ |
| Exam Schedule | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |
| My Attendance | ❌ | ❌ | ✅ |
| My Grades | ❌ | ❌ | ✅ |

## ⚙️ Getting Started
```bash
git clone https://github.com/bhavana301/School-Management-System.git
cd School-Management-System/school-management-system
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
src/
├── app/          # All pages (App Router)
├── components/   # UI & layout components
├── config/       # Auth & permissions config
├── context/      # Auth & data providers
├── data/         # Client-side store
├── lib/          # Auth helpers & utils
└── types/        # TypeScript interfaces
```

## 👩‍💻 Author

**Bhavana Peruri** — [@bhavana301](https://github.com/bhavana301)

## 📄 License

MIT
