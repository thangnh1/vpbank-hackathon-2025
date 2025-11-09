"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DemoRole = "GUEST" | "DONOR" | "ADMIN" | "AUDITOR"

type Prefs = {
  profile: { displayName: string; email: string }
  notifications: { email: boolean; push: boolean; inapp: boolean }
  lang: "vi" | "en"
  demoRole: DemoRole
}

const LS_KEY = "settings.prefs"

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>({
    profile: { displayName: "", email: "" },
    notifications: { email: true, push: false, inapp: true },
    lang: "vi",
    demoRole: "GUEST",
  })
  const [saved, setSaved] = useState(false)

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const p = JSON.parse(raw)
        setPrefs((s) => ({ ...s, ...p }))
      }
    } catch {}
  }, [])

  const savePrefs = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const setField = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setPrefs((s) => ({ ...s, [k]: v }))
  const setProfile = (k: keyof Prefs["profile"], v: string) =>
    setPrefs((s) => ({ ...s, profile: { ...s.profile, [k]: v } }))
  const setNoti = (k: keyof Prefs["notifications"], v: boolean) =>
    setPrefs((s) => ({ ...s, notifications: { ...s.notifications, [k]: v } }))

  const isGuest = useMemo(() => prefs.demoRole === "GUEST", [prefs.demoRole])

  // Export dữ liệu cá nhân (JSON): donations (mine=true) + notifications (nếu có)
  const exportData = async () => {
    try {
      const [dRes, nRes] = await Promise.allSettled([
        fetch("/api/donations?mine=true", { cache: "no-store" }),
        fetch("/api/notifications", { cache: "no-store" }),
      ])

      let donations: any[] = []
      let notifications: any[] = []

      if (dRes.status === "fulfilled" && dRes.value.ok) {
        const j = await dRes.value.json().catch(() => ({}))
        donations = j.donations || []
      }

      if (nRes.status === "fulfilled" && nRes.value.ok) {
        const j = await nRes.value.json().catch(() => ({}))
        notifications = j.notifications || []
      }

      const payload = {
        exportedAt: new Date().toISOString(),
        prefs,
        donations,
        notifications,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "laladulara-export.json"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert("Không thể xuất dữ liệu. Vui lòng thử lại.")
    }
  }

  // Xoá dữ liệu demo cục bộ + xoá cookie anonId (client quản được vì không httpOnly)
  const resetLocal = () => {
    try {
      localStorage.removeItem(LS_KEY)
      document.cookie = "anonId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      location.reload()
    } catch {
      location.reload()
    }
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Cài đặt</h1>
        <p className="text-slate-400 mt-2">
          Tuỳ chỉnh hồ sơ, thông báo và tuỳ chọn ngôn ngữ. (Demo cho phép chọn vai trò để kiểm tra giao diện.)
        </p>
      </motion.div>

      {/* Hồ sơ */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.04] p-6 mb-6">
        <h2 className="text-white font-semibold text-lg">Hồ sơ</h2>
        <p className="text-slate-400 text-sm mt-1">
          Chế độ hiện tại:{" "}
          <b className="text-cyan-300">
            {prefs.demoRole === "GUEST"
              ? "Khách (ẩn danh)"
              : prefs.demoRole === "DONOR"
              ? "Người ủng hộ"
              : prefs.demoRole === "ADMIN"
              ? "Quản trị viên"
              : "Kiểm toán viên"}
          </b>
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Tên hiển thị</label>
            <Input
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              placeholder="VD: Nguyễn Minh"
              value={prefs.profile.displayName}
              onChange={(e) => setProfile("displayName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <Input
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              placeholder={isGuest ? "Khách ẩn danh (không bắt buộc)" : "ban@vidu.com"}
              type="email"
              value={prefs.profile.email}
              onChange={(e) => setProfile("email", e.target.value)}
              disabled={isGuest}
            />
            {isGuest && <p className="text-xs text-slate-400 mt-1">Khách ẩn danh: email không bắt buộc.</p>}
          </div>
        </div>
      </section>

      {/* Thông báo */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
        <h2 className="text-white font-semibold text-lg">Thông báo</h2>
        <p className="text-slate-400 text-sm mt-1">Chọn cách bạn muốn nhận thông báo.</p>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
            <input
              type="checkbox"
              checked={prefs.notifications.email}
              onChange={(e) => setNoti("email", e.target.checked)}
            />
            <span className="text-slate-200">Email</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
            <input
              type="checkbox"
              checked={prefs.notifications.inapp}
              onChange={(e) => setNoti("inapp", e.target.checked)}
            />
            <span className="text-slate-200">Trong ứng dụng</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
            <input
              type="checkbox"
              checked={prefs.notifications.push}
              onChange={(e) => setNoti("push", e.target.checked)}
            />
            <span className="text-slate-200">Thông báo trình duyệt</span>
          </label>
        </div>
      </section>

      {/* Ngôn ngữ & Vai trò demo */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
        <h2 className="text-white font-semibold text-lg">Ngôn ngữ & Vai trò (demo)</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Ngôn ngữ</label>
            <select
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200"
              value={prefs.lang}
              onChange={(e) => setField("lang", e.target.value as any)}
            >
              <option value="vi">Tiếng Việt (đề xuất)</option>
              <option value="en">English (beta)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-300">Vai trò demo (chỉ ảnh hưởng giao diện)</label>
            <select
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200"
              value={prefs.demoRole}
              onChange={(e) => setField("demoRole", e.target.value as DemoRole)}
            >
              <option value="GUEST">Khách (ẩn danh)</option>
              <option value="DONOR">Người ủng hộ</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="AUDITOR">Kiểm toán viên</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              * Server đã cho phép mọi vai trò (kể cả khách) ủng hộ; cài đặt này chỉ để xem thử UI theo vai.
            </p>
          </div>
        </div>
      </section>

      {/* Bảo mật & Dữ liệu */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6">
        <h2 className="text-white font-semibold text-lg">Bảo mật & Dữ liệu</h2>
        <p className="text-slate-400 text-sm mt-1">Xuất hoặc xoá dữ liệu demo trên thiết bị của bạn.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={exportData}>
            Xuất dữ liệu cá nhân (JSON)
          </Button>
          <Button
            variant="destructive"
            className="bg-rose-600 hover:bg-rose-700"
            onClick={resetLocal}
          >
            Xoá dữ liệu cục bộ (reset demo)
          </Button>

          <div className="ml-auto">
            <Button onClick={savePrefs}>
              {saved ? "Đã lưu ✓" : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
