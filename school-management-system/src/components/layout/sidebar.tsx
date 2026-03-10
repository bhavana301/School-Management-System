"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Award,
  GraduationCap,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  Shield,
  UserCog,
  ScrollText,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { siteConfig } from "@/config/site";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/grades", label: "Marks & Grades", icon: Award },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/exams", label: "Exam Schedule", icon: Calendar },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const studentNavItems = [
  { href: "/", label: "My Dashboard", icon: LayoutDashboard },
  { href: "/my-grades", label: "My Grades", icon: Award },
  { href: "/my-attendance", label: "My Attendance", icon: CalendarDays },
];

const adminNavItems = [
  { href: "/admin", label: "Admin Home", icon: Shield },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();
  const canAccessAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-zinc-200 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            {siteConfig.name}
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {isStudent ? (
          studentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-cyan-500/15 text-cyan-600 shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })
        ) : (
          <>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const allowed =
                item.href === "/" ||
                (item.label === "Reports" && hasPermission("reports:view")) ||
                (item.label === "Exam Schedule" && hasPermission("exams:view")) ||
                (item.label === "Notifications" && hasPermission("notifications:view")) ||
                ["Students", "Attendance", "Marks & Grades"].includes(item.label);
              if (!allowed) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-cyan-500/15 text-cyan-600 shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            {canAccessAdmin && (
              <>
                <div className="my-2 border-t border-zinc-200 pt-2">
                  <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Admin
                  </p>
                </div>
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-violet-500/15 text-violet-600"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}
          </>
        )}
      </nav>
      <div className="border-t border-zinc-200 p-4">
        {user && (
          <div className="mb-3 rounded-xl bg-zinc-100 px-4 py-2">
            <p className="truncate text-sm font-medium text-zinc-900">{user.name}</p>
            <p className="truncate text-xs text-zinc-500">{user.email}</p>
            <p className="mt-0.5 text-xs capitalize text-cyan-600">{user.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
        <p className="mt-2 text-xs text-zinc-500">{siteConfig.name} v{siteConfig.version}</p>
      </div>
    </aside>
  );
}
