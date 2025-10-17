import { updateSession } from "@/lib/supabase/middleware"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // First, update the session as before
  const response = await updateSession(request)
  
  // Check if this is an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  
  if (isAdminRoute) {
    // Create a new supabase client to check user role
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // We don't need to set cookies here since updateSession already handled it
          },
        },
      }
    )

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        // User is not authenticated, redirect to login
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Get user profile to check role
      // console.log("user", user)
      // console.log("userError", userError)
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
      // console.log("profile", profile)
      // console.log("profileError", profileError)
      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        // If we can't fetch the profile, redirect to an error page or login
        const errorUrl = new URL("/auth/error", request.url)
        errorUrl.searchParams.set("error", "Profile not found")
        return NextResponse.redirect(errorUrl)
      }

      // Check if user has admin role
      if (profile?.role !== "admin") {
        // User is not an admin, redirect to unauthorized page or home
        const unauthorizedUrl = new URL("/unauthorized", request.url)
        return NextResponse.redirect(unauthorizedUrl)
      }

      // User is authenticated and has admin role, allow access
      return response

    } catch (error) {
      console.error("Error in middleware:", error)
      // On any error, redirect to login
      const loginUrl = new URL("/auth/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // For non-admin routes, return the original response
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}