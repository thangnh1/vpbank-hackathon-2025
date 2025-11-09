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

export default function ReceiptsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Donation[]>([])

  // filters
  const [q, setQ] = useState("")
  const [onlySettled, setOnlySettled] = useState(true)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      // mine=true hỗ trợ cả guest (theo anonId cookie)
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
      .filter((d) => (onlySettled ? d.status === "SETTLED" || d.status === "ESCROWED" : true))
      .filter((d) => {
        if (!kw) return true
        return (
          d.txId.toLowerCase().includes(kw) ||
          d.campaignId.toLowerCase().includes(kw) ||
          (d.message || "").toLowerCase().includes(kw)
        )
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }, [items, q, onlySettled])

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
    a.download = "receipts.csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const printReceipt = (d: Donation) => {
    // Mock “in biên lai”: mở cửa sổ nhẹ nhàng để user in/save PDF (demo)
    const w = window.open("", "_blank", "width=720,height=900")
    if (!w) return
    const html = `
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>Biên lai ủng hộ – ${d.txId}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial; padding: 24px; color: #0f172a; }
            h1 { font-size: 20px; margin: 0 0 12px; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; }
            .muted { color: #475569; }
            .total { font-weight: 700; font-size: 18px; }
            .badge { display:inline-block; padding: 4px 8px; border-radius: 999px; background:#e2e8f0; }
          </style>
        </head>
        <body>
          <h1>Biên lai ủng hộ</h1>
          <div class="card">
            <div class="row"><div class="muted">Mã giao dịch</div><div>${d.txId}</div></div>
            <div class="row"><div class="muted">Chiến dịch</div><div>${d.campaignId}</div></div>
            <div class="row"><div class="muted">Thời gian</div><div>${new Date(d.createdAt).toLocaleString("vi-VN")}</div></div>
            <div class="row"><div class="muted">Trạng thái</div><div><span class="badge">${STATUS_LABEL[d.status]}</span></div></div>
            <div class="row"><div class="muted">Phương thức</div><div>${d.paymentMethod}</div></div>
            <div class="row"><div class="muted">Lời nhắn</div><div>${(d.message || "(không có)").replace(/</g,"&lt;")}</div></div>
            <hr style="margin:12px 0;border:none;border-top:1px solid #e2e8f0"/>
            <div class="row total"><div>Tổng tiền</div><div>${d.amount.toLocaleString("vi-VN")}₫</div></div>
          </div>
          <p class="muted" style="margin-top:16px;">* Biên lai demo phục vụ trải nghiệm sản phẩm (không có giá trị pháp lý).</p>
          <script>window.print()</script>
        </body>
      </html>
    `
    w.document.open()
    w.document.write(html)
    w.document.close()
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Biên lai & Thuế</h1>
        <p className="text-slate-400 mt-2">
          Tải biên lai các khoản ủng hộ của bạn. Mặc định hiển thị khoản <b>Đã ký quỹ/Đã đối soát</b> để tiện quyết toán.
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
          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={onlySettled}
              onChange={(e) => setOnlySettled(e.target.checked)}
            />
            Chỉ hiển thị biên lai hợp lệ (Đã ký quỹ/Đã đối soát)
          </label>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={exportCsv}>
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
              <th className="px-4 py-3 font-medium">Biên lai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-slate-300">
                  Đang tải dữ liệu…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-slate-300">
                  Không có bản ghi phù hợp.
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
                  <td className="px-4 py-3">{STATUS_LABEL[d.status]}</td>
                  <td className="px-4 py-3">{d.txId}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                      onClick={() => printReceipt(d)}
                    >
                      Tải biên lai
                    </Button>
                  </td>
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
                <td colSpan={3} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
