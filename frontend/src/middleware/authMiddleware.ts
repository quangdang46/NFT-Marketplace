import { MiddlewareFactory } from "@/types/MiddlewareFactory";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export const authMiddleware: MiddlewareFactory = (next) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const PROTECTED_ROUTES = ["/create"];

    const { pathname } = req.nextUrl;

    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    if (isProtectedRoute) {
      const token = req.cookies.get("auth_token")?.value;

      if (!token) {
        return NextResponse.redirect(new URL("/404", req.url));
      }
    }

    return next(req, _next);
  };
};
