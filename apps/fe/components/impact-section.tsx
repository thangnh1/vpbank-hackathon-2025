"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Marquee3D } from "@/components/marquee-3d"

type Donation = { amount: number }
type Campaign = { status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" }

export function ImpactSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const [totalVnd, setTotalVnd] = useState(0)
  const [countDonations, setCountDonations] = useState(0)
  const [activeCampaigns, setActiveCampaigns] = useState(0)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [dRes, cRes] = await Promise.all([
          fetch("/api/donations", { cache: "no-store" }),
          fetch("/api/campaigns", { cache: "no-store" }),
        ])
        const d = await dRes.json()
        const c = await cRes.json()
        if (!mounted) return
        const donations: Donation[] = d.donations || []
        const campaigns: Campaign[] = c.campaigns || []
        setTotalVnd(donations.reduce((sum, it) => sum + (it.amount || 0), 0))
        setCountDonations(donations.length)
        setActiveCampaigns(campaigns.filter((x) => x.status === "ACTIVE").length)
      } catch {}
    }
    load()
    return () => { mounted = false }
  }, [])

  const stats = useMemo(() => [
    { label: "Tổng số tiền đã ủng hộ", value: totalVnd.toLocaleString("vi-VN") + "₫" },
    { label: "Số giao dịch ủng hộ", value: String(countDonations) },
    { label: "Chiến dịch đang kêu gọi", value: String(activeCampaigns) },
  ], [totalVnd, countDonations, activeCampaigns])

  const testimonials = [
    { name: "Chị Hạnh", org: "Quỹ địa phương", text: "Dễ theo dõi từng khoản chi, mạnh thường quân yên tâm hơn hẳn." },
    { name: "Anh Minh", org: "Đối tác cộng đồng", text: "Thông báo duyệt chi rất kịp thời, xử lý nhanh và minh bạch." },
    { name: "Bạn Trâm", org: "Tình nguyện viên", text: "Giao diện tiếng Việt dễ dùng, báo cáo tác động rõ ràng." },
  ]

  return (
    <section id="impact" className="relative py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-white"
        >
          Tác động & niềm tin
        </motion.h2>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
              <div className="text-slate-300 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <Marquee3D/>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-gray-300 mb-4 leading-relaxed italic">“{t.text}”</p>
                <div className="border-t border-teal-300/10 pt-3">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-teal-300 text-sm">{t.org}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
