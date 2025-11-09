"use client"

import type { ReactNode } from "react"
import { AceternitySidebar } from "@/components/aceternity-sidebar"
import { DASHBOARD_NAV } from "@/lib/nav"
import { SiteHeader } from "@/components/site-header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AceternitySidebar items={DASHBOARD_NAV} title="Laladulara" subtitle="User Dashboard" />
      <SiteHeader />
      <main className="ml-72 p-8">{children}</main>
    </div>
  )
}
