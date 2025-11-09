"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AceternitySidebar } from "@/components/aceternity-sidebar"

type Status = "PENDING" | "APPROVED" | "REJECTED"

type CampaignRequest = {
  id: string
  title: string
  details: string
  requestedBy: string
  status: Status
  reason?: string
  createdAt: string
  updatedAt: string
}

const adminItems = [
  { name: "Tổng quan", href: "/admin" },
  { name: "Chiến dịch", href: "/admin/campaigns" },
  { name: "Yêu cầu chiến dịch", href: "/admin/campaign-requests" },
  { name: "Giải ngân", href: "/admin/disbursements" },
  { name: "Nhân sự & Quyền", href: "/admin/team" },
  { name: "Cài đặt", href: "/admin/settings" },
]

export default function CampaignRequestsPage() {
  const [requests, setRequests] = useState<CampaignRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // dialog state
  const [open, setOpen] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [action, setAction] = useState<"APPROVE" | "REJECT" | null>(null)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const pending = useMemo(() => requests.filter((r) => r.status === "PENDING"), [requests])
  const approved = useMemo(() => requests.filter((r) => r.status === "APPROVED"), [requests])
  const rejected = useMemo(() => requests.filter((r) => r.status === "REJECTED"), [requests])

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/campaign-requests", { cache: "no-store" })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Không tải được danh sách yêu cầu")
      }
      const data = await res.json()
      setRequests(data.requests || [])
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const openDialog = (id: string, act: "APPROVE" | "REJECT") => {
    setCurrentId(id)
    setAction(act)
    setReason("")
    setOpen(true)
  }

  const submitDecision = async () => {
    if (!currentId || !action) return
    if (action === "REJECT" && !reason.trim()) {
      setError("Vui lòng nhập lý do từ chối.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/campaign-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentId, action, reason: reason.trim() || undefined }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Cập nhật trạng thái thất bại")
      }
      await fetchRequests()
      setOpen(false)
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AceternitySidebar items={adminItems} title="Laladulara" subtitle="Admin Dashboard" />

      <main className="ml-72 p-8">
        <div className="max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Yêu cầu tạo chiến dịch</h1>
            <p className="text-gray-400 mt-2">
              Xem xét và duyệt/từ chối yêu cầu. Khi cập nhật, người gửi yêu cầu sẽ nhận thông báo ngay.
            </p>
          </motion.div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <SummaryCard label="Đang chờ" value={pending.length} className="from-yellow-500/15 to-orange-500/10" />
            <SummaryCard label="Đã duyệt" value={approved.length} className="from-emerald-500/15 to-teal-500/10" />
            <SummaryCard label="Đã từ chối" value={rejected.length} className="from-rose-500/15 to-pink-500/10" />
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-slate-300">Đang tải dữ liệu…</div>
          ) : requests.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">
              Chưa có yêu cầu nào.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-semibold text-lg">{r.title}</h3>
                        <StatusPill status={r.status} />
                      </div>
                      <p className="text-slate-300 mt-1">{r.details}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        <span>Người yêu cầu: <span className="text-slate-200">{r.requestedBy}</span></span>
                        <span className="opacity-50">•</span>
                        <span>Gửi lúc: {new Date(r.createdAt).toLocaleString("vi-VN")}</span>
                        {r.reason ? (
                          <>
                            <span className="opacity-50">•</span>
                            <span>Ghi chú: <span className="text-slate-200">{r.reason}</span></span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* Actions */}
                    {r.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => openDialog(r.id, "REJECT")}
                        >
                          Từ chối
                        </Button>
                        <Button onClick={() => openDialog(r.id, "APPROVE")}>Duyệt</Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialog lý do */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "APPROVE" ? "Duyệt yêu cầu chiến dịch" : "Từ chối yêu cầu chiến dịch"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              {action === "APPROVE"
                ? "Bạn có thể thêm ghi chú cho người gửi (không bắt buộc)."
                : "Vui lòng nêu rõ lý do từ chối để người gửi có thể chỉnh sửa/hoàn thiện."}
            </p>
            <Textarea
              placeholder={action === "APPROVE" ? "Ghi chú (tuỳ chọn)" : "Lý do từ chối (bắt buộc)"}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Huỷ
            </Button>
            <Button onClick={submitDecision} disabled={submitting}>
              {submitting ? "Đang xử lý…" : action === "APPROVE" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string }> = {
    PENDING: { label: "Đang chờ", cls: "bg-yellow-500/20 text-yellow-300" },
    APPROVED: { label: "Đã duyệt", cls: "bg-emerald-500/20 text-emerald-300" },
    REJECTED: { label: "Đã từ chối", cls: "bg-rose-500/20 text-rose-300" },
  }
  const { label, cls } = map[status]
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}

function SummaryCard({ label, value, className = "" }: { label: string; value: number; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] ${className} p-5`}>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
