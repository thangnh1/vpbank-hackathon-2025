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

type NotiType = "SYSTEM" | "CAMPAIGN" | "APPROVAL"
type Notification = {
  id: string
  userId: string
  type: NotiType
  title: string
  message: string
  meta?: Record<string, any> // nên có { campaignId?: string }
  read: boolean
  createdAt: string
}

const LS_KEY = "followedCampaignIds"

export default function FollowingCampaignDetailsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [followed, setFollowed] = useState<Set<string>>(new Set())

  // filters
  const [q, setQ] = useState("")
  const [onlyUnread, setOnlyUnread] = useState(false)

  // init followed from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setFollowed(new Set(JSON.parse(raw)))
    } catch {}
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

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [cRes, nRes] = await Promise.all([
        fetch("/api/campaigns", { cache: "no-store" }),
        fetch("/api/notifications", { cache: "no-store" }),
      ])

      if (!cRes.ok) {
        const j = await cRes.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được chiến dịch")
      }
      const cj = await cRes.json()

      let notis: Notification[] = []
      if (nRes.ok) {
        const nj = await nRes.json().catch(() => ({}))
        notis = Array.isArray(nj.notifications) ? nj.notifications : []
      }

      setCampaigns(Array.isArray(cj.campaigns) ? cj.campaigns : [])
      setNotifications(notis)
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filteredCampaigns = useMemo(() => {
    const kw = q.trim().toLowerCase()
    let list = campaigns.filter((c) => followed.has(c.id))
    if (kw) {
      list = list.filter(
        (c) => c.title.toLowerCase().includes(kw) || (c.summary || "").toLowerCase().includes(kw)
      )
    }
    return list.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  }, [campaigns, followed, q])

  const campaignNotifications = (id: string) => {
    let arr = notifications.filter((n) => n.meta?.campaignId === id)
    if (onlyUnread) arr = arr.filter((n) => !n.read)
    return arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }

  const markCampaignNotisRead = async (ids: string[]) => {
    if (!ids.length) return
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      if (res.ok) {
        const j = await res.json().catch(() => ({}))
        const next = Array.isArray(j.notifications) ? j.notifications : []
        setNotifications(next)
      }
    } catch {}
  }

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Theo dõi chi tiết chiến dịch</h1>
        <p className="text-slate-400 mt-2">
          Xem tiến độ, thông báo và hoạt động liên quan đến các chiến dịch bạn đang theo dõi.
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
              checked={onlyUnread}
              onChange={(e) => setOnlyUnread(e.target.checked)}
            />
            Chỉ hiện thông báo chưa đọc
          </label>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Làm mới</Button>
          <Link href="/dashboard/campaigns">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Quản lý danh sách theo dõi
            </Button>
          </Link>
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

      {loading ? (
        <div className="text-slate-300">Đang tải dữ liệu…</div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          Bạn chưa theo dõi chiến dịch nào. Vào{" "}
          <Link href="/campaigns" className="text-cyan-300 underline underline-offset-4">
            trang chiến dịch
          </Link>{" "}
          để bắt đầu.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCampaigns.map((c) => {
            const pct = c.goal > 0 ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : 0
            const notis = campaignNotifications(c.id)
            const unreadIds = notis.filter((n) => !n.read).map((n) => n.id)

            return (
              <Card key={c.id} className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03]">
                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-white font-semibold text-lg">{c.title}</h2>
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
                      <p className="text-slate-300 mt-1">{c.summary}</p>

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
                    </div>

                    <div className="flex flex-col gap-2 w-48 shrink-0">
                      <Link href={`/campaigns/${c.id}`}>
                        <Button variant="secondary" className="w-full">Xem chi tiết</Button>
                      </Link>
                      <Link href={`/donate?campaignId=${encodeURIComponent(c.id)}`}>
                        <Button className="w-full">Ủng hộ</Button>
                      </Link>
                      <Button
                        variant="outline"
                        className={`w-full border-white/20 text-white hover:bg-white/10 ${
                          followed.has(c.id) ? "!border-emerald-400/30 text-emerald-300" : ""
                        }`}
                        onClick={() => toggleFollow(c.id)}
                      >
                        {followed.has(c.id) ? "Bỏ theo dõi" : "Theo dõi"}
                      </Button>
                      {unreadIds.length > 0 && (
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10"
                          onClick={() => markCampaignNotisRead(unreadIds)}
                        >
                          Đánh dấu đọc ({unreadIds.length})
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notifications list */}
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">Thông báo liên quan</h3>
                      <span className="text-slate-400 text-sm">
                        {notis.length} thông báo{onlyUnread ? " (chưa đọc)" : ""}
                      </span>
                    </div>

                    {notis.length === 0 ? (
                      <div className="text-slate-300 mt-3">Chưa có thông báo nào cho chiến dịch này.</div>
                    ) : (
                      <div className="mt-3 divide-y divide-white/10">
                        {notis.map((n) => (
                          <div key={n.id} className="py-3 flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                {!n.read && <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />}
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    n.type === "APPROVAL"
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : n.type === "CAMPAIGN"
                                      ? "bg-sky-500/20 text-sky-300"
                                      : "bg-slate-500/20 text-slate-300"
                                  }`}
                                >
                                  {n.type === "APPROVAL" ? "Duyệt/Từ chối" : n.type === "CAMPAIGN" ? "Chiến dịch" : "Hệ thống"}
                                </span>
                              </div>
                              <div className="text-white font-semibold mt-1">{n.title}</div>
                              <div className="text-slate-300">{n.message}</div>
                              <div className="text-slate-400 text-xs mt-1">
                                {new Date(n.createdAt).toLocaleString("vi-VN")}
                              </div>
                            </div>

                            <div className="shrink-0">
                              {/* Link chi tiết nếu meta có tuyến đường */}
                              {n.meta?.campaignId ? (
                                <Link href={`/campaigns/${n.meta.campaignId}`}>
                                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    Xem chiến dịch
                                  </Button>
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
