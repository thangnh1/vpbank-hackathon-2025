import { type NextRequest, NextResponse } from "next/server"
import {
  getAuthUser,
  requestNewCampaign,
  approveCampaignRequest,
  rejectCampaignRequest,
  listCampaignRequests,
} from "@/lib/mock-db"

// GET /api/campaign-requests
// - Admin/Auditor/Org Admin: thấy tất cả
// - User thường: chỉ thấy request của mình
export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })

    const items = await listCampaignRequests(user.userId, user.role)
    return NextResponse.json({ requests: items })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Không tải được danh sách yêu cầu" }, { status: 500 })
  }
}

// POST /api/campaign-requests
// body: { title: string, details: string }
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập để gửi yêu cầu" }, { status: 401 })

    const { title, details } = await req.json()
    if (!title || !details) {
      return NextResponse.json({ error: "Thiếu tiêu đề hoặc nội dung chi tiết" }, { status: 400 })
    }

    const created = await requestNewCampaign({
      title: String(title),
      details: String(details),
      requestedBy: user.userId,
    })

    return NextResponse.json({ success: true, request: created })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Gửi yêu cầu thất bại" }, { status: 500 })
  }
}

// PATCH /api/campaign-requests
// body: { id: string, action: "APPROVE" | "REJECT", reason?: string }
export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user || !["SUPERADMIN", "AUDITOR", "ORG_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Bạn không có quyền duyệt yêu cầu" }, { status: 403 })
    }

    const { id, action, reason } = await req.json()
    if (!id || !action) return NextResponse.json({ error: "Thiếu id hoặc action" }, { status: 400 })

    let updated
    if (action === "APPROVE") {
      updated = await approveCampaignRequest(String(id), user.userId, reason ? String(reason) : undefined)
    } else if (action === "REJECT") {
      if (!reason) {
        return NextResponse.json({ error: "Vui lòng ghi rõ lý do từ chối" }, { status: 400 })
      }
      updated = await rejectCampaignRequest(String(id), user.userId, String(reason))
    } else {
      return NextResponse.json({ error: "Action không hợp lệ" }, { status: 400 })
    }

    return NextResponse.json({ success: true, request: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Cập nhật trạng thái yêu cầu thất bại" }, { status: 500 })
  }
}
