"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Campaign = {
  id: string
  title: string
  summary: string
  goal: number
  raised: number
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED"
  updatedAt: string
  tags?: string[]
}

const LS_KEY = "followedCampaignIds"

export default function FollowingCampaignsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Campaign[]>([])

  // local "follow" state (persisted per browser)
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const [onlyFollowing, setOnlyFollowing] = useState(true)
  const [q, setQ] = useState("")

  // load campaigns
  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/campaigns", { cache: "no-store" })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được danh sách chiến dịch")
      }
      const data = await res.json()
      setItems(Array.isArray(data.campaigns) ? data.campaigns : [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  // load follows from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const arr: string[] = JSON.parse(raw)
        setFollowed(new Set(arr))
      }
    } catch {}
    load()
  }, [])

  const saveFollowed = (s: Set<string>) => {
    setFollowed(new Set(s))
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(s)))
    } catch {}
  }

  const toggleFollow = (id: string) => {
    const next = new Set(followed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    saveFollowed(next)
  }

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    const base = items
      .filter((c) => (onlyFollowing ? followed.has(c.id) : true))
      .filter((c) => (kw ? c.title.toLowerCase().includes(kw) || (c.summary || "").toLowerCase().includes(kw) : true))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

    // ưu tiên chiến dịch ACTIVE
    return base.sort((a, b) => {
      const order = (s: Campaign["status"]) =>
        s === "ACTIVE" ? 0 : s === "PAUSED" ? 1 : s === "DRAFT" ? 2 : 3
      return order(a.status) - order(b.status)
    })
  }, [items, onlyFollowing, q, followed])

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Chiến dịch theo dõi</h1>
        <p className="text-slate-400 mt-2">
          Quản lý danh sách chiến dịch bạn đang theo dõi. Dữ liệu đồng bộ UI, content tiếng Việt hoàn toàn.
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 flex items-center gap-2">
          <Input
            placeholder="Tìm theo tiêu đề/mô tả chiến dịch…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
          />
          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={onlyFollowing}
              onChange={(e) => setOnlyFollowing(e.target.checked)}
            />
            Chỉ hiển thị chiến dịch đang theo dõi
          </label>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Làm mới</Button>
          <Link href="/campaigns">
            <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
              Khám phá chiến dịch
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Grid cards */}
      {loading ? (
        <div className="text-slate-300">Đang tải dữ liệu…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          {onlyFollowing ? (
            <>
              Bạn chưa theo dõi chiến dịch nào. Vào{" "}
              <Link href="/campaigns" className="text-cyan-300 underline underline-offset-4">
                trang chiến dịch
              </Link>{" "}
              để bắt đầu.
            </>
          ) : (
            "Không có chiến dịch nào phù hợp."
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const pct = c.goal > 0 ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : 0
            const isFollow = followed.has(c.id)
            return (
              <Card key={c.id} className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03]">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white font-semibold text-lg">{c.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : c.status === "PAUSED"
                          ? "bg-amber-500/20 text-amber-300"
                          : c.status === "DRAFT"
                          ? "bg-slate-500/20 text-slate-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {c.status === "ACTIVE"
                        ? "Đang kêu gọi"
                        : c.status === "PAUSED"
                        ? "Tạm dừng"
                        : c.status === "DRAFT"
                        ? "Nháp"
                        : "Hoàn thành"}
                    </span>
                  </div>

                  <p className="text-slate-300 mt-1 line-clamp-3">{c.summary}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Đã gây quỹ</span>
                      <span className="text-white font-semibold">
                        {c.raised.toLocaleString("vi-VN")}₫ / {c.goal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-cyan-400 to-teal-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {c.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-xs text-cyan-300/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <Link className="col-span-2" href={`/campaigns/${c.id}`}>
                      <Button variant="secondary" className="w-full">Xem chi tiết</Button>
                    </Link>
                    <Link href={`/donate?campaignId=${encodeURIComponent(c.id)}`}>
                      <Button className="w-full">Ủng hộ</Button>
                    </Link>
                  </div>

                  <div className="mt-3">
                    <Button
                      variant="outline"
                      className={`w-full border-white/20 hover:bg-white/10 ${
                        isFollow ? "!border-emerald-400/30 text-emerald-300" : ""
                      }`}
                      onClick={() => toggleFollow(c.id)}
                    >
                      {isFollow ? "Bỏ theo dõi" : "Theo dõi"}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Link sang trang chi tiết theo dõi (nếu bạn muốn giữ trang riêng) */}
      <div className="mt-6">
        <Link href="/following-campaign-details">
          <Button variant="outline" className="border-white/20 hover:bg-white/10">
            Xem trang theo dõi chi tiết
          </Button>
        </Link>
      </div>
    </div>
  )
}
