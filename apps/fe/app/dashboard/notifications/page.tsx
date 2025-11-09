"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type NotiType = "SYSTEM" | "CAMPAIGN" | "APPROVAL"

type Notification = {
  id: string
  userId: string
  type: NotiType
  title: string
  message: string
  meta?: Record<string, any>
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [tab, setTab] = useState<"all" | "unread">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Notification[]>([])
  const [marking, setMarking] = useState<string | "ALL" | null>(null)

  const filtered = useMemo(() => (tab === "unread" ? items.filter((n) => !n.read) : items), [items, tab])
  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/notifications${tab === "unread" ? "?unreadOnly=true" : ""}`, { cache: "no-store" })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được thông báo")
      }
      const data = await res.json()
      setItems(data.notifications || [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const markAllRead = async () => {
    setMarking("ALL")
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không thể đánh dấu đã đọc")
      }
      const data = await res.json()
      setItems(data.notifications || [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setMarking(null)
    }
  }

  const markOneRead = async (id: string) => {
    setMarking(id)
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không thể đánh dấu đã đọc")
      }
      const data = await res.json()
      setItems(data.notifications || [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setMarking(null)
    }
  }

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Thông báo của tôi</h1>
        <p className="text-slate-400 mt-2">
          Bạn có <span className="text-cyan-300 font-semibold">{unreadCount}</span> thông báo chưa đọc.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setTab("all")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            tab === "all"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setTab("unread")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            tab === "unread"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          Chưa đọc
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/10"
            disabled={marking === "ALL" || unreadCount === 0}
            onClick={markAllRead}
          >
            {marking === "ALL" ? "Đang xử lý…" : "Đánh dấu tất cả đã đọc"}
          </Button>
          <Button variant="secondary" onClick={load}>
            Làm mới
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-300">Đang tải thông báo…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">Không có thông báo nào.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 bg-white/5 ${n.read ? "border-white/10" : "border-cyan-400/30"}`}
            >
              <div className="flex items-start justify-between gap-4">
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
                  <h3 className="text-white font-semibold mt-2">{n.title}</h3>
                  <p className="text-slate-300 mt-1">{n.message}</p>
                  <p className="text-slate-400 text-xs mt-2">{new Date(n.createdAt).toLocaleString("vi-VN")}</p>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={n.read || marking === n.id}
                    onClick={() => markOneRead(n.id)}
                  >
                    {n.read ? "Đã đọc" : marking === n.id ? "Đang xử lý…" : "Đánh dấu đã đọc"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
