import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser, getCampaignById, upsertCampaign } from "@/lib/mock-db"

// GET /api/campaigns/[id]
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  try {
    // params có thể là Promise ở một số runtime → luôn await an toàn
    const resolved = "then" in (ctx as any).params ? await (ctx as any).params : (ctx as any).params
    const id = resolved?.id as string | undefined

    if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 })

    const item = await getCampaignById(String(id))
    if (!item) return NextResponse.json({ error: "Không tìm thấy chiến dịch" }, { status: 404 })

    return NextResponse.json({ campaign: item })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Không tải được chiến dịch" }, { status: 500 })
  }
}

// PATCH /api/campaigns/[id]
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })
    if (!["ORG_ADMIN", "SUPERADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Bạn không có quyền cập nhật chiến dịch" }, { status: 403 })
    }

    const resolved = "then" in (ctx as any).params ? await (ctx as any).params : (ctx as any).params
    const id = resolved?.id as string | undefined
    if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 })

    const current = await getCampaignById(String(id))
    if (!current) return NextResponse.json({ error: "Không tìm thấy chiến dịch" }, { status: 404 })

    const body = await request.json().catch(() => ({} as any))

    const updated = await upsertCampaign({
      id: current.id,
      ownerId: current.ownerId,
      title: typeof body.title === "string" && body.title.trim() ? body.title : current.title,
      summary: typeof body.summary === "string" ? body.summary : current.summary,
      goal: typeof body.goal === "number" ? body.goal : current.goal,
      raised: typeof body.raised === "number" ? body.raised : current.raised,
      status: (["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"] as const).includes(body.status)
        ? body.status
        : current.status,
      tags: Array.isArray(body.tags) ? body.tags.map(String) : current.tags,
      slug: current.slug,
    })

    return NextResponse.json({ success: true, campaign: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Cập nhật chiến dịch thất bại" }, { status: 500 })
  }
}
