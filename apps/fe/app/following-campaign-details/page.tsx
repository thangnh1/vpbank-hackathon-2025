"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type Campaign = {
  id: string
  title: string
  slug: string
  summary: string
  goal: number
  raised: number
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED"
  ownerId: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

type Activity = {
  id: string
  type:
    | "DONATION_CREATED"
    | "CAMPAIGN_REQUESTED"
    | "CAMPAIGN_APPROVED"
    | "CAMPAIGN_REJECTED"
    | "FOLLOWED"
    | "UNFOLLOWED"
    | "SYSTEM"
  actorId: string
  targetType: "CAMPAIGN" | "REQUEST" | "NOTIFICATION" | "SYSTEM"
  targetId?: string
  meta?: Record<string, any>
  createdAt: string
}

export default function FollowingCampaignDetailsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/follows", { cache: "no-store" })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được dữ liệu theo dõi")
      }
      const data = await res.json()
      setCampaigns(data.campaigns || [])
      setActivities(data.latestActivities || [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUnfollow = async (campaignId: string) => {
    setProcessing(campaignId)
    try {
      const res = await fetch("/api/follows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Bỏ theo dõi thất bại")
      }
      const data = await res.json()
      setCampaigns(data.campaigns || [])
      setActivities(data.latestActivities || [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <main className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Chiến dịch bạn đang theo dõi</h1>
          <p className="text-slate-400 mt-2">
            Quản lý những chiến dịch đã theo dõi và xem hoạt động gần đây.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-slate-300">Đang tải dữ liệu…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaign list */}
            <section className="lg:col-span-2 space-y-4">
              {campaigns.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">
                  Bạn chưa theo dõi chiến dịch nào.
                </div>
              ) : (
                campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{c.title}</h3>
                        <p className="text-slate-300 mt-1">{c.summary}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            Đã gây quỹ: <span className="font-semibold text-white">{c.raised.toLocaleString("vi-VN")}₫</span>
                          </span>
                          <span className="opacity-50">•</span>
                          <span className="inline-flex items-center gap-1">
                            Mục tiêu: <span className="font-semibold text-white">{c.goal.toLocaleString("vi-VN")}₫</span>
                          </span>
                          <span className="opacity-50">•</span>
                          <span className="inline-flex items-center gap-1">
                            Trạng thái:{" "}
                            <span className="font-semibold text-white">
                              {c.status === "ACTIVE"
                                ? "Đang kêu gọi"
                                : c.status === "COMPLETED"
                                ? "Đã hoàn thành"
                                : c.status === "PAUSED"
                                ? "Tạm dừng"
                                : "Nháp"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/campaigns/${c.id}`}>
                          <Button variant="secondary">Xem chi tiết</Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-white/20 hover:bg-white/90"
                          disabled={processing === c.id}
                          onClick={() => handleUnfollow(c.id)}
                        >
                          {processing === c.id ? "Đang xử lý…" : "Bỏ theo dõi"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Activity timeline */}
            <aside className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-white font-semibold">Hoạt động gần đây</h3>
                <div className="mt-4 space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-slate-300 text-sm">Chưa có hoạt động nào.</p>
                  ) : (
                    activities.map((a) => (
                      <div key={a.id} className="relative pl-5">
                        <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-cyan-400" />
                        <p className="text-slate-200 text-sm">
                          {renderActivity(a)}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">{new Date(a.createdAt).toLocaleString("vi-VN")}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

function renderActivity(a: Activity) {
  switch (a.type) {
    case "FOLLOWED":
      return "Bạn đã theo dõi một chiến dịch"
    case "UNFOLLOWED":
      return "Bạn đã bỏ theo dõi một chiến dịch"
    case "DONATION_CREATED":
      return "Bạn đã ủng hộ một chiến dịch"
    case "CAMPAIGN_REQUESTED":
      return `Đã gửi yêu cầu tạo chiến dịch${a.meta?.title ? ` “${a.meta.title}”` : ""}`
    case "CAMPAIGN_APPROVED":
      return `Yêu cầu chiến dịch được duyệt${a.meta?.reason ? ` (ghi chú: ${a.meta.reason})` : ""}`
    case "CAMPAIGN_REJECTED":
      return `Yêu cầu chiến dịch bị từ chối${a.meta?.reason ? ` (lý do: ${a.meta.reason})` : ""}`
    default:
      return "Hoạt động hệ thống"
  }
}
