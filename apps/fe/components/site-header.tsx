"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"

type User = {
  userId: string
  displayName: string
  email?: string
  role?: string
  avatarUrl?: string
}

export function SiteHeader() {
  const pathname = usePathname()
  const sp = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const callback = useMemo(() => {
    const q = sp?.toString()
    const path = pathname || "/"
    return q ? `${path}?${q}` : path
  }, [pathname, sp])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        const j = await res.json()
        if (mounted) setUser(j.user || null)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
  }, [])

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    location.reload()
  }

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-2">

          {/* Auth area */}
          {loading ? (
            <div className="w-8 h-8 rounded-full animate-pulse" />
          ) : user ? (
            <div className="ml-1 flex items-center gap-3">
              <UserAvatar name={user.displayName} src={user.avatarUrl || ""} />
              <div className="hidden sm:block text-right">
                <div className="text-white text-sm font-medium leading-tight">{user.displayName}</div>
                <div className="text-slate-400 text-xs">{user.role || "user"}</div>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Dashboard</Button>
              </Link>
              <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={onLogout}>Đăng xuất</Button>
            </div>
          ) : (
            <Link href={`/auth/login?callback=${encodeURIComponent(callback)}`}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Đăng nhập</Button>
            </Link>
          )}
        </div>

    </header>
  )
}
