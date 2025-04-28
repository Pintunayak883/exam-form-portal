import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const publicRoutes = ["/login", "/register", "/about"];
  const protectedRoutes = ["/dashboard", "/profile", "/apply"];

  const token = req.cookies.get("token")?.value;
  console.log("token form middleware", token);
  const getRoleFromToken = (token: string | undefined) => {
    if (!token) return null;
    try {
      const decode: any = jwt.decode(token);
      return decode?.role || null;
    } catch (error) {
      return null;
    }
  };

  const role = getRoleFromToken(token);
  const path = req.nextUrl.pathname;

  // Public Routes handle
  if (publicRoutes.some((route) => path.startsWith(route))) {
    if (token && role) {
      if (role == "candidate") {
        return NextResponse.redirect(new URL("/apply", req.url));
      }

      if (role == "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  // Admin Routes handle
  if (path.startsWith("/admin")) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Other Protected Routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
