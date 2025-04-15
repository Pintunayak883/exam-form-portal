import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Public Routes (Ye bina login ke bhi access ho sakte hain)
  const publicRoutes = ["/login", "/register", "/about"];

  // Protected Routes (Sirf login ke baad access)
  const protectedRoutes = ["/dashboard", "/profile", "/apply"];

  const token = req.cookies.get("token")?.value;

  // Public route par token check mat karo
  if (publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected route par token mandatory hai
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"], // Har page pe chalega, except API and static files
};
