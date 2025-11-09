"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type DonationStatus = "PLEDGED" | "ESCROWED" | "SETTLED" | "REFUNDED"

type Donation = {
  id: string
  campaignId: string
  amount: number
  status: DonationStatus
  createdAt: string
}

type Badge = {
  id: string
  name: string
  desc: string
  threshold: number // VND
}

const BADGES: Badge[] = [
  { id: "seed", name: "Seed", desc: "Ủng hộ từ 100.000₫", threshold: 100_000 },
  { id: "sprout", name: "Sprout", desc: "Ủng hộ từ 1.000.000₫", threshold: 1_000_000 },
  { id: "bloom", name: "Bloom", desc: "Ủng hộ từ 5.000.000₫", threshold: 5_000_000 },
  { id: "evergreen", name: "Evergreen", desc: "Ủng hộ từ 10.000.000₫", threshold: 10_000_000 },
]

export default function ImpactPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Donation[]>([])

  // Load donations của riêng bạn (guest cũng được nhờ anonId)
  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/donations?mine=true", { cache: "no-store" })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được dữ liệu ủng hộ")
      }
      const j = await res.json()
      setItems(Array.isArray(j.donations) ? j.donations : [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Stats cá nhân
  const stats = useMemo(() => {
    const total = items.reduce((s, d) => s + (d.amount || 0), 0)
    const count = items.length
    const avg = count > 0 ? Math.round(total / count) : 0

    // streak theo ngày liên tiếp (demo tính trên createdAt)
    const days = Array.from(new Set(items.map((d) => new Date(d.createdAt).toDateString()))).sort()
    let best = 0
    let cur = 0
    let prevDate: Date | null = null
    for (const ds of days) {
      const dt = new Date(ds)
      if (!prevDate) {
        cur = 1
      } else {
        const diff = (dt.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        cur = diff === 1 ? cur + 1 : 1
      }
      best = Math.max(best, cur)
      prevDate = dt
    }

    return { total, count, avg, bestStreak: best }
  }, [items])

  // Huy hiệu theo ngưỡng tổng VND
  const earned = useMemo(() => BADGES.filter((b) => stats.total >= b.threshold), [stats.total])
  const nextBadge = useMemo(() => BADGES.find((b) => stats.total < b.threshold) || null, [stats.total])

  // 3 giao dịch gần đây
  const recent = useMemo(
    () => [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 3),
    [items]
  )

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Huy hiệu tác động</h1>
        <p className="text-slate-400 mt-2">
          Tổng hợp mức đóng góp và huy hiệu bạn đã mở khoá. Toàn bộ dữ liệu tính theo giao dịch ủng hộ của bạn.
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Tổng tiền đã ủng hộ" value={`${stats.total.toLocaleString("vi-VN")}₫`} />
        <SummaryCard label="Số giao dịch" value={`${stats.count}`} />
        <SummaryCard label="Trung bình mỗi lần" value={`${stats.avg.toLocaleString("vi-VN")}₫`} />
        <SummaryCard label="Chuỗi ngày liên tiếp" value={`${stats.bestStreak}`} />
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Badges */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.04] p-6 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold text-lg">Huy hiệu đã sở hữu</h2>
            <p className="text-slate-400 text-sm mt-1">Tự động mở khoá theo tổng số tiền bạn đã ủng hộ.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={load}>Làm mới</Button>
            <Link href="/campaigns">
              <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
                Ủng hộ thêm
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((b) => {
            const has = earned.some((x) => x.id === b.id)
            return (
              <div
                key={b.id}
                className={`rounded-xl border p-5 ${
                  has ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold">{b.name}</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      has ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {has ? "Đã mở khoá" : "Chưa đạt"}
                  </span>
                </div>
                <p className="text-slate-300 mt-2">{b.desc}</p>
                <p className="text-slate-400 text-sm mt-3">
                  Ngưỡng: <span className="text-white font-medium">{b.threshold.toLocaleString("vi-VN")}₫</span>
                </p>
              </div>
            )
          })}
        </div>

        {nextBadge && (
          <div className="mt-5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-4 text-slate-200">
            Còn thiếu{" "}
            <b>{Math.max(0, nextBadge.threshold - stats.total).toLocaleString("vi-VN")}₫</b>{" "}
            để mở khoá huy hiệu <b>{nextBadge.name}</b>.
          </div>
        )}
      </section>

      {/* Recent donations */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold text-lg">3 giao dịch gần nhất</h2>
            <p className="text-slate-400 text-sm mt-1">Tính vào tổng tác động cá nhân của bạn.</p>
          </div>
          <Link href="/dashboard/donations">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Xem tất cả
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-300 mt-6">Đang tải…</div>
        ) : recent.length === 0 ? (
          <div className="text-slate-300 mt-6">
            Chưa có giao dịch. Bắt đầu tại{" "}
            <Link href="/campaigns" className="text-cyan-300 underline underline-offset-4">trang chiến dịch</Link>.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-white/10">
            {recent.map((d) => (
              <div key={d.id} className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <div className="text-slate-300">
                    Ủng hộ cho <span className="text-white font-medium">{d.campaignId}</span>
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
