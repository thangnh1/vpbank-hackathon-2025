import { type NextRequest, NextResponse } from "next/server"
import {
  getAuthUser,
  followCampaign,
  unfollowCampaign,
  getFollowingDetails,
} from "@/lib/mock-db"

// GET /api/follows
// -> Trả về các campaign mà user đang theo dõi + activity gần đây
export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })

  const data = await getFollowingDetails(user.userId)
  return NextResponse.json({ ...data })
}

// POST /api/follows
// body: { campaignId: string }
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })

  const { campaignId } = await req.json().catch(() => ({ campaignId: undefined }))
  if (!campaignId) return NextResponse.json({ error: "Thiếu campaignId" }, { status: 400 })

  await followCampaign(user.userId, String(campaignId))
  const data = await getFollowingDetails(user.userId)
  return NextResponse.json({ success: true, ...data })
}

// DELETE /api/follows
// body: { campaignId: string }
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 })

  const { campaignId } = await req.json().catch(() => ({ campaignId: undefined }))
  if (!campaignId) return NextResponse.json({ error: "Thiếu campaignId" }, { status: 400 })

  await unfollowCampaign(user.userId, String(campaignId))
  const data = await getFollowingDetails(user.userId)
  return NextResponse.json({ success: true, ...data })
}
