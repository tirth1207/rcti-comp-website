import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Step 1: update Supabase session normally
  const response = await updateSession(request);

  // Helper: attach security headers consistently on every outgoing response
  const applySecurityHeaders = (res: NextResponse) => {
    res.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "connect-src 'self' https://yvlyoennczddkmfgyhia.supabase.co",
        "object-src 'none'",
        "frame-ancestors 'none'",
      ].join("; ")
    );

    res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

    return res;
  };

  // Restrict admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            /* updateSession manages cookies already */
          },
        },
      }
    );

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
        return applySecurityHeaders(NextResponse.redirect(loginUrl));
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        const errorUrl = new URL("/auth/error", request.url);
        errorUrl.searchParams.set("error", "Profile not found");
        return applySecurityHeaders(NextResponse.redirect(errorUrl));
      }

      if (profile?.role !== "admin") {
        const unauthorizedUrl = new URL("/unauthorized", request.url);
        return applySecurityHeaders(NextResponse.redirect(unauthorizedUrl));
      }

      // Admin authenticated → allow access with secured headers
      return applySecurityHeaders(response);
    } catch (error) {
      console.error("Middleware error:", error);
      const loginUrl = new URL("/auth/login", request.url);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // Normal routes → return updated session + security headers
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
