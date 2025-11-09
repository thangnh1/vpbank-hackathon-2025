"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Donation = {
  id: string
  amount: number
  createdAt: string
  campaignId: string
}

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [myDonations, setMyDonations] = useState<Donation[]>([])
  const [unreadNoti, setUnreadNoti] = useState<number>(0)

  // Load my donations + unread notifications
  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // donations (mine=true hỗ trợ cả guest qua anonId)
        const dRes = await fetch("/api/donations?mine=true", { cache: "no-store" })
        const d = await dRes.json().catch(() => ({}))
        if (mounted) setMyDonations(Array.isArray(d.donations) ? d.donations : [])

        // notifications (có thể 401 nếu guest → set 0)
        const nRes = await fetch("/api/notifications?unreadOnly=true", { cache: "no-store" })
        if (nRes.ok) {
          const n = await nRes.json().catch(() => ({}))
          if (mounted) setUnreadNoti(Array.isArray(n.notifications) ? n.notifications.length : 0)
        } else {
          if (mounted) setUnreadNoti(0)
        }
      } catch (e: any) {
        if (mounted) setError(e.message || "Có lỗi xảy ra khi tải dữ liệu")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const totals = useMemo(() => {
    const total = myDonations.reduce((sum, d) => sum + (d.amount || 0), 0)
    const count = myDonations.length
    return { total, count }
  }, [myDonations])

  const recent = useMemo(() => myDonations.slice(0, 6), [myDonations])

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Bảng điều khiển</h1>
        <p className="text-slate-400 mt-2">
          Tổng quan hoạt động của bạn. Giao diện đồng bộ — tiếng Việt hoàn toàn. (Guest cũng thấy số liệu của mình)
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          label="Tổng tiền đã ủng hộ"
          value={`${totals.total.toLocaleString("vi-VN")}₫`}
          className="from-cyan-500/15 to-teal-500/10"
        />
        <SummaryCard
          label="Số giao dịch ủng hộ"
          value={`${totals.count}`}
          className="from-indigo-500/15 to-blue-500/10"
        />
        <SummaryCard
          label="Thông báo chưa đọc"
          value={`${unreadNoti}`}
          className="from-yellow-500/15 to-orange-500/10"
          cta={
            <Link href="/dashboard/notifications">
              <Button variant="outline" className="mt-3 border-white/20 hover:bg-white/10">
                Xem thông báo
              </Button>
            </Link>
          }
        />
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Recent activity */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.04] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold text-lg">Hoạt động gần đây</h2>
            <p className="text-slate-400 text-sm mt-1">Các lần ủng hộ gần nhất của bạn.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/donations">
              <Button variant="secondary">Xem tất cả ủng hộ</Button>
            </Link>
            <Link href="/campaigns">
              <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
                Ủng hộ thêm
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-300 mt-6">Đang tải…</div>
        ) : recent.length === 0 ? (
          <div className="text-slate-300 mt-6">
            Chưa có giao dịch nào. Hãy ghé <Link href="/campaigns" className="text-cyan-300 underline underline-offset-4">trang chiến dịch</Link> để bắt đầu ủng hộ.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-white/10">
            {recent.map((d) => (
              <div key={d.id} className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div className="text-slate-300">
                    Ủng hộ cho chiến dịch <span className="text-white font-medium">{d.campaignId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold">{d.amount.toLocaleString("vi-VN")}₫</span>
                  <span className="text-slate-400">{new Date(d.createdAt).toLocaleString("vi-VN")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  className = "",
  cta,
}: {
  label: string
  value: string
  className?: string
  cta?: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] ${className} p-5`}>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>
      {cta}
    </div>
  )
}
