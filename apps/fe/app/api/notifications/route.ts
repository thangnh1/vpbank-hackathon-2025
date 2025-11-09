import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { getAuthUser, listNotifications } from "@/lib/mock-db"

const DB_PATH = path.join(process.cwd(), "data", "db.json")

// GET /api/notifications?unreadOnly=true
export async function GET(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })

  const unreadOnly = request.nextUrl.searchParams.get("unreadOnly") === "true"
  const items = await listNotifications(user.userId)
  const data = unreadOnly ? items.filter((n) => !n.read) : items

  return NextResponse.json({ notifications: data, total: data.length })
}

// PATCH /api/notifications
// body: { ids?: string[] }  -> nếu không truyền ids sẽ mark-read tất cả của user
export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })

  const { ids } = await request.json().catch(() => ({ ids: undefined }))

  const raw = await fs.readFile(DB_PATH, "utf8")
  const db = JSON.parse(raw)

  db.notifications = db.notifications.map((n: any) => {
    const isTarget = n.userId === user.userId && (!ids || (Array.isArray(ids) && ids.includes(n.id)))
    return isTarget ? { ...n, read: true } : n
  })

  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8")

  const mine = db.notifications.filter((n: any) => n.userId === user.userId)
  return NextResponse.json({ success: true, notifications: mine })
}
