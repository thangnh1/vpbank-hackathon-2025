import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"
import { getAuthUser, listDonations, createDonation } from "@/lib/mock-db"

// GET /api/donations?mine=true&campaignId=...
export async function GET(req: NextRequest) {
  const mine = req.nextUrl.searchParams.get("mine") === "true"
  const campaignId = req.nextUrl.searchParams.get("campaignId") || undefined

  const user = await getAuthUser()
  const cookieStore = await cookies()
  const anonId = cookieStore.get("anonId")?.value

  if (mine) {
    // Ưu tiên user đăng nhập; nếu không, fallback theo anonId (guest)
    const mineUserId = user?.userId || anonId
    if (!mineUserId) {
      return NextResponse.json({ donations: [], total: 0 })
    }
    const items = await listDonations(mineUserId)
    const filtered = campaignId ? items.filter((d) => d.campaignId === campaignId) : items
    return NextResponse.json({ donations: filtered, total: filtered.length })
  }

  const items = await listDonations()
  const filtered = campaignId ? items.filter((d) => d.campaignId === campaignId) : items
  return NextResponse.json({ donations: filtered, total: filtered.length })
}

// POST /api/donations
// body: { campaignId: string, amount: number, paymentMethod?: "MOCK_QR"|"BANK_TRANSFER"|"CARD", message?: string }
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    const body = await req.json().catch(() => ({} as any))
    const { campaignId, amount, paymentMethod, message } = body || {}

    if (!campaignId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Thiếu campaignId hoặc số tiền không hợp lệ" }, { status: 400 })
    }

    // Cho phép mọi role + guest.
    // Nếu là guest (chưa đăng nhập), dùng anonId cookie để gắn với một người dùng ẩn danh.
    const cookieStore = await cookies()
    let anonId = cookieStore.get("anonId")?.value
    let setAnonOnResponse = false
    if (!user && !anonId) {
      anonId = `anon-${randomUUID()}`
      setAnonOnResponse = true
    }

    const donation = await createDonation({
      userId: user?.userId || (anonId as string),
      campaignId: String(campaignId),
      amount: Math.floor(amount),
      paymentMethod: paymentMethod || "MOCK_QR",
      message: message ? String(message) : undefined,
    })

    const res = NextResponse.json({ success: true, donation })
    // nếu vừa tạo anonId mới → set cookie cho client để theo dõi tiếp
    if (setAnonOnResponse && anonId) {
      res.cookies.set("anonId", anonId, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 năm
      })
    }
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Tạo khoản ủng hộ thất bại" }, { status: 500 })
  }
}
