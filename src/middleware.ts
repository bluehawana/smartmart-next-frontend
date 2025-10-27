import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

// Force Node.js runtime to support dynamic code evaluation (required for Mailjet and better-auth)
export const runtime = 'nodejs'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth/signin",
    "/api/auth",
    "/products",
    "/about",
    "/contact",
    "/search",
  ]

  // Protected paths that require authentication
  const protectedPaths = [
    "/cart",
    "/checkout",
    "/admin",
    "/profile",
    "/account",
  ]

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If it's not a protected path, allow access (for any other pages)
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // For protected paths, check for session
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    // If no session, redirect to sign-in
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/signin"
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    // User is authenticated, allow access
    return NextResponse.next()
  } catch (error) {
    // If there's an error checking the session, redirect to sign-in
    const url = request.nextUrl.clone()
    url.pathname = "/auth/signin"
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (except /api/auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
