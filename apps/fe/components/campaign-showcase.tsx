"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export function CampaignShowcase() {
  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch("/api/campaigns", { cache: "no-store" })
        const j = await res.json()
        if (mounted) setItems(Array.isArray(j.campaigns) ? j.campaigns : [])
      } catch {
        if (mounted) setItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const top = useMemo(() => {
    return [...items]
      .filter((c) => c.status === "ACTIVE")
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 3)
  }, [items])

  return (
    <section id="campaigns" className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Chiến dịch nổi bật</h2>
            <p className="text-slate-300 mt-2">Một vài chiến dịch đang kêu gọi tại thời điểm hiện tại.</p>
          </div>
          <Link href="/campaigns">
            <Button variant="secondary">Xem tất cả</Button>
          </Link>
        </motion.div>

        {/* Cards */}
        {loading ? (
          <div className="text-slate-300 mt-8">Đang tải…</div>
        ) : top.length === 0 ? (
          <div className="text-slate-300 mt-8">Chưa có chiến dịch nào.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {top.map((c) => {
              const pct = c.goal > 0 ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : 0
              return (
                <Card key={c.id} className="border-white/10 bg-white/5 backdrop-blur">
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-lg">{c.title}</h3>
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
                          <span key={t} className="text-xs text-cyan-300/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                            #{t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <Link href={`/campaigns/${c.id}`} className="col-span-2">
                        <Button variant="secondary" className="w-full">Xem chi tiết</Button>
                      </Link>
                      <Link href={`/donate?campaignId=${encodeURIComponent(c.id)}`}>
                        <Button className="w-full">Ủng hộ</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
