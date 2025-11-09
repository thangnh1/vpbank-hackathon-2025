"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Donation = {
  id: string
  amount: number
  userId: string
  campaignId: string
  status: "PLEDGED" | "ESCROWED" | "SETTLED" | "REFUNDED"
  txId: string
  paymentMethod: "MOCK_QR" | "BANK_TRANSFER" | "CARD"
  message?: string
  createdAt: string
}

type Campaign = {
  id: string
  title: string
  goal: number
  raised: number
}

export default function DonatePage() {
  const router = useRouter()
  const search = useSearchParams()
  const campaignId = search.get("campaignId") || ""

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [amount, setAmount] = useState<string>("100000")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [done, setDone] = useState<Donation | null>(null) // donation result
  const [recent, setRecent] = useState<Donation[]>([]) // recent donations in this campaign (optional)

  const validAmount = useMemo(() => {
    const n = Number.parseInt(amount.replace(/[^\d]/g, ""), 10)
    return Number.isFinite(n) && n > 0 ? n : 0
  }, [amount])

  // Load campaign info (để hiển thị tiêu đề, progress)
  useEffect(() => {
    let mounted = true
    async function loadCampaign() {
      if (!campaignId) return
      setError(null)
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`, { cache: "no-store" })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || "Không tải được thông tin chiến dịch")
        }
        const j = await res.json()
        if (mounted) setCampaign(j.campaign)
      } catch (e: any) {
        if (mounted) setError(e.message || "Có lỗi xảy ra")
      }
    }
    loadCampaign()
    return () => {
      mounted = false
    }
  }, [campaignId])

  // Load recent donations (optional, hiển thị mini feed)
  const loadRecent = async () => {
    if (!campaignId) return
    try {
      const res = await fetch(`/api/donations?campaignId=${encodeURIComponent(campaignId)}`, { cache: "no-store" })
      if (res.ok) {
        const j = await res.json()
        setRecent(j.donations || [])
      }
    } catch {}
  }
  useEffect(() => {
    loadRecent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, done?.id])

  const handleDonate = async () => {
    if (!campaignId) {
      setError("Vui lòng chọn chiến dịch để ủng hộ.")
      return
    }
    if (validAmount <= 0) {
      setError("Số tiền không hợp lệ.")
      return
    }
    setLoading(true)
    setError(null)
    setDone(null)
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ đúng là headers, không phải header
        body: JSON.stringify({
          campaignId,
          amount: validAmount,
          paymentMethod: "MOCK_QR",
          message: message?.trim() || undefined,
        }),
      })
      if (res.status === 401) {
        // chưa đăng nhập → chuyển sang login (kèm next để quay lại)
        const next = `/donate?campaignId=${encodeURIComponent(campaignId)}`
        router.push(`/auth/login?next=${encodeURIComponent(next)}`)
        return
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Tạo giao dịch ủng hộ thất bại")
      }
      const j = await res.json()
      setDone(j.donation as Donation)
      // cập nhật nhanh progress campaign (raised) nếu có
      setCampaign((prev) =>
        prev ? { ...prev, raised: Math.max(0, (prev.raised || 0) + validAmount) } : prev
      )
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const pct = useMemo(() => {
    if (!campaign || (campaign.goal || 0) <= 0) return 0
    return Math.min(100, Math.round(((campaign.raised || 0) / campaign.goal) * 100))
  }, [campaign])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Ủng hộ chiến dịch</h1>
          <p className="text-slate-400 mt-2">
            Toàn bộ nội dung hiển thị bằng tiếng Việt. Giao dịch demo dùng phương thức <b>MOCK_QR</b>.
          </p>
        </motion.div>

        {/* Campaign context */}
        {campaignId ? (
          campaign ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-white font-semibold text-lg">
                    {campaign.title}
                  </h2>
                  <div className="mt-2 text-sm text-slate-300">
                    Đã gây quỹ{" "}
                    <span className="text-white font-semibold">
                      {(campaign.raised || 0).toLocaleString("vi-VN")}₫
                    </span>{" "}
                    / Mục tiêu{" "}
                    <span className="text-white font-semibold">
                      {(campaign.goal || 0).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-cyan-400 to-teal-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <Link href={`/campaigns/${campaignId}`}>
                  <Button variant="secondary">Xem chiến dịch</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 text-slate-300">
              Đang tải thông tin chiến dịch…
            </div>
          )
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 text-slate-300">
            Bạn chưa chọn chiến dịch. Vui lòng chọn từ{" "}
            <Link href="/campaigns" className="text-cyan-300 underline underline-offset-4">
              danh sách chiến dịch
            </Link>{" "}
            hoặc truyền <code>?campaignId=...</code> trên URL.
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Donate form */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.04] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-slate-300 text-sm">Số tiền (VND)</label>
              <Input
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền (ví dụ 100000)"
                className="mt-2 text-white"
              />
              <div className="mt-2 flex gap-2">
                {[100000, 200000, 500000, 1000000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
                    type="button"
                  >
                    {v.toLocaleString("vi-VN")}₫
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-slate-300 text-sm">Lời nhắn (tuỳ chọn)</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ví dụ: Chúc chiến dịch sớm hoàn thành!"
                  className="mt-2 min-h-[90px] text-white"
                />
              </div>

              <div className="mt-6">
                <Button onClick={handleDonate} disabled={!campaignId || loading || validAmount <= 0}>
                  {loading ? "Đang xử lý…" : "Tạo giao dịch ủng hộ"}
                </Button>
              </div>
            </div>

            {/* Payment preview / QR mock */}
            <div>
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <h3 className="text-white font-semibold">Phương thức thanh toán</h3>
                <p className="text-slate-300 text-sm mt-1">Demo: QR nội bộ (MOCK_QR)</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="opacity-80">Số tiền</div>
                  <div className="text-white font-semibold">
                    {validAmount.toLocaleString("vi-VN")}₫
                  </div>
                  <div className="opacity-80">Nội dung</div>
                  <div className="truncate">{message?.trim() || "(không có)"}</div>
                </div>

                <div className="mt-4 rounded-lg border border-dashed border-white/20 bg-white/5 p-4 text-center">
                  <div className="text-slate-300 text-sm">QR demo</div>
                  <div className="mt-2 text-2xl">▦</div>
                  <div className="text-slate-400 text-xs mt-1">Quét minh hoạ (không thực hiện giao dịch thật)</div>
                </div>

                {done && (
                  <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4">
                    <div className="text-emerald-300 font-semibold">Tạo giao dịch thành công</div>
                    <div className="text-slate-200 text-sm mt-1">Mã giao dịch: {done.txId}</div>
                    <div className="text-slate-400 text-xs mt-1">
                      Trạng thái: {done.status === "ESCROWED" ? "Đã ký quỹ (chờ đối soát)" : done.status}
                    </div>
                  </div>
                )}
              </div>

              {/* Mini feed recent donations (optional) */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-white font-semibold">Ủng hộ gần đây</h3>
                <div className="mt-3 space-y-2">
                  {recent.length === 0 ? (
                    <div className="text-slate-400 text-sm">Chưa có giao dịch nào gần đây.</div>
                  ) : (
                    recent.slice(0, 6).map((d) => (
                      <div key={d.id} className="flex items-center justify-between text-sm text-slate-300">
                        <span className="truncate">
                          {new Date(d.createdAt).toLocaleString("vi-VN")}
                        </span>
                        <span className="text-white font-semibold">
                          {d.amount.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Link href={`/campaigns${campaignId ? `/${campaignId}` : ""}`}>
            <Button variant="outline" className="border-white/20 hover:bg-white/10">Quay lại chiến dịch</Button>
          </Link>
          <Link href="/dashboard/donations">
            <Button variant="secondary">Xem ủng hộ của tôi</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
