"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { DataProvider } from "@/context/data-context";

const LOGIN_PATH = "/login";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === LOGIN_PATH;

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <DataProvider>{children}</DataProvider>
      </main>
    </>
  );
}
