import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser, listDonations, createDonation } from "@/lib/mock-db"

// GET /api/donations?mine=true&campaignId=...
export async function GET(req: NextRequest) {
  const mine = req.nextUrl.searchParams.get("mine") === "true"
  const campaignId = req.nextUrl.searchParams.get("campaignId") || undefined

  if (mine) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })
    const items = await listDonations(user.userId)
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
    if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })

    const body = await req.json().catch(() => ({} as any))
    const { campaignId, amount, paymentMethod, message } = body || {}

    if (!campaignId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Thiếu campaignId hoặc số tiền không hợp lệ" }, { status: 400 })
    }

    const donation = await createDonation({
      userId: user.userId,
      campaignId: String(campaignId),
      amount: Math.floor(amount),
      paymentMethod: (paymentMethod || "MOCK_QR"),
      message: message ? String(message) : undefined,
    })

    return NextResponse.json({ success: true, donation })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Tạo khoản ủng hộ thất bại" }, { status: 500 })
  }
}
