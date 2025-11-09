import { type NextRequest, NextResponse } from "next/server"
import { listCampaigns, upsertCampaign, getAuthUser } from "@/lib/mock-db"

// GET /api/campaigns
// -> Trả về danh sách campaign từ JSON DB
export async function GET() {
  try {
    const items = await listCampaigns()
    return NextResponse.json({ campaigns: items, total: items.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Không tải được danh sách chiến dịch" }, { status: 500 })
  }
}

// POST /api/campaigns
// body: { title: string, summary?: string, goal?: number, tags?: string[], status?: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" }

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })
    }
    if (!["ORG_ADMIN", "SUPERADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Bạn không có quyền tạo chiến dịch" }, { status: 403 })
    }

    const body = await request.json().catch(() => ({} as any))
    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "Thiếu hoặc sai định dạng 'title'" }, { status: 400 })
    }

    const created = await upsertCampaign({
      title: String(body.title),
      summary: body.summary ? String(body.summary) : "",
      goal: body.goal ? Number(body.goal) : 0,
      raised: body.raised ? Number(body.raised) : 0,
      status: (body.status as any) || "DRAFT",
      ownerId: user.userId,
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    })

    return NextResponse.json({ success: true, campaign: created })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Tạo chiến dịch thất bại" }, { status: 500 })
  }
}
