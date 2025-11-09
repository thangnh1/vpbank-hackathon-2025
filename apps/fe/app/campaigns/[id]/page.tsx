"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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

export default function CampaignDetailPage() {
  const pathname = usePathname()
  const router = useRouter()
  const id = useMemo(() => pathname?.split("/").pop() ?? "", [pathname])

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)

  const pct = useMemo(() => {
    if (!campaign || campaign.goal <= 0) return 0
    return Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
  }, [campaign])

  const load = async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      // detail
      const res = await fetch(`/api/campaigns/${id}`, { cache: "no-store" })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được thông tin chiến dịch")
      }
      const j = await res.json()
      setCampaign(j.campaign)

      // follows (có thể 401 nếu chưa login)
      const followRes = await fetch("/api/follows", { cache: "no-store" })
      if (followRes.ok) {
        const fjson = await followRes.json()
        setFollowedIds(new Set((fjson.campaigns || []).map((c: Campaign) => c.id)))
      } else {
        setFollowedIds(new Set())
      }
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleFollow = async () => {
    if (!campaign) return
    setProcessing(true)
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaign.id }),
      })
      if (res.status === 401) {
        router.push("/auth/login")
        return
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Theo dõi thất bại")
      }
      const data = await res.json()
      setFollowedIds(new Set((data.campaigns || []).map((c: Campaign) => c.id)))
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setProcessing(false)
    }
  }

  const handleUnfollow = async () => {
    if (!campaign) return
    setProcessing(true)
    try {
      const res = await fetch("/api/follows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaign.id }),
      })
      if (res.status === 401) {
        router.push("/auth/login")
        return
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Bỏ theo dõi thất bại")
      }
      const data = await res.json()
      setFollowedIds(new Set((data.campaigns || []).map((c: Campaign) => c.id)))
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setProcessing(false)
    }
  }

  const isFollowed = campaign ? followedIds.has(campaign.id) : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <main className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="text-slate-300">Đang tải chiến dịch…</div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        ) : !campaign ? (
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-slate-300">
            Không tìm thấy chiến dịch.
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{campaign.title}</h1>
                <p className="text-slate-300 mt-2">{campaign.summary}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    Đã gây quỹ:{" "}
                    <span className="font-semibold text-white">
                      {campaign.raised.toLocaleString("vi-VN")}₫
                    </span>
                  </span>
                  <span className="opacity-50">•</span>
                  <span className="inline-flex items-center gap-1">
                    Mục tiêu:{" "}
                    <span className="font-semibold text-white">
                      {campaign.goal.toLocaleString("vi-VN")}₫
                    </span>
                  </span>
                  <span className="opacity-50">•</span>
                  <span className="inline-flex items-center gap-1">
                    Trạng thái:{" "}
                    <span className="font-semibold text-white">
                      {campaign.status === "ACTIVE"
                        ? "Đang kêu gọi"
                        : campaign.status === "COMPLETED"
                        ? "Đã hoàn thành"
                        : campaign.status === "PAUSED"
                        ? "Tạm dừng"
                        : "Nháp"}
                    </span>
                  </span>
                </div>

                {campaign.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {campaign.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs text-cyan-300/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2">
                <Link href={`/donate?campaignId=${encodeURIComponent(campaign.id)}`}>
                  <Button>Ủng hộ</Button>
                </Link>
                {isFollowed ? (
                  <Button
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    disabled={processing}
                    onClick={handleUnfollow}
                  >
                    {processing ? "Đang xử lý…" : "Bỏ theo dõi"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    disabled={processing}
                    onClick={handleFollow}
                  >
                    {processing ? "Đang xử lý…" : "Theo dõi"}
                  </Button>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Tiến độ gây quỹ</span>
                <span className="font-semibold text-white">{pct}%</span>
              </div>
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-cyan-400 to-teal-400" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Content sections - có thể mở rộng sau (ảnh, cập nhật, bảng chi, audit...) */}
            <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: About / Updates placeholder */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-white font-semibold text-lg">Giới thiệu</h3>
                  <p className="text-slate-300 mt-2">
                    Chiến dịch do tổ chức khởi xướng nhằm giải quyết nhu cầu cấp thiết tại địa phương. Mọi dòng
                    tiền sẽ được theo dõi minh bạch, có kiểm toán và báo cáo công khai.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-white font-semibold text-lg">Cập nhật (đang phát triển)</h3>
                  <p className="text-slate-300 mt-2">
                    Bảng cập nhật theo thời gian thực sẽ hiển thị tại đây (log duyệt chi, phát quà, nghiệm thu…).
                  </p>
                </div>
              </div>

              {/* Right: Quick actions */}
              <aside className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-white font-semibold text-lg">Hành động nhanh</h3>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link href={`/donate?campaignId=${encodeURIComponent(campaign.id)}`}>
                      <Button className="w-full">Ủng hộ ngay</Button>
                    </Link>
                    <Link href="/following-campaign-details">
                      <Button variant="secondary" className="w-full">
                        Xem chiến dịch đang theo dõi
                      </Button>
                    </Link>
                    <Link href="/dashboard/notifications">
                      <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                        Thông báo của tôi
                      </Button>
                    </Link>
                  </div>
                </div>
              </aside>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  )
}
