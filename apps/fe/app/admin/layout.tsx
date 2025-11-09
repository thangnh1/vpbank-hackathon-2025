"use client"

import type { ReactNode } from "react"
import { AceternitySidebar } from "@/components/aceternity-sidebar"
import { ADMIN_NAV } from "@/lib/nav"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AceternitySidebar items={ADMIN_NAV} title="Laladulara" subtitle="Admin Dashboard" />
      <main className="ml-72 p-8">{children}</main>
    </div>
  )
}
