"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DonationStatus = "PLEDGED" | "ESCROWED" | "SETTLED" | "REFUNDED"

type Donation = {
  id: string
  campaignId: string
  userId: string
  amount: number
  status: DonationStatus
  txId: string
  paymentMethod: "MOCK_QR" | "BANK_TRANSFER" | "CARD"
  message?: string
  createdAt: string
}

const STATUS_LABEL: Record<DonationStatus, string> = {
  PLEDGED: "Đã cam kết",
  ESCROWED: "Đã ký quỹ",
  SETTLED: "Đã đối soát",
  REFUNDED: "Đã hoàn tiền",
}

const STATUS_CLASS: Record<DonationStatus, string> = {
  PLEDGED: "bg-slate-500/20 text-slate-300",
  ESCROWED: "bg-amber-500/20 text-amber-300",
  SETTLED: "bg-emerald-500/20 text-emerald-300",
  REFUNDED: "bg-rose-500/20 text-rose-300",
}

export default function MyDonationsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Donation[]>([])

  // filters
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<"all" | DonationStatus>("all")

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

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return items
      .filter((d) => (status === "all" ? true : d.status === status))
      .filter((d) => {
        if (!kw) return true
        return (
          d.txId.toLowerCase().includes(kw) ||
          d.campaignId.toLowerCase().includes(kw) ||
          (d.message || "").toLowerCase().includes(kw)
        )
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }, [items, q, status])

  const total = useMemo(() => filtered.reduce((s, d) => s + (d.amount || 0), 0), [filtered])

  const exportCsv = () => {
    const rows = [
      ["createdAt", "campaignId", "amount", "status", "txId", "paymentMethod", "message"],
      ...filtered.map((d) => [
        new Date(d.createdAt).toLocaleString("vi-VN"),
        d.campaignId,
        d.amount,
        STATUS_LABEL[d.status],
        d.txId,
        d.paymentMethod,
        (d.message || "").replace(/\s+/g, " "),
      ]),
    ]
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "donations.csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Ủng hộ của tôi</h1>
        <p className="text-slate-400 mt-2">
          Danh sách giao dịch ủng hộ của bạn (khách/đăng nhập đều xem được nhờ định danh ẩn danh).
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 flex items-center gap-2">
          <Input
            placeholder="Tìm theo mã giao dịch, ID chiến dịch, lời nhắn…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ESCROWED">Đã ký quỹ</option>
            <option value="SETTLED">Đã đối soát</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
            <option value="PLEDGED">Đã cam kết</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={exportCsv}>
            Xuất CSV
          </Button>
          <Button variant="secondary" onClick={load}>Làm mới</Button>
          <Link href="/campaigns">
            <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
              Ủng hộ thêm
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-slate-300">
              <th className="px-4 py-3 font-medium">Thời gian</th>
              <th className="px-4 py-3 font-medium">Chiến dịch</th>
              <th className="px-4 py-3 font-medium">Số tiền</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Mã giao dịch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-300">
                  Đang tải dữ liệu…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-300">
                  Không có giao dịch nào phù hợp.
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="text-slate-200">
                  <td className="px-4 py-3">{new Date(d.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="px-4 py-3">
                    <Link href={`/campaigns/${d.campaignId}`} className="text-cyan-300 hover:underline">
                      {d.campaignId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold">{d.amount.toLocaleString("vi-VN")}₫</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_CLASS[d.status]}`}>
                      {STATUS_LABEL[d.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">{d.txId}</td>
                </tr>
              ))
            )}
          </tbody>
          {!loading && filtered.length > 0 && (
            <tfoot>
              <tr className="bg-white/5">
                <td className="px-4 py-3 text-slate-400" colSpan={2}>
                  Tổng cộng ({filtered.length} giao dịch)
                </td>
                <td className="px-4 py-3 font-bold text-white">{total.toLocaleString("vi-VN")}₫</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
