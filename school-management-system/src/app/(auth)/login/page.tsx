"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) router.push(from);
    else setError(result.error ?? "Login failed");
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">EduManage</h1>
          <p className="text-sm text-zinc-500">Enterprise School Management</p>
        </div>
      </div>
      <h2 className="mb-6 text-lg font-semibold text-zinc-900">Sign in</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            placeholder="admin@school.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-zinc-500">
        Demo: Admin admin@school.com / admin123 — Teacher teacher@school.com / teacher123 — Student student@school.com / student123
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
