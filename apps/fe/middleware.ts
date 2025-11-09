import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

const PROTECTED_ROUTES = {
  "/dashboard": ["DONOR", "ORG_ADMIN", "SUPERADMIN"],
  "/admin": ["ORG_ADMIN", "AUDITOR", "SUPERADMIN"],
  "/auditor": ["AUDITOR", "SUPERADMIN"],
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get("session")?.value

  const isProtected = Object.keys(PROTECTED_ROUTES).some((route) => pathname.startsWith(route))

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("returnTo", pathname + search)
      return NextResponse.redirect(loginUrl)
    }

    const session = await verifySession(token)
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("returnTo", pathname + search)
      return NextResponse.redirect(loginUrl)
    }

    const route = Object.keys(PROTECTED_ROUTES).find((r) => pathname.startsWith(r))
    if (route && !PROTECTED_ROUTES[route as keyof typeof PROTECTED_ROUTES].includes(session.role)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auditor/:path*"],
}
