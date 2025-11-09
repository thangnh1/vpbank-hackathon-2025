import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // Xoá session
  res.cookies.set("session", "", { path: "/", httpOnly: true, maxAge: 0 })
  return res
}
