import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;



  // ─── Dashboard Route Protection ──────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ─── All other routes are public ─────────────────────────────────────────
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all paths except static files and API routes that don't need protection
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
