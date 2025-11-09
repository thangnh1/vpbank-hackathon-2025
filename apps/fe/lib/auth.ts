import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { nanoid } from "nanoid"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key-change-in-production")

export interface SessionPayload {
  userId: string
  email: string
  role: "DONOR" | "ORG_ADMIN" | "AUDITOR" | "SUPERADMIN"
  isAnonymous?: boolean
  anonId?: string
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(SECRET)
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, SECRET)
    return verified.payload as SessionPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  return verifySession(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function createAnonSession(): Promise<string> {
  const anonId = nanoid()
  const payload: SessionPayload = {
    userId: `anon-${anonId}`,
    email: `anon-${anonId}@anonymous.local`,
    role: "DONOR",
    isAnonymous: true,
    anonId,
  }
  return createSession(payload)
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
