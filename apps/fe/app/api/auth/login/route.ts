import { type NextRequest, NextResponse } from "next/server"
import { createSession, setSessionCookie } from "@/lib/auth"

// Demo users seed data
const DEMO_USERS = [
  { email: "donor@demo.dev", password: "demo123", role: "DONOR", name: "Demo Donor" },
  { email: "org@demo.dev", password: "demo123", role: "ORG_ADMIN", name: "Org Admin" },
  { email: "auditor@demo.dev", password: "demo123", role: "AUDITOR", name: "Demo Auditor" },
  { email: "admin@demo.dev", password: "demo123", role: "SUPERADMIN", name: "Super Admin" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password, provider } = await request.json()

    // SSO mock for VPBank
    if (provider === "vpbank") {
      const session = await createSession({
        userId: `vpb-${Date.now()}`,
        email: email || "user@vpbank.mock",
        role: "DONOR",
      })
      await setSessionCookie(session)
      return NextResponse.json({ success: true, redirectTo: "/dashboard" })
    }

    // Demo credentials login
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const session = await createSession({
      userId: user.email,
      email: user.email,
      role: user.role as any,
    })

    await setSessionCookie(session)

    const landingPage =
      {
        DONOR: "/dashboard",
        ORG_ADMIN: "/admin",
        AUDITOR: "/auditor",
        SUPERADMIN: "/admin",
      }[user.role] || "/dashboard"

    return NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role },
      redirectTo: landingPage,
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
