import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const jar = await cookies()
  const raw = jar.get("session")?.value
  const anonId = jar.get("anonId")?.value

  if (raw) {
    try {
      const user = JSON.parse(raw)
      return NextResponse.json({ user, anonymous: false })
    } catch {
      // fallthrough
    }
  }

  // Fallback khách ẩn danh (cho luồng donate guest)
  if (anonId) {
    return NextResponse.json({
      user: {
        userId: anonId,
        displayName: "Khách ẩn danh",
        role: "GUEST",
        email: "",
        avatarUrl: "",
      },
      anonymous: true,
    })
  }

  return NextResponse.json({ user: null, anonymous: true })
}
