import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from "@/config/auth";
import type { User } from "@/types";

export function getSessionCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + AUTH_COOKIE_NAME + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

export function setSessionCookie(user: User): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify({ user, expires: Date.now() + AUTH_COOKIE_MAX_AGE * 1000 }));
  document.cookie = `${AUTH_COOKIE_NAME}=${value}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export function parseSessionFromCookie(cookieHeader: string | null): { user: User } | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp("(^| )" + AUTH_COOKIE_NAME + "=([^;]+)"));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[2]));
    if (parsed.expires && Date.now() > parsed.expires) return null;
    return { user: parsed.user };
  } catch {
    return null;
  }
}
