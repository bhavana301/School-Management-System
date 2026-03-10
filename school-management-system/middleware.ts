import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/config/auth";

const PUBLIC_PATHS = ["/login"];
const ADMIN_PREFIX = "/admin";

function getSession(request: NextRequest): { user: { role: string } } | null {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookie) return null;
  try {
    const decoded = decodeURIComponent(cookie);
    const parsed = JSON.parse(decoded);
    if (parsed.expires && Date.now() > parsed.expires) return null;
    return parsed.user ? { user: parsed.user } : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSession(request);

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (session) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const studentPaths = ["/", "/my-grades", "/my-attendance"];
  const isStudentPath = studentPaths.includes(pathname) || pathname.startsWith("/my-");
  if (session.user.role === "student" && !isStudentPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api).*)"],
};
