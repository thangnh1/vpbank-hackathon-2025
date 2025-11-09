"use client"

import { useEffect, useMemo, useState } from "react"
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

type FollowResponse = {
  campaigns: Campaign[]
  latestActivities: any[]
}

export default function CampaignsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      // kéo campaign list
      const [campsRes, followRes] = await Promise.all([
        fetch("/api/campaigns", { cache: "no-store" }),
        fetch("/api/follows", { cache: "no-store" }),
      ])

      if (!campsRes.ok) {
        const j = await campsRes.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được danh sách chiến dịch")
      }
      const campsJson = await campsRes.json()
      const items: Campaign[] = campsJson.campaigns || []
      setCampaigns(items)

      // nếu chưa login, /api/follows có thể 401 → coi như chưa theo dõi gì
      if (followRes.ok) {
        const fjson: FollowResponse = await followRes.json()
        setFollowedIds(new Set((fjson.campaigns || []).map((c) => c.id)))
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
  }, [])

  const handleFollow = async (id: string) => {
    setProcessing(id)
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: id }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Theo dõi thất bại")
      }
      const data: FollowResponse = await res.json()
      setFollowedIds(new Set((data.campaigns || []).map((c) => c.id)))
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setProcessing(null)
    }
  }

  const handleUnfollow = async (id: string) => {
    setProcessing(id)
    try {
      const res = await fetch("/api/follows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: id }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Bỏ theo dõi thất bại")
      }
      const data: FollowResponse = await res.json()
      setFollowedIds(new Set((data.campaigns || []).map((c) => c.id)))
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setProcessing(null)
    }
  }

  const sorted = useMemo(
    () =>
      [...campaigns].sort((a, b) => {
        // ưu tiên ACTIVE, sau đó theo updatedAt mới nhất
        const rank = (s: Campaign["status"]) =>
          s === "ACTIVE" ? 0 : s === "PAUSED" ? 1 : s === "DRAFT" ? 2 : 3
        const r = rank(a.status) - rank(b.status)
        if (r !== 0) return r
        return a.updatedAt < b.updatedAt ? 1 : -1
      }),
    [campaigns]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <main className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Chiến dịch đang kêu gọi</h1>
          <p className="text-slate-400 mt-2">
            Mọi nội dung hiển thị bằng tiếng Việt. Theo dõi để nhận thông báo duyệt chi / kiểm toán theo thời gian thực.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-slate-300">Đang tải danh sách chiến dịch…</div>
        ) : sorted.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">
            Chưa có chiến dịch nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sorted.map((c) => {
              const pct = c.goal > 0 ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : 0
              const isFollowed = followedIds.has(c.id)
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.04] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{c.title}</h3>
                      <p className="text-slate-300 mt-1 line-clamp-3">{c.summary}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : c.status === "PAUSED"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : c.status === "COMPLETED"
                          ? "bg-sky-500/20 text-sky-300"
                          : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {c.status === "ACTIVE"
                        ? "Đang kêu gọi"
                        : c.status === "PAUSED"
                        ? "Tạm dừng"
                        : c.status === "COMPLETED"
                        ? "Đã hoàn thành"
                        : "Nháp"}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Đã gây quỹ</span>
                      <span className="font-semibold text-white">
                        {c.raised.toLocaleString("vi-VN")}₫ / {c.goal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-cyan-400 to-teal-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  {c.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs text-cyan-300/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex items-center gap-2">
                    <Link href={`/campaigns/${c.id}`}>
                      <Button variant="secondary">Xem chi tiết</Button>
                    </Link>
                    <Link href={`/donate?campaignId=${encodeURIComponent(c.id)}`}>
                      <Button>Ủng hộ</Button>
                    </Link>
                    {isFollowed ? (
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        disabled={processing === c.id}
                        onClick={() => handleUnfollow(c.id)}
                      >
                        {processing === c.id ? "Đang xử lý…" : "Bỏ theo dõi"}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-white/20 hover:bg-white/10"
                        disabled={processing === c.id}
                        onClick={() => handleFollow(c.id)}
                      >
                        {processing === c.id ? "Đang xử lý…" : "Theo dõi"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
