import { MiddlewareFactory } from "@/types/MiddlewareFactory";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export const authMiddleware: MiddlewareFactory = (next) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const path = req.nextUrl.pathname;

    // Bảo vệ route admin
    if (path.startsWith("/admin")) {
      const token = req.cookies.get("authToken")?.value;
      if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return next(req, _next);
  };
};
